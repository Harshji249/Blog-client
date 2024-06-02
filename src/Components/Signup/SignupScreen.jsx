import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";
import { signup } from "./SignupSlice";
import signupImage from "../../../public/signup.png";
import LoadingButton from '@mui/lab/LoadingButton';
import "./Signup.css";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Upload from '../../../public/upload2.png'

const SignupScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState("");
  const vertical = "top";
  const horizontal = "right";
  const [error, setError] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: false });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const submitData = async (e) => {
    e.preventDefault();

    const { name, email, password } = userDetails;

    if (!name.trim()) {
      setError((prev) => ({ ...prev, name: true }));
      return;
    }

    if (!email.trim()) {
      setError((prev) => ({ ...prev, email: true }));
      return;
    }

    if (!password.trim()) {
      setError((prev) => ({ ...prev, password: true }));
      return;
    }
    const formData1 = new FormData()
    formData1.append('file', image)
    formData1.append('name',name)
    formData1.append('email', email)
    formData1.append('password', password)
    const user = { image:image , ...userDetails };
    setLoading(true)
    dispatch(signup(formData1)).then((res) => {
      setLoading(false)
      console.log('Server response:', res);
      if (res.payload.status === 200) {
      localStorage.setItem('user', JSON.stringify(res.payload.user));
      localStorage.setItem('auth-token', res.payload.authToken);
      navigate('/home');
      setUserDetails({
        name:'',
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

    // setUserDetails({
    //   name: "",
    //   email: "",
    //   password: "",
    // });
  };
  const handleImageClick =()=>{
    inputRef.current.click();
  }
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  return (
    <>
      <Box sx={{ height: "100vh", width: "100vw", display: "flex" }}>
        <Box className="left-section">
          <img
            src={signupImage}
            alt=""
            style={{ height: "60%", width: "90%" }}
          />
        </Box>
        <Box className="right-section">
        <form style={{height:"100%"}} onSubmit={submitData} >
          <Box
            sx={{
              height: "90%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <h1>Account Signup</h1>
            <span>Become a member.</span>
            <Box onClick={handleImageClick} style={{ cursor:"pointer",display:"flex",justifyContent:"center", alignItems:"center",height: "150px", width: "150px" }}>
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt=""
                  style={{ height: "100%", width: "100%", borderRadius: 100  }}
                />
              ) : (
                <img
                src={Upload}
                alt=""
                style={{ height: "40%", width: "40%", borderRadius: 100  }}
              />
              )}
            </Box>
            <input type="file" ref={inputRef} onChange={handleImageChange} style={{display:"none"}} />
            <Box>
              <TextField
                id="outlined-basic"
                label="Your Name"
                variant="outlined"
                name="name"
                value={userDetails.name}
                onChange={(e) => handleChange(e)}
                error={error.name}
                helperText={error.name ? "Name is required" : ""}
                sx={{ width: "20em" }}
              />
            </Box>
            <Box>
              <TextField
                id="outlined-basic"
                label="Your Email"
                variant="outlined"
                name="email"
                value={userDetails.email}
                onChange={(e) => handleChange(e)}
                error={error.email}
                helperText={error.email ? "Email is required" : ""}
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
                error={error.password}
                helperText={error.password ? "Password is required" : ""}
                sx={{ width: "20em" }}
              />
            </Box>
            <LoadingButton
                 loading={loading}
                sx={{
                    width: "23em",
                  }}
                loadingPosition="center"
                
                variant="contained"
                type="submit"
              >
                Confirm
              </LoadingButton>
            <p>
              Already have an account ?{" "}
              <span
                style={{ color: "#2C73EB", cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                Login here
              </span>
            </p>
          </Box>
          </form>
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        autoHideDuration={4000} // Set auto-hide duration here
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ fontFamily: "Jost", width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SignupScreen;
