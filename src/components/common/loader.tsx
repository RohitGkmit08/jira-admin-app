import {
  Box,
  CircularProgress,
  Typography,
  type BoxProps,
} from '@mui/material';

type AppLoaderProps = BoxProps & {
  fullScreen?: boolean;
  message?: string;
};

export default function Loader({
  fullScreen,
  message,
  sx,
  ...props
}: AppLoaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: fullScreen ? '100vh' : '100%',
        width: fullScreen ? '100vw' : '100%',
        minHeight: fullScreen ? 'auto' : 200,
        ...sx,
      }}
      {...props}
    >
      <CircularProgress />
      {message && (
        <Typography mt={2} color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}
