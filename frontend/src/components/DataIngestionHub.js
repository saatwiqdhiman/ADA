import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const DataIngestionHub = ({ handleManualUploadClick, handleApiIntegrationsClick, dataSources }) => (
  <Box>
    <Typography variant="h4" sx={{ color: '#fff', mb: 4 }}>
      Data Ingestion Hub
    </Typography>

    <Box sx={{ display: 'flex', gap: 2 }}>
      <Card
        sx={{
          cursor: 'pointer',
          backgroundColor: '#232323',
          color: '#fff',
          borderRadius: '8px',
          padding: '20px',
          width: '200px',
          '&:hover': {
            backgroundColor: '#333',
          },
        }}
        onClick={handleManualUploadClick} // Correctly opening the manual upload screen
      >
        <CardContent>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
            Manual Upload
          </Typography>
          <Typography variant="body2" sx={{ color: '#aaa' }}>
            Upload CSV/SQL files
          </Typography>
        </CardContent>
      </Card>

      <Card
        sx={{
          cursor: 'pointer',
          backgroundColor: '#232323',
          color: '#fff',
          borderRadius: '8px',
          padding: '20px',
          width: '200px',
          '&:hover': {
            backgroundColor: '#333',
          },
        }}
        onClick={handleApiIntegrationsClick}
      >
        <CardContent>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
            API Integrations
          </Typography>
          <Typography variant="body2" sx={{ color: '#aaa' }}>
            Connect to external APIs
          </Typography>
        </CardContent>
      </Card>
    </Box>

    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
        Connected Data Sources
      </Typography>
      {dataSources.length > 0 ? (
        <List>
          {dataSources.map((dataSource) => (
            <ListItem key={dataSource._id}>
              <ListItemText
                primary={dataSource.name}
                secondary={dataSource.type}
                sx={{ color: '#fff' }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography sx={{ color: '#fff' }}>No data sources connected yet.</Typography>
      )}
    </Box>
  </Box>
);

export default DataIngestionHub;
