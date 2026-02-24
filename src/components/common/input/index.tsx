import { TextField, type TextFieldProps } from '@mui/material';

type Props = TextFieldProps;

export default function Input(props: Props) {
  return <TextField fullWidth {...props} />;
}
