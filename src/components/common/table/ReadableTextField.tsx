import { TextField, TextFieldProps, Typography, styled } from '@mui/material';

type Props = {
  readonly: boolean;
  size?: TextFieldProps['size'];
  multiline?: TextFieldProps['multiline'];
  value: string;
  onChange: (value: string) => void;
};

// Set the same padding as for the text input to avoid
// movements between Typography and Textfield texts.
const ReadyonlyTextField = styled(Typography)({
  padding: '8px 14px',
});

const ReadableTextField = ({
  readonly,
  value,
  onChange,
  size,
  multiline,
}: Props): JSX.Element => {
  const handleOnChanges = (newValue: string): void => {
    onChange(newValue);
  };

  return readonly ? (
    <ReadyonlyTextField>{value}</ReadyonlyTextField>
  ) : (
    <TextField
      size={size}
      multiline={multiline}
      value={value}
      onChange={(e) => handleOnChanges(e.target.value)}
      fullWidth
      sx={{
        minWidth: '150px',
      }}
    />
  );
};

export default ReadableTextField;
