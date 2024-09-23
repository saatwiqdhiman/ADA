import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import api from '../../utils/api';
import Sidebar from '../../components/Sidebar';
import ManualUpload from '../../components/ManualUpload';
import ApiIntegrations from '../../components/ApiIntegrations';
import ChatArea from '../../components/ChatArea';

const ProjectDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showDataIngestion, setShowDataIngestion] = useState(false);
  const [showManualUpload, setShowManualUpload] = useState(false);
  const [showApiIntegrations, setShowApiIntegrations] = useState(false);
  const [fileType, setFileType] = useState('csv');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [dataSources, setDataSources] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState('Loading...');
  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const router = useRouter();

  // Extract projectId from the URL and fetch project details
  useEffect(() => {
    if (router.query.projectid) {
      setProjectId(router.query.projectid);
      console.log('Router query projectid:', router.query.projectid); // Debugging projectId from the URL
      fetchProjectDetails(router.query.projectid);
    }
  }, [router.query.projectid]);

  // Function to fetch project details, including the project name
  const fetchProjectDetails = async (id) => {
    try {
      setIsProjectLoading(true);
      console.log(`Fetching project details for projectId: ${id}`); // Debugging projectId

      const response = await api.get(`/api/projects/${id}`);
      console.log('API Response:', response); // Debugging API response

      if (response && response.data) {
        setProjectName(response.data.name); // Set the project name in state
        console.log('Project Name:', response.data.name); // Debugging the project name
      } else {
        console.error('No data found in API response');
        setProjectName('Project not found');
      }
    } catch (error) {
      console.error('Error fetching project details:', error); // Debugging errors
      setProjectName('Failed to load project name');
    } finally {
      setIsProjectLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchDataSources();
    }
  }, [projectId]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatInput.trim() !== '') {
      setChatHistory([...chatHistory, { sender: 'user', message: chatInput }]);
      setChatInput('');
    }
  };

  const handleShowDataIngestion = () => {
    setShowDataIngestion(true);
    setShowManualUpload(false);
    setShowApiIntegrations(false);
  };

  const handleShowChat = () => {
    setShowDataIngestion(false);
    setShowManualUpload(false);
    setShowApiIntegrations(false);
  };

  const handleManualUploadClick = () => {
    setShowManualUpload(true);
    setShowApiIntegrations(false);
  };

  const handleApiIntegrationsClick = () => {
    setShowApiIntegrations(true);
    setShowManualUpload(false);
  };

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedExtensions = fileType === 'csv' ? ['csv'] : ['sql'];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        alert(`Invalid file type. Please select a ${fileType.toUpperCase()} file.`);
        e.target.value = '';
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit.');
        e.target.value = '';
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    if (!projectId) {
      alert('Project ID is not available. Please make sure you accessed this page correctly.');
      return;
    }

    setIsUploading(true);
    setUploadMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('fileType', fileType);
      formData.append('projectId', projectId);

      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadMessage('File uploaded and processed successfully!');
      setSnackbarOpen(true);
      setSelectedFile(null);
      fetchDataSources();
    } catch (error) {
      setUploadMessage('Failed to upload and process file.');
      setSnackbarOpen(true);
    } finally {
      setIsUploading(false);
    }
  };

  const fetchDataSources = async () => {
    try {
      const response = await api.get('/api/data-sources', {
        params: { projectId },
      });
      setDataSources(response.data);
    } catch (error) {
      console.error('Error fetching data sources:', error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setUploadMessage(null);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#121212' }}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleShowChat={handleShowChat}
        handleShowDataIngestion={handleShowDataIngestion}
        projectName={isProjectLoading ? 'Loading...' : projectName}
      />

      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          position: 'relative',
          transition: 'padding-left 0.3s ease-in-out',
          pl: isSidebarOpen ? '16px' : '64px',
        }}
      >
        {!isSidebarOpen && (
          <IconButton
            onClick={toggleSidebar}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              backgroundColor: '#1e1e1e',
              borderRadius: '50%',
              padding: '10px',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            <MenuIcon sx={{ color: '#6C63FF' }} />
          </IconButton>
        )}

        {showDataIngestion ? (
          showManualUpload ? (
            <ManualUpload
              fileType={fileType}
              handleFileTypeChange={handleFileTypeChange}
              selectedFile={selectedFile}
              handleFileChange={handleFileChange}
              handleFileUpload={handleFileUpload}
              isUploading={isUploading}
              uploadMessage={uploadMessage}
              snackbarOpen={snackbarOpen}
              handleSnackbarClose={handleSnackbarClose}
              handleShowDataIngestion={handleShowDataIngestion}
            />
          ) : showApiIntegrations ? (
            <ApiIntegrations handleShowDataIngestion={handleShowDataIngestion} />
          ) : (
            <Box>
              <Typography variant="h4" sx={{ color: '#fff', mb: 4 }}>
                Data Ingestion Hub
              </Typography>

              {/* Manual Upload and API Integrations Tiles */}
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
                  onClick={handleManualUploadClick}
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

              {/* List of Connected Data Sources */}
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
                          sx={{ color: '#fff', userSelect: 'none' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography sx={{ color: '#fff' }}>No data sources connected yet.</Typography>
                )}
              </Box>
            </Box>
          )
        ) : (
          <ChatArea
            chatHistory={chatHistory}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleChatSubmit={handleChatSubmit}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProjectDashboard;
