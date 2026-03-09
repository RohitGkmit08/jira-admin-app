import {
  Dialog as MuiDialog,
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

const Dialog = ({ open, onClose, title, actions, children }: Props) => {
  return (
    <MuiDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {children}
      </DialogContent>

      <DialogActions>{actions}</DialogActions>
    </MuiDialog>
  );
};

export default Dialog;
