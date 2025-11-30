import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import BadgeIcon from "@mui/icons-material/Badge"; // For staff ID field
import api from "../api/api";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Email as EmailIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    staffId: "", // Added staff ID field
    showPassword: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", { 
        email: formData.email,
        staffId: formData.staffId 
      });

      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
        staffId: formData.staffId, // Include staff ID in the request
      });

      console.log("Login response:", response.data);

      localStorage.setItem("token", response.data.token);
      navigate("/admin");
    } catch (err) {
      console.error("Login error details:", {
        message: err.message,
        response: err.response,
        request: err.request
      });

      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials and staff ID."
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  return (
    <Grid
      container
      component="main"
      sx={{
        height: "100vh",
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: { xs: 2, sm: 3 },
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url(/_MG_4539.JPG)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(20, 20, 60, 0.4)",
          zIndex: -1,
        },
      }}
    >
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        lg={4}
        xl={3}
        component={Paper}
        elevation={6}
        sx={{
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          padding: { xs: 1.5, sm: 2.5 },
          margin: 1,
          maxWidth: "380px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* School Logo */}
          <Box sx={{ mb: 1.5 }}>
            <img
              src="/school-logo.jpg"
              alt="Literacy Tree School Logo"
              style={{ 
                height: isMobile ? "45px" : "55px",
                width: "auto",
                objectFit: "contain"
              }}
            />
          </Box>

          <Typography
            component="h1"
            color="darkgreen"
            variant="h6"
            sx={{ 
              mb: 0.5,
              fontWeight: 600,
              textAlign: "center",
              fontSize: { xs: "1.2rem", sm: "1.4rem" }
            }}
          >
            Literacy Tree Admin Portal
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            Staff & Admin Sign In
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                width: "100%", 
                mb: 1.5,
                fontSize: "0.75rem",
                py: 0.5
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            {/* Email Field */}
            <TextField
              margin="dense"
              required
              fullWidth
              id="email"
              label="Email Address"
              placeholder="Enter email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  fontSize: "0.85rem"
                },
                '& .MuiInputLabel-root': {
                  fontSize: "0.85rem"
                }
              }}
              size="small"
            />

            {/* Staff ID Field - ONLY ONE */}
            <TextField
              margin="dense"
              required
              fullWidth
              name="staffId"
              label="Staff ID"
              placeholder="Enter your staff ID"
              id="staffId"
              autoComplete="off"
              value={formData.staffId}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  fontSize: "0.85rem"
                },
                '& .MuiInputLabel-root': {
                  fontSize: "0.85rem"
                }
              }}
              size="small"
            />

            {/* Password Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={formData.showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                      size="small"
                    >
                      {formData.showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  fontSize: "0.85rem"
                },
                '& .MuiInputLabel-root': {
                  fontSize: "0.85rem"
                }
              }}
              size="small"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mb: 1.5,
                py: 0.8,
                borderRadius: 1,
                fontWeight: 600,
                fontSize: "0.85rem",
                textTransform: 'none',
                minHeight: '36px',
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 2,
                },
              }}
            >
              {loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>

            <Grid
              container
              sx={{ mb: 1, justifyContent: "space-between" }}
            >
              <Grid item>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  sx={{ 
                    color: "primary.main",
                    fontSize: "0.75rem",
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    }
                  }}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                  sx={{ 
                    color: "primary.main",
                    fontSize: "0.75rem",
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    }
                  }}
                >
                  Create account
                </Link>
              </Grid>
            </Grid>

            {/* Spacing between form and footer */}
            <Box sx={{ height: 12 }} />

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{ 
                  color: "text.secondary", 
                  display: 'block',
                  mb: 0.25,
                  fontSize: "0.7rem"
                }}
              >
                Literacy Tree School Management System
              </Typography>
              <Typography
                variant="caption"
                sx={{ 
                  color: "text.secondary", 
                  fontSize: "0.7rem"
                }}
              >
                © {new Date().getFullYear()} All rights reserved
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;