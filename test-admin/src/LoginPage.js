import { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import { Box, Button, Card, TextField } from '@mui/material';

const LoginPage = ({ theme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();
  const notify = useNotify();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ username: email, password })
      .catch(() => notify('Invalid email or password', { type: 'error' }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'url(/school-bg.jpg)',
        backgroundSize: 'cover',
      }}
    >
      <Card sx={{ padding: 4, width: 300 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <img 
            src="/school-logo.png" 
            alt="Literacy Tree School" 
            style={{ width: '100%', marginBottom: 20 }}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            sx={{ mt: 2 }}
          >
            Log in
          </Button>
        </Box>
      </Card>
      <Notification />
    </Box>
  );
};

export default LoginPage;