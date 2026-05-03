import {
  Button as MuiButton,
  CircularProgress,
  type ButtonProps as MuiButtonProps,
} from '@mui/material';

export type ButtonProps = MuiButtonProps & {
  loading?: boolean;
};

const Button = ({
  loading,
  disabled,
  children,
  startIcon,
  endIcon,
  ...props
}: ButtonProps) => {
  const isDisabled = Boolean(disabled || loading);

  return (
    <MuiButton
      disabled={isDisabled}
      startIcon={loading ? undefined : startIcon}
      endIcon={loading ? undefined : endIcon}
      {...props}
    >
      {loading ? (
        <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
      ) : null}
      {children}
    </MuiButton>
  );
};

export default Button;
