import { Button, CircularProgress, type ButtonProps } from '@mui/material';

type Props = ButtonProps & {
  loading?: boolean;
};

export default function LoadingButton({
  loading = false,
  disabled,
  children,
  ...rest
}: Props) {
  return (
    <Button disabled={disabled || loading} {...rest}>
      {loading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        children
      )}
    </Button>
  );
}
