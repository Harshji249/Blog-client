import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Button, TextField, Snackbar,Alert } from "@mui/material";
import { login } from './LoginSlice'
import LoadingButton from '@mui/lab/LoadingButton';
import "./Login.css"
import loginImage from '../../../public/login.png'
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const vertical = "top"
  const horizontal = "right"
  const [userDetails, setUserDetails] = useState({
    email:'',
    password:''
  });
  const [error, setError] = useState({
    email: false,
    password: false
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: false });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const submitData = async (e) => {
    e.preventDefault();

    const { email, password } = userDetails;

    if (!email.trim()) {
      setError((prev) => ({ ...prev, email: true }));
      return;
    }

    if (!password.trim()) {
      setError((prev) => ({ ...prev, password: true }));
      return;
    }

    const user = { ...userDetails };
setLoading(true)
dispatch(login(user)).then((res) => {
      setLoading(false)
      console.log('Server response:', res);
      if (res.payload.status === 200) {
        localStorage.setItem('user', JSON.stringify(res.payload.user));
        localStorage.setItem('auth-token', res.payload.authToken);
        navigate('/home');
        setUserDetails({
          email: "",
          password: "",
        });
      }
      else{
        console.log(res.payload.error);
        setErrorMessage(res?.payload?.error || 'An error occurred');
        setOpenSnackbar(true);
      }
    })
    

  };

  return (
    <>
      <Box sx={{ height: "100vh", width: "100vw", display: "flex" }}>
        <Box className="left-section">
          <img src={loginImage} alt="" style={{ height: "80%", width: '80%' }} />
        </Box>
        <Box className="right-section">
          <Box sx={{
            height: '80%', display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly"
          }}>
            <h1>Account Login</h1>
            <span>
              If you are already a member you can login with your email and
              password.
            </span>
            <Box>
              <TextField
                id="outlined-basic"
                label="Your Email"
                variant="outlined"
                name="email"
                value={userDetails.email}
                onChange={(e) => handleChange(e)}
                error={error.email} // Apply error state
                helperText={error.email ? "Email is required" : ""} // Display helper text if error
                sx={{ width: "20em" }}
              />
            </Box>
            <Box>
              <TextField
                id="outlined-basic"
                label="Your Password"
                variant="outlined"
                name="password"
                value={userDetails.password}
                onChange={(e) => handleChange(e)}
                error={error.password} // Apply error state
                helperText={error.password ? "Password is required" : ""} // Display helper text if error
                sx={{ width: "20em" }}
              />
            </Box>

            <LoadingButton
                 loading={loading} sx={{ width: "23em" }} loadingPosition="center" variant="contained" onClick={submitData}>
              Login
            </LoadingButton>
            <p>
              Don't have an account ?{" "}
              <span style={{ color: "#2C73EB", cursor: "pointer" }} onClick={() => navigate('/signup')}>
                Signup here
              </span>
            </p>
          </Box>
        </Box>
      </Box>
      <Snackbar
  anchorOrigin={{ vertical, horizontal }}
  open={openSnackbar}
  onClose={handleCloseSnackbar}
  autoHideDuration={4000} // Set auto-hide duration here
>
  <Alert onClose={handleCloseSnackbar} severity="error" sx={{ fontFamily: "Jost", width: '100%' }}>
    {errorMessage}
  </Alert>
</Snackbar>

    </>
  );
};

export default LoginScreen;
