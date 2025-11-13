import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
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
} from "@mui/material";
import {
  Email as EmailIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      console.log("Attempting login with:", { email: formData.email });

      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
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
        "Login failed. Please try again."
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
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
        xs={10}
        sm={6}
        md={5}
        lg={4}
        component={Paper}
        elevation={6}
        sx={{
          borderRadius: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: { xs: 2, sm: 4 },
          margin: 2,
          maxWidth: "450px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* School Logo */}
          <Box sx={{ mb: 3 }}>
            <img
              src="/school-logo.jpg"
              alt="Literacy Tree School Logo"
              style={{ height: "80px" }}
            />
          </Box>

          <Typography
            component="h2"
            color="darkgreen"
            variant="h4"
            sx={{ mb: 1, fontWeight: 600 }}
          >
            Literacy Tree Admin Portal
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            Sign in to access the administration dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
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
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

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
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {formData.showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: "8px",
                fontWeight: 600,
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.dark",
                  transform: "translateY(-1px)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>

            <Grid
              container
              sx={{ mt: 2, mb: 2, justifyContent: "space-between" }}
            >
              <Grid item xs>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  sx={{ color: "primary.main" }}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                  sx={{ color: "primary.main" }}
                >
                  Create account
                </Link>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontSize: "0.8rem" }}
              >
                Literacy Tree School Management System
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontSize: "0.8rem" }}
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