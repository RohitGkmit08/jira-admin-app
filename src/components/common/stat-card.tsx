import { Paper, Typography } from '@mui/material';

type Props = {
  label: string;
  value: number | string;
};

export default function StatCard({ label, value }: Props) {
  return (
    <Paper variant="outlined" sx={{ p: 2, minWidth: 160 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="h4">{value}</Typography>
    </Paper>
  );
}
