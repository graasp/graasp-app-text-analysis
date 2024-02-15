import { TextField, TextFieldProps, Typography } from '@mui/material';

type Props = {
  readonly: boolean;
  size?: TextFieldProps['size'];
  multiline?: TextFieldProps['multiline'];
  value: string;
  onChange: (value: string) => void;
};

const DebouncedTextField = ({
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
    <Typography>{value}</Typography>
  ) : (
    <TextField
      size={size}
      multiline={multiline}
      value={value}
      onChange={(e) => handleOnChanges(e.target.value)}
    />
  );
};

export default DebouncedTextField;
