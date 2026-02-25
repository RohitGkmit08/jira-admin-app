import { useParams } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';

import PageContainer from '../../../components/common/page-container';

export default function ProjectDetailsPage() {
  const { projectId } = useParams();

  return (
    <PageContainer title="Project">
      <Box mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Project ID: {projectId}
        </Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Typography>Board</Typography>
      </Paper>
    </PageContainer>
  );
}
