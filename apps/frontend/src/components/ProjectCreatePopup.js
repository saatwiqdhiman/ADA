import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, Box } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

const ProjectCreatePopup = ({ open, handleClose, addNewProject }) => {
  const [projectData, setProjectData] = useState({
    name: '',
    description: ''
  });

  const handleChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = Cookies.get('token'); // Fetch the token from cookies
    
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/projects', {
        name: projectData.name,
        description: projectData.description
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token  // Make sure the token is passed in the headers
        }
      });

      console.log("Project Created Successfully: ", response.data);
      addNewProject(response.data);  // Add the new project to the list on HomePage
      handleClose();  // Close the popup after successful submission
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project');
    }
  };
  
  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ style: { backgroundColor: '#1e1e1e', color: '#fff', borderRadius: '8px', padding: '16px', width: '400px' } }}>
      <DialogTitle sx={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>Create a new project</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ marginBottom: '8px', color: '#bbb' }}>Project name</Typography>
          <TextField
            name="name"
            placeholder="Give your project a name"
            type="text"
            fullWidth
            value={projectData.name}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              style: { backgroundColor: '#2a2a2a', color: '#fff', borderRadius: '8px', padding: '8px' },
            }}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ marginBottom: '8px', color: '#bbb' }}>Description</Typography>
          <TextField
            name="description"
            placeholder="Description"
            fullWidth
            multiline
            rows={3}
            value={projectData.description}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              style: { backgroundColor: '#2a2a2a', color: '#fff', borderRadius: '8px', padding: '8px' },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', marginTop: '16px' }}>
        <Button
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#6C63FF',
            color: '#fff',
            padding: '8px 24px',
            fontWeight: 'bold',
            ':hover': {
              backgroundColor: '#5a52cc',
            },
            borderRadius: '8px'
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectCreatePopup;
