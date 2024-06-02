import React, { useEffect, useRef, useState } from "react";
import Home from "../../../public/home.png";
import {
  Avatar,
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Modal,
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { useLocation } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import Navbar from "../Navbar/Navbar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import profileImage from "../../../public/profile.png";
import { useSelector, useDispatch } from "react-redux";
import "./Profile.css";
import {
  deleteItem,
  fetchAllItem,
  fetchUserItem,
  updatePost,
} from "./ProfileSlice";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
const ProfileScreen = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    height: "40%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  };
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const inputRef = useRef(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const handleClose = () => setOpen(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const handleProfileClose = () => setOpenProfile(false);
  const handleDelete = () => setOpenDelete(false);
  const location = useLocation();
  const { userID } = location.state || {};
  const dispatch = useDispatch();
  const profileState = useSelector((state) => state.profileState);
  const [userDetails, setUserDeatils] = useState({});
  const [showComments, setShowComments] = useState(true);
  const [blogDetails, setBlogDetails] = useState({
    title: "",
    description: "",
  });
  const [comment, setComment] = useState("");
  const handleCommentIconClick = () => {
    setShowComments(showComments);
  };
  const handleImageClick =()=>{
    inputRef.current.click();
  }
  const handleSubmit = (e) => {
    e.preventDefault();

    const blog = {
      ...blogDetails,
    };
    dispatch(addItem(blog))
      .then((res) => {
        setBlogDetails({
          title: "",
          description: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  //   const handleAddComments = (id) => {
  //     dispatch(addComment({ postId: id, content: comment }));
  //   };
  useEffect(() => {
    const user = localStorage.getItem("user");
    setUserDeatils(JSON.parse(user));
    if (userID) {
      dispatch(fetchUserItem({ userId: userID?.user?._id }));
    } else {
        setProfileData({
            name: userDetails.name,
            email: userDetails.email,
          });
          setImage(userDetails.file)
      dispatch(fetchAllItem())
        .then((res) => {
          console.log("responseFromPi", res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
  });

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const updateBlog = (post) => {
    setOpen(true);
    setFormData({
      id: post._id,
      title: post.title,
      description: post.description,
    });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    dispatch(updatePost({ postId: formData.id, payload: formData })).then(
      (res) => {
        dispatch(fetchAllItem());
        setLoading(false);
        handleClose();
      }
    );
  };

  const handleDeleteItem = (id) => {
    setOpenDelete(true);
    console.log("id to set", id);
    setDeleteId(id);
  };
  const handleConfirmClick = () => {
    dispatch(deleteItem({ postId: deleteId })).then((res) => {
      handleDelete();
      dispatch(fetchAllItem());
    });
  };
  const handleProfileUpdate = () => {};

  const handleProfileOpen = () => {
    setOpenProfile(true);
  };

  const [image, setImage] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
  };

  const filteredBlogs = profileState?.items?.blogs?.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <Navbar setSearchTerm={setSearchTerm} />
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Card className="my-profile">
          <Avatar
            style={{ height: "100px", width: "100px", marginRight: 10 }}
            src={userID ? userID?.user?.file : userDetails.file}
          />
          <Typography variant="h5">
            {userID ? userID.user.name : userDetails.name}
          </Typography>
          <Typography>
            {userID ? userID.user.email : userDetails.email}
          </Typography>
          <Typography
            sx={{
              cursor: "pointer",
              color: "#0047C0",
              display: userID ? "none" : "",
            }}
            onClick={() => handleProfileOpen()}
          >
            Edit Profile
          </Typography>
        </Card>
        <Typography variant="h3" sx={{ my: 2  , borderBottom: "4px solid black" }}>
          {userID ? `${userID.user.name}'s Blogs` : "My Blogs"}
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {filteredBlogs?.map((item) => {
            return (
              <Card
                key={item._id}
                className="blog-card"
                sx={{ height: showComments ? "auto" : "35em", mb: 5, mt: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#A7E2E6",
                    padding: 2,
                  }}
                >
                  <Avatar
                    style={{ height: "60px", width: "60px", marginRight: 10 }}
                    src={userID ? userID?.user?.file : userDetails?.file}
                  />
                  <Typography fontWeight="bold" color="black">
                    {userID ? userID?.user?.name : userDetails.name}
                  </Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <EditIcon
                      sx={{
                        color: "#0047C0",
                        display: userID ? "none" : "",
                        marginRight: 5,
                        cursor: "pointer",
                      }}
                      onClick={() => updateBlog(item)}
                    />
                    <DeleteIcon
                      sx={{
                        color: "#FC4035",
                        display: userID ? "none" : "",
                        marginLeft: "auto",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDeleteItem(item._id)}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ width: "80%", my: 3 }}>
                    <Typography
                      className="title"
                      fontWeight="bold"
                      variant="h3"
                    >
                      {item.title}
                    </Typography>
                  </Box>
                  <Box sx={{ width: "80%" }}>
                    <Typography className="desc" variant="h6">
                      {item.description}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "80%",
                      my: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ChatBubbleOutlineRoundedIcon
                        sx={{ cursor: "pointer", mr: 2 }}
                        onClick={handleCommentIconClick}
                      />
                      <Typography>Comments</Typography>
                    </Box>
                    <Box>20 May 2024</Box>
                  </Box>

                  <Box sx={{ width: "80%", mb: 1 }}>
                    <Box sx={{ mt: 2 }}>
                      {item?.comments?.map((comment) => {
                        return (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              src={comment?.userId?.file}
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="body2" sx={{ my: 2 }}>
                              {comment?.userId.name}
                            </Typography>
                            <Typography variant="body2" sx={{ my: 2, mx: 1 }}>
                              :
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ my: 2, color: "#B1B1B1" }}
                            >
                              {comment.content}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="edit-blog">
            <form
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
              onSubmit={handleUpdateSubmit}
            >
              <Box sx={{ my: 2, width: "95%" }}>
                <TextField
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  label="Title"
                  variant="outlined"
                  name="title"
                  value={formData.title}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </Box>
              <Box sx={{ my: 2, width: "95%" }}>
                <TextField
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  label="Description"
                  variant="outlined"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </Box>
              {/* <Button
                type="submit"
                variant="contained"
                sx={{
                  margin: "0 auto",
                  width: "10rem",
                  height: "2rem",
                }}
              >
                Confirm
              </Button> */}

              <LoadingButton
                 loading={loading}
                sx={{
                    margin: "0 auto",
                    width: "10rem",
                    height: "2rem",
                  }}
                loadingPosition="start"
                
                variant="contained"
                type="submit"
              >
                Confirm
              </LoadingButton>
            </form>
          </Box>
        </Modal>

        <Modal
          open={openProfile}
          onClose={handleProfileClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="edit-blog">
            <form
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
              onSubmit={handleProfileUpdate}
            >
            <Box sx={{ my: 2}} onClick={handleImageClick}>
                <input type="file" ref={inputRef} onChange={handleImageChange} style={{display:"none"}} />
            <Avatar src={image} sx={{height:100,width:100}}/>
            </Box>
              <Box sx={{ my: 2, width: "95%" }}>
                <TextField
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={profileData.name}
                  onChange={(e) => handleProfileChange(e)}
                  required
                />
              </Box>
              <Box sx={{ my: 2, width: "95%" }}>
                <TextField
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  label="email"
                  variant="outlined"
                  name="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange(e)}
                  required
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  fontFamily: "Jost",
                  width: "10rem",
                  height: "2rem",
                }}
              >
                EDIT PROFILE
              </Button>
            </form>
          </Box>
        </Modal>

        <Modal
          open={openDelete}
          onClose={handleDelete}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="delete-blog">
            <Typography>Confirm Delete </Typography>
            <Box
              sx={{
                width: "70%",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Button variant="outlinede" onClick={handleConfirmClick}>
                Yes
              </Button>
              <Button variant="outlined" color="error" onClick={handleDelete}>
                No
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default ProfileScreen;
