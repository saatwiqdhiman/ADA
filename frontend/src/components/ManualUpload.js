import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  CircularProgress,
  Snackbar,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const ManualUpload = ({
  fileType,
  handleFileTypeChange,
  selectedFile,
  handleFileChange,
  handleFileUpload,
  isUploading,
  uploadMessage,
  snackbarOpen,
  handleSnackbarClose,
  handleShowDataIngestion,
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={handleShowDataIngestion}>
          <ArrowBackIcon sx={{ color: '#6C63FF' }} />
        </IconButton>
        <Typography variant="h4" sx={{ color: '#fff', ml: 2 }}>
          Manual Upload
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <FormControl
          variant="outlined"
          sx={{
            minWidth: 200,
            backgroundColor: '#1e1e1e',
            borderRadius: '8px',
            '.MuiInputBase-root': { color: '#fff' },
            '.MuiOutlinedInput-notchedOutline': { borderColor: '#6C63FF' },
          }}
        >
          <InputLabel id="file-type-label" sx={{ color: '#fff' }}>
            Select File Type
          </InputLabel>
          <Select
            labelId="file-type-label"
            value={fileType}
            onChange={handleFileTypeChange}
            label="Select File Type"
            sx={{
              color: '#fff',
              '.MuiSvgIcon-root': { color: '#fff' },
            }}
          >
            <MenuItem value="csv">CSV</MenuItem>
            <MenuItem value="sql">SQL</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          component="label"
          sx={{
            backgroundColor: '#6C63FF',
            color: '#fff',
            borderRadius: '8px',
            textTransform: 'none',
            height: '56px',
          }}
        >
          Select File
          <input type="file" hidden accept={fileType === 'csv' ? '.csv' : '.sql'} onChange={handleFileChange} />
        </Button>
      </Box>

      {selectedFile && (
        <Typography sx={{ color: '#fff', mb: 2 }}>Selected File: {selectedFile.name}</Typography>
      )}

      <Button
        variant="contained"
        onClick={handleFileUpload}
        sx={{
          backgroundColor: '#6C63FF',
          color: '#fff',
          borderRadius: '8px',
          textTransform: 'none',
          width: '200px',
        }}
        disabled={isUploading}
      >
        {isUploading ? 'Processing...' : 'Upload & Process'}
      </Button>

      {isUploading && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <CircularProgress sx={{ color: '#6C63FF', mr: 2 }} size={24} />
          <Typography sx={{ color: '#fff' }}>Processing, please wait...</Typography>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={uploadMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: {
            backgroundColor: uploadMessage?.includes('successfully') ? 'green' : 'red',
          },
        }}
      />
    </Box>
  );
};

export default ManualUpload;
