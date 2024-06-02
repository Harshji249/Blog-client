import { useSelector, useDispatch } from "react-redux";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from '@mui/icons-material/Menu';
import "./Nav.css";
import {
  Container,
  Typography,
  Box,
  TextField,
  Card,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";

function Navbar({ setSearchTerm }) {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedTab, setSelectedTab] = useState(localStorage.getItem("selectedTab") || "home");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const handleProfileClick = () => {
    const userId = localStorage.getItem("user");
    navigate("/profile", { state: { userId: userId } });
    handleTabSelection("profile");
  };

  const handleTabSelection = (tab) => {
    setSelectedTab(tab);
    localStorage.setItem("selectedTab", tab);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Box className={showMenu ? 'menu-open' : 'navbar-main'}>
        <Typography
          component={RouterLink}
          to={"/home"}
          sx={{
            fontFamily: "Jost",
            textDecoration: "none",
            color: "#3A3674",
            fontWeight: "bold",
            fontSize: "32px",
            cursor: "pointer",
          }}
          onClick={() => handleTabSelection("home")}
        >
          Blog Up
        </Typography>
        <Box
          sx={{
            width: "50%",
            height: showMenu ? '100vh' : '',
            display: "flex",
            alignItems: "center",
            flexDirection: showMenu ? 'column' : 'row',
            justifyContent: "space-evenly",
          }}
        >
          <Typography
            component={RouterLink}
            to={"/home"}
            sx={{
              textDecoration: "none",
              color: "black",
              borderBottom: selectedTab === "home" ? "2px solid black" : "none"
            }}
            onClick={() => handleTabSelection("home")}
          >
            HOME
          </Typography>
          <Typography
            onClick={handleProfileClick}
            sx={{
              textDecoration: "none",
              color: "black",
              cursor: "pointer",
              borderBottom: selectedTab === "profile" ? "2px solid black" : "none"
            }}
          >
            MY PROFILE
          </Typography>
          <Typography
            sx={{
              textDecoration: "none",
              color: "black",
            }}
            onClick={() => {
              handleLogout();
            }}
          >
            LOGOUT
          </Typography>
        </Box>
        <TextField
          onChange={handleSearchChange}
          label="Search"
          variant="outlined"
          sx={{
            fontFamily: "Jost",
            bgcolor: "#FF553C",
            width: "20em",
            borderRadius: 10,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
              "& input": {
                color: "white",
              },
            },
            "& .MuiInputLabel-root": {
              color: "white",
            },
            "& .MuiSvgIcon-root": {
              color: "white",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ cursor: "pointer" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box className='navbar-secondary'>
        <Typography
          component={RouterLink}
          to={"/home"}
          sx={{
            fontFamily: "Jost",
            textDecoration: "none",
            color: "#3A3674",
            fontWeight: "bold",
            fontSize: "32px",
            cursor: "pointer",
          }}
          onClick={() => handleTabSelection("home")}
        >
          Blog Up
        </Typography>
        <MenuIcon 
          sx={{ marginLeft: 6, cursor: 'pointer' }} 
          onClick={() => setShowMenu(!showMenu)}
        />
      </Box>
    </>
  );
}

export default Navbar;
