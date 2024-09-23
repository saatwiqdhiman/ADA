import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { login, register } from '../../services/authService';
import GoogleIcon from '@mui/icons-material/Google';
import Cookies from 'js-cookie';

const AuthPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    reEnterPassword: ''
  });
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  const { firstName, lastName, email, password, reEnterPassword } = formData;

  // Handle form field changes
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // Submit for login or signup based on the form mode
  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        // Handle login
        await login(email, password);
        alert('Login successful!');
        window.location.href = '/home';  // Redirect to home after login
      } else {
        // Handle registration
        if (password !== reEnterPassword) {
          alert('Passwords do not match');
          return;
        }
        await register(firstName, lastName, email, password);
        alert('Registration successful! Please log in.');
        setIsLogin(true); // After signup, switch to the login form
      }
    } catch (error) {
      console.error('Error during submission:', error);
      alert(error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: '#1e1e1e',
          padding: 4,
          borderRadius: 3,
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          {isLogin ? 'Log in' : 'Sign up'}
        </Typography>

        <Typography variant="subtitle1" sx={{ marginBottom: 3 }}>
          {isLogin
            ? 'Already a member? Log in now'
            : 'Create a new account'}
        </Typography>

        <Box component="form" onSubmit={onSubmit}>
          {!isLogin && (
            <>
              <TextField
                name="firstName"
                fullWidth
                label="First Name"
                value={firstName}
                onChange={onChange}
                margin="normal"
                required
                InputProps={{
                  style: { backgroundColor: '#1e1e1e', color: '#fff' },
                }}
                InputLabelProps={{
                  style: { color: '#bbb' },
                }}
              />
              <TextField
                name="lastName"
                fullWidth
                label="Last Name"
                value={lastName}
                onChange={onChange}
                margin="normal"
                required
                InputProps={{
                  style: { backgroundColor: '#1e1e1e', color: '#fff' },
                }}
                InputLabelProps={{
                  style: { color: '#bbb' },
                }}
              />
            </>
          )}

          <TextField
            name="email"
            fullWidth
            label="Email"
            value={email}
            onChange={onChange}
            margin="normal"
            required
            InputProps={{
              style: { backgroundColor: '#1e1e1e', color: '#fff' },
            }}
            InputLabelProps={{
              style: { color: '#bbb' },
            }}
          />

          <TextField
            name="password"
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={onChange}
            margin="normal"
            required
            InputProps={{
              style: { backgroundColor: '#1e1e1e', color: '#fff' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: '#bbb' },
            }}
          />

          {!isLogin && (
            <TextField
              name="reEnterPassword"
              fullWidth
              label="Re-enter Password"
              type={showPassword ? 'text' : 'password'}
              value={reEnterPassword}
              onChange={onChange}
              margin="normal"
              required
              InputProps={{
                style: { backgroundColor: '#1e1e1e', color: '#fff' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: { color: '#bbb' },
              }}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
              backgroundColor: '#6C63FF',
              color: '#fff',
              fontWeight: 'bold',
              ':hover': {
                backgroundColor: '#5a52cc',
              },
            }}
          >
            {isLogin ? 'Log in' : 'Sign up'}
          </Button>

          <Typography
            variant="body2"
            sx={{ marginBottom: 2, cursor: 'pointer' }}
            onClick={() => setIsLogin(!isLogin)} // Toggle between login and signup
          >
            {isLogin ? 'Create a new account' : 'Already a member? Log in now'}
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              color: '#fff',
              borderColor: '#fff',
              ':hover': {
                borderColor: '#ccc',
              },
            }}
          >
            Continue with Google
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthPage;
