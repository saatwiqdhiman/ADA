import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const ApiIntegrations = ({ handleShowDataIngestion }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={handleShowDataIngestion}>
          <ArrowBackIcon sx={{ color: '#6C63FF' }} />
        </IconButton>
        <Typography variant="h4" sx={{ color: '#fff', ml: 2 }}>
          API Integrations
        </Typography>
      </Box>

      <Typography sx={{ color: '#fff' }}>API Integration features will be implemented here.</Typography>
    </Box>
  );
};

export default ApiIntegrations;
