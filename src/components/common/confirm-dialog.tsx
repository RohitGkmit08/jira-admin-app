import { Typography } from '@mui/material';

import Dialog from './dialog';
import Button from './button';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  confirmColor?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
};

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  confirmColor = 'primary',
}: Props) => {
  const handleClose = () => {
    if (loading) {
      return;
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={title}
      actions={
        <>
          <Button onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant="contained"
            color={confirmColor}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      {typeof message === 'string' ? (
        <Typography>{message}</Typography>
      ) : (
        message
      )}
    </Dialog>
  );
};

export default ConfirmDialog;
