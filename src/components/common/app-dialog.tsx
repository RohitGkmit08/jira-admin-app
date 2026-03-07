import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  actions: React.ReactNode;
  children: React.ReactNode;
};

export default function AppDialog({
  open,
  onClose,
  title,
  actions,
  children,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {children}
      </DialogContent>

      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
}
