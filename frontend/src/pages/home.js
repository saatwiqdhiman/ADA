import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  TextField,
  Menu,
  MenuItem,
} from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import axios from 'axios';
import ProjectCreatePopup from '../components/ProjectCreatePopup'; // Ensure correct import

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '' });
  const [anchorEl, setAnchorEl] = useState(null); // For the dropdown menu
  const [openPopup, setOpenPopup] = useState(false); // State to control the popup visibility
  const router = useRouter();

  useEffect(() => {
    const fetchProjectsAndUser = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/auth');
        } else {
          // Fetching projects
          const projectResponse = await axios.get('http://localhost:5000/api/projects', {
            headers: {
              'x-auth-token': token,
            },
          });
          setProjects(projectResponse.data);

          // Fetching user details
          const userResponse = await axios.get('http://localhost:5000/api/profile', {
            headers: {
              'x-auth-token': token,
            },
          });
          setUser(userResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProjectsAndUser();
  }, []);

  // Function to add the newly created project to the projects state
  const addNewProject = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const handleOpenProject = async (projectId) => {
    try {
      const token = Cookies.get('token');
      await axios.put(`http://localhost:5000/api/projects/${projectId}/open`, {}, {
        headers: {
          'x-auth-token': token,
        },
      });

      // Redirect to project dashboard
      router.push(`/project-dashboard/${projectId}`);
    } catch (error) {
      console.error('Error opening project:', error);
    }
  };

  const handleProfileMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the dropdown
  };

  const handleCloseMenu = () => {
    setAnchorEl(null); // Close the dropdown
  };

  const handleLogout = () => {
    Cookies.remove('token'); // Clear token on logout
    router.push('/auth');
  };

  const togglePopup = () => {
    setOpenPopup(!openPopup); // Toggle the popup visibility
  };

  return (
    <Box
      sx={{
        pt: 4,
        px: 2,
        width: '100vw',
        minHeight: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0f0c29',
      }}
    >
      {/* Header with logo and profile */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '100vw',
          px: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt="Platform Logo" src="/path-to-your-logo.png" sx={{ mr: 2, width: 50, height: 50 }} />
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#fff' }}>
            AIDA
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2, backgroundColor: '#6C63FF', padding: '10px 20px', fontSize: '16px' }}
            onClick={togglePopup} // Open the popup instead of navigating to another page
          >
            CREATE A PROJECT
          </Button>
          <IconButton onClick={handleProfileMenuClick}>
            <Avatar alt={`${user.firstName} ${user.lastName}`} src="/path-to-profile-image.jpg" sx={{ width: 40, height: 40 }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            PaperProps={{
              style: {
                backgroundColor: '#1e1e1e',
                color: '#fff',
              },
            }}
          >
            <MenuItem onClick={handleCloseMenu}>My Plan</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Search and Recent Projects */}
      <Box
        sx={{
          mt: 4,
          px: 2,
          width: '100%',
          maxWidth: '100vw',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
          Recent Projects
        </Typography>
        <TextField
          placeholder="Search Project"
          variant="outlined"
          sx={{
            backgroundColor: '#1e1e1e',
            borderRadius: '8px',
            input: { color: '#fff' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#6C63FF',
              },
              '&:hover fieldset': {
                borderColor: '#fff',
              },
            },
            mb: 4,
            width: '80%',
            maxWidth: '600px',
          }}
        />
        <Grid container spacing={3} sx={{ width: '80%' }}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={3} key={project._id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  backgroundColor: '#232323',
                  color: '#fff',
                  borderRadius: '8px',
                  minHeight: '120px',
                  '&:hover': {
                    backgroundColor: '#333',
                  },
                }}
                onClick={() => handleOpenProject(project._id)}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>
                    {project.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Popup for Creating a Project */}
      <ProjectCreatePopup open={openPopup} handleClose={togglePopup} addNewProject={addNewProject} />
    </Box>
  );
};

export default HomePage;
