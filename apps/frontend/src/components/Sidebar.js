// components/Sidebar.js

import React from 'react';
import { Drawer, Box, Typography, IconButton, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Close as CloseIcon, ChatBubbleOutline, Storage } from '@mui/icons-material';

const Sidebar = ({ isSidebarOpen, toggleSidebar, handleShowChat, handleShowDataIngestion, projectName }) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isSidebarOpen}
      sx={{
        width: isSidebarOpen ? 240 : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isSidebarOpen ? 240 : 0,
          backgroundColor: '#1e1e1e',
          color: '#fff',
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ userSelect: 'none' }}>
          {projectName || 'Loading...'} {/* Display the project name */}
        </Typography>
        <IconButton onClick={toggleSidebar}>
          <CloseIcon sx={{ color: '#6C63FF' }} />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        sx={{
          mt: 2,
          mx: 2,
          backgroundColor: '#6C63FF',
          color: '#fff',
          borderRadius: '8px',
          textTransform: 'none',
        }}
      >
        New Thread
      </Button>

      <List>
        <ListItem
          button
          onClick={handleShowChat}
          sx={{
            '&:hover': {
              backgroundColor: '#333',
              transform: 'scale(1.02)',
              transition: 'all 0.2s ease-in-out',
            },
            '&:active': {
              backgroundColor: '#444',
              transform: 'scale(0.98)',
              transition: 'all 0.1s ease-in-out',
            },
            userSelect: 'none',
          }}
        >
          <ListItemIcon>
            <ChatBubbleOutline sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary="Threads" sx={{ userSelect: 'none' }} />
        </ListItem>

        <ListItem
          button
          onClick={handleShowDataIngestion}
          sx={{
            '&:hover': {
              backgroundColor: '#333',
              transform: 'scale(1.02)',
              transition: 'all 0.2s ease-in-out',
            },
            '&:active': {
              backgroundColor: '#444',
              transform: 'scale(0.98)',
              transition: 'all 0.1s ease-in-out',
            },
            userSelect: 'none',
          }}
        >
          <ListItemIcon>
            <Storage sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary="Data Ingestion Hub" sx={{ userSelect: 'none' }} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
