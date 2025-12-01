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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Email as EmailIcon,
  Visibility,
  VisibilityOff,
  Phone as PhoneIcon,
} from "@mui/icons-material";

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
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

    // Validation checks
    if (!formData.firstName.trim()) {
      setError("First name is required");
      setLoading(false);
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required");
      setLoading(false);
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError("Valid email address is required");
      setLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!formData.staffId.trim()) {
      setError("Staff ID is required");
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone ? formData.phone.trim() : '',
        password: formData.password,
        role: 'staff',
        staffId: formData.staffId.trim().toUpperCase()
      };

      console.log("Attempting staff registration with:", registrationData);

      // Use fetch directly for better debugging
      const response = await fetch('https://lts-backend-qg6a.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(registrationData),
        cache: 'no-cache',
        credentials: 'same-origin'
      });

      console.log('Registration response status:', response.status);
      console.log('Registration response headers:', response.headers);

      const responseText = await response.text();
      console.log('Registration raw response:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}`);
      }

      console.log("Registration parsed response:", responseData);

      if (!response.ok) {
        // Handle validation errors from backend
        if (response.status === 400 && responseData.errors) {
          const validationErrors = responseData.errors.map(err =>
            `${err.field || err.param}: ${err.msg}`
          ).join(', ');
          throw new Error(`Validation failed: ${validationErrors}`);
        }

        throw new Error(responseData.message || `Registration failed with status ${response.status}`);
      }

      setSuccess("Staff registration successful! You can now login.");

      // Reset form
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

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error("Registration error:", {
        name: err.name,
        message: err.message,
        stack: err.stack
      });

      // Show user-friendly error messages
      let errorMessage = err.message;

      if (err.message.includes('Network Error') || err.message.includes('Failed to fetch')) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (err.message.includes('JSON')) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.message.includes('already exists')) {
        // Extract which field already exists
        if (err.message.includes('email')) {
          errorMessage = "This email is already registered. Please use a different email or try logging in.";
        } else if (err.message.includes('Staff ID')) {
          errorMessage = "This Staff ID is already in use. Please use a different Staff ID.";
        }
      } else if (err.message.includes('Validation failed')) {
        // Keep the validation error message as is
        errorMessage = err.message;
      }

      setError(errorMessage);

      // If it's a duplicate error, suggest alternatives
      if (err.message.includes('already exists')) {
        setSuccess(`Try using a different email or Staff ID. 
        Suggested Staff ID: ${formData.staffId.trim().toUpperCase()}2
        Or try: STAFF${Math.floor(Math.random() * 9000) + 1000}`);
      }
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
        sm={10}
        md={8}
        lg={6}
        xl={5}
        component={Paper}
        elevation={6}
        sx={{
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          padding: { xs: 1.5, sm: 2.5, md: 3 },
          margin: 1,
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh", // Set maximum height
          overflow: "auto", // Make it scrollable
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            flex: 1,
            minHeight: 0, // Important for flex scrolling
          }}
        >
          {/* School Logo */}
          <Box sx={{ mb: 1.5, flexShrink: 0 }}>
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
              fontSize: { xs: "1.2rem", sm: "1.4rem" },
              flexShrink: 0
            }}
          >
            Staff Registration
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: 1.5,
              color: "text.secondary",
              textAlign: 'center',
              fontSize: "0.85rem",
              lineHeight: 1.4,
              flexShrink: 0
            }}
          >
            Create your staff account for Literacy Tree School.
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                width: "100%",
                mb: 1.5,
                fontSize: "0.75rem",
                py: 0.5,
                flexShrink: 0
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{
                width: "100%",
                mb: 1.5,
                fontSize: "0.75rem",
                py: 0.5,
                flexShrink: 0
              }}
            >
              {success}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0, // Important for flex scrolling
            }}
          >
            {/* Scrollable form content */}
            <Box sx={{
              flex: 1,
              overflow: "auto",
              mb: 2,
              pr: 0.5, // Small padding for scrollbar space
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#c1c1c1',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#a8a8a8',
              }
            }}>
              <Grid container spacing={1}>
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
                          <PersonIcon color="primary" fontSize="small" />
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
                          <PersonIcon color="primary" fontSize="small" />
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
                </Grid>
              </Grid>

              <TextField
                margin="dense"
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

              <TextField
                margin="dense"
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
                      <PhoneIcon color="primary" fontSize="small" />
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

              <TextField
                margin="dense"
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
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: "0.7rem"
                  }
                }}
                helperText="Enter your official staff ID"
                size="small"
              />

              <TextField
                margin="dense"
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
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    fontSize: "0.85rem"
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: "0.85rem"
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: "0.7rem"
                  }
                }}
                helperText="Password must be at least 6 characters long"
                size="small"
              />

              <TextField
                margin="dense"
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
                      <LockIcon color="primary" fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                        size="small"
                      >
                        {formData.showConfirmPassword ? (
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
            </Box>

            {/* Fixed bottom section */}
            <Box sx={{ flexShrink: 0 }}>
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
                  "Create Staff Account"
                )}
              </Button>

              <Grid container justifyContent="center" sx={{ mb: 1 }}>
                <Grid item>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    Already have a staff account?{" "}
                    <Link
                      component={RouterLink}
                      to="/login"
                      sx={{
                        color: "primary.main",
                        fontSize: "0.8rem",
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        }
                      }}
                    >
                      Sign in here
                    </Link>
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{
                textAlign: "center",
                pt: 1,
                pb: 1
              }}>
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
        </Box>
      </Grid>
    </Grid>
  );
};

export default Register;