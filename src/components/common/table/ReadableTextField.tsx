import { TextField, TextFieldProps, Typography, styled } from '@mui/material';

import { buildEditableTableTextInputCy } from '@/config/selectors';

type Props = {
  readonly: boolean;
  size?: TextFieldProps['size'];
  multiline?: TextFieldProps['multiline'];
  value: string | unknown;
  rowId: string;
  fieldName: string;
  onChange: (value: string) => void;
};

// Set the same padding as for the text input to avoid
// movements between Typography and Textfield texts.
const ReadyonlyTextField = styled(Typography)(({ theme }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
}));

const ReadableTextField = ({
  rowId,
  value,
  fieldName,
  size,
  multiline,
  readonly,
  onChange,
}: Props): JSX.Element => {
  const dataCy = buildEditableTableTextInputCy(rowId, fieldName, readonly);

  return readonly ? (
    <ReadyonlyTextField data-cy={dataCy}>{`${value}`}</ReadyonlyTextField>
  ) : (
    <TextField
      data-cy={dataCy}
      size={size}
      multiline={multiline}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      sx={{
        minWidth: '25ch',
      }}
    />
  );
};

export default ReadableTextField;
