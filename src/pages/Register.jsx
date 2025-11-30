import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
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
  Phone as PhoneIcon,
} from "@mui/icons-material";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "staff", // Default role is now staff
    staffId: "",
    showPassword: false,
    showConfirmPassword: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Staff ID is now always required
    if (!formData.staffId.trim()) {
      setError("Staff ID is required");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting staff registration with:", { 
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        staffId: formData.staffId
      });

      const response = await api.post("/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        staffId: formData.staffId, // Always include staff ID
      });

      console.log("Registration response:", response.data);

      setSuccess("Staff registration successful! You can now login.");
      
      // Clear form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "staff",
        staffId: "",
        showPassword: false,
        showConfirmPassword: false,
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error("Registration error details:", {
        message: err.message,
        response: err.response,
        request: err.request
      });

      setError(
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const toggleConfirmPasswordVisibility = () => {
    setFormData((prev) => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }));
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
        sm={8}
        md={6}
        lg={5}
        component={Paper}
        elevation={6}
        sx={{
          borderRadius: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: { xs: 2, sm: 4 },
          margin: 2,
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto",
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
            Staff Registration
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary", textAlign: 'center' }}>
            Create your staff account for Literacy Tree School. Fill in your details to get started.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Staff ID field - always visible now */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="staffId"
              label="Staff ID"
              name="staffId"
              autoComplete="off"
              value={formData.staffId}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
              helperText="Enter your official staff ID"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={formData.showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
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
              helperText="Password must be at least 6 characters long"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={formData.showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={formData.confirmPassword}
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
                      aria-label="toggle confirm password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {formData.showConfirmPassword ? (
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
                "Create Staff Account"
              )}
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body2">
                  Already have a staff account?{" "}
                  <Link component={RouterLink} to="/login" sx={{ color: "primary.main" }}>
                    Sign in here
                  </Link>
                </Typography>
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

export default Register;