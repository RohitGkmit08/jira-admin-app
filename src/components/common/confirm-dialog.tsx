import {
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import FormActions from './form-actions';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  loading?: boolean;
  confirmColor?: 'primary' | 'error' | 'inherit';
};

export default function ConfirmDialog({
  open,
  onClose,
  title,
  message,
  confirmLabel,
  onConfirm,
  loading = false,
  confirmColor = 'error',
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>{message}</DialogContent>

      <FormActions
        onCancel={onClose}
        submitLabel={confirmLabel}
        onSubmit={onConfirm}
        loading={loading}
        submitColor={confirmColor}
      />
    </Dialog>
  );
}
