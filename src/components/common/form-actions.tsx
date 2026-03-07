import { DialogActions, Button } from '@mui/material';

import LoadingButton from './loading-button';

type Props = {
  onCancel: () => void;
  submitLabel: string;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
  submitColor?: 'primary' | 'error' | 'inherit';
};

export default function FormActions({
  onCancel,
  submitLabel,
  onSubmit,
  loading = false,
  disabled = false,
  submitColor = 'primary',
}: Props) {
  return (
    <DialogActions>
      <Button onClick={onCancel}>Cancel</Button>

      <LoadingButton
        variant="contained"
        onClick={onSubmit}
        loading={loading}
        disabled={disabled}
        color={submitColor}
      >
        {submitLabel}
      </LoadingButton>
    </DialogActions>
  );
}
