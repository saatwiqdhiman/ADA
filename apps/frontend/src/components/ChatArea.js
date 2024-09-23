import React from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';

const ChatArea = ({ chatHistory, chatInput, setChatInput, handleChatSubmit }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', backgroundColor: '#181818', borderRadius: '8px', p: 2 }}>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: '10px' }}>
        {chatHistory.map((chat, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: chat.sender === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
            <Box sx={{ backgroundColor: chat.sender === 'user' ? '#6C63FF' : '#333', color: '#fff', borderRadius: '8px', padding: '10px 15px', maxWidth: '70%' }}>
              {chat.message}
            </Box>
          </Box>
        ))}
      </Box>

      <form onSubmit={handleChatSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type here..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            sx={{
              backgroundColor: '#333',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#6C63FF' },
              },
              input: { color: '#fff' },
            }}
          />
          <IconButton type="submit" sx={{ ml: 1 }}>
            <Typography variant="body1" sx={{ color: '#6C63FF' }}>
              ➤
            </Typography>
          </IconButton>
        </Box>
      </form>
    </Box>
  );
};

export default ChatArea;
