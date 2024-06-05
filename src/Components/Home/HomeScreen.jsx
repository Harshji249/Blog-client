import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Card,
  TextField,
  Button,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useSelector, useDispatch } from "react-redux";
import LoadingButton from '@mui/lab/LoadingButton';
import "./Home.css";
import { addItem, fetchAllItem, addComment, followUser } from "./HomeSlice";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blogsState = useSelector((state) => state.blogsState);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showComments, setShowComments] = useState(true);
  const [blogDetails, setBlogDetails] = useState({
    title: "",
    description: "",
  });
  const [comment, setComment] = useState("");
  const handleCommentIconClick = () => {
    setShowComments(showComments);
  };
  const [blogError, setBlogError] = useState({
    title: false,
    description: false,
  }); 

  const handleChange = (e) => {
    setBlogDetails({ ...blogDetails, [e.target.name]: e.target.value });
    setBlogError({ ...blogError, [e.target.name]: false });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if title or description is empty
    if (!blogDetails.title.trim() || !blogDetails.description.trim()) {
      setBlogError({
        title: !blogDetails.title.trim(),
        description: !blogDetails.description.trim(),
      });
      return;
    }
  
    const blog = {
      ...blogDetails,
    };
    setLoading(true)
    dispatch(addItem(blog))
    .then((res) => {
        setLoading(false)
        console.log('adding response',res)
        if(res.payload.status === 200){
          dispatch(fetchAllItem())
          setBlogDetails({
            title: "",
            description: "",
          });
          setBlogError({ title: false, description: false }); 
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  const formatDate = (isoString) => {
    const date = new Date(isoString);
  
    // Use Intl.DateTimeFormat to format the date
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  const handleAddComments = (id) => {
    dispatch(addComment({ postId: id, content: comment })).then((res)=>{
      setComment("")
      dispatch(fetchAllItem())
    })
  };
  const handleUserProfile = (user) => {
    console.log("sending user", user);
    navigate("/profile", { state: { userID: user } });
  };

  useEffect(() => {
    console.log("state", blogsState);
    const user = JSON.parse(localStorage.getItem("user"));
    setUserDetails(user);
    console.log('userDetails image',userDetails)
      dispatch(fetchAllItem())
  }, [dispatch]);

  const filteredBlogs = blogsState?.items?.blogs?.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFollow=(id)=>{
    console.log('user to follow id', id)
    dispatch(followUser(id)).then((res)=>{
      console.log(res)
      dispatch(fetchAllItem())
    })
  }
  return (
    <>
      <Navbar setSearchTerm={setSearchTerm}/>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Card className="add-blog">
          <Box
            sx={{
              width: "90%",
              display: "flex",
              alignItems: "center",
              padding: 2,
              justifyContent: "space-between",
            }}
          >
            <Avatar style={{ height: "60px", width: "60px", marginRight: 10 }} src={userDetails.file}/>

            <Typography>{userDetails.name}</Typography>
            <TextField
              sx={{ width: "65%" }}
              label="Add Title"
              name="title"
              value={blogDetails.title}
              onChange={(e) => handleChange(e)}
              error={blogError.title} // Apply error state
              helperText={blogError.title ? "Title is required" : ""}
            />
          </Box>
          <TextField
            sx={{ width: "90%" }}
            multiline
            rows={3}
            label="Add Content"
            name="description"
            value={blogDetails.description}
            onChange={(e) => handleChange(e)}
            error={blogError.description} // Apply error state
            helperText={blogError.description ? "Description is required" : ""}
          />
          <LoadingButton loading={loading} loadingPosition="center" variant="contained" onClick={handleSubmit}>POST</LoadingButton>
        </Card>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {filteredBlogs?.slice()?.reverse()?.map((item) => {
            return (
              <Card key={item._id}
                className="blog-card"
                sx={{ height: showComments ? "auto" : "35em", mb: 5, mt: 5 }}
              >
                <Box
                  sx={{
                    cursor : "pointer",
                    display: "flex",
                    justifyContent: "space-between", 
                    alignItems: "center",
                    backgroundColor: "#A7E2E6",
                    padding: 2,
                  }}
                >
                  <Box sx={{display:"flex", alignItems:'center'}}>
                  <Avatar
                  onClick={() => handleUserProfile(item)}
                    style={{ height: "60px", width: "60px", marginRight: 10 }} src={item.user.file}
                    />
                  <Typography
                    fontWeight="bold"
                    color="black"
                    onClick={() => handleUserProfile(item)}
                    >
                    {item.user.name}
                  </Typography>
                    </Box>
                  <Button sx={{display: item.user._id === userDetails._id ? "none":"block" }} variant={item.isFollowing ? "outlined":"contained"} onClick={()=>handleFollow(item.user._id)}>{item.isFollowing ? "Following": "Follow"}</Button>
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
                    <Box>
                      <FavoriteBorderIcon sx={{ mr: 2, cursor: "pointer" }} />
                      <ChatBubbleOutlineRoundedIcon
                        sx={{ cursor: "pointer" }}
                        onClick={handleCommentIconClick}
                      />
                    </Box>
                    <Box>{formatDate(item?.date)}</Box>
                  </Box>
                  {showComments && (
                    <Box sx={{ width: "80%", my: 2 }}>
                      <TextField
                        label="Share your thoughts  "
                        sx={{ width: "100%" }}
                        name="comment"
                        onChange={(e) => handleCommentChange(e)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <SendRoundedIcon
                                sx={{ cursor: "pointer" , color:'#0082FC'}}
                                onClick={() => handleAddComments(item._id)}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Box sx={{ mt: 2 ,mb:2}}>
                        {item?.comments?.slice()?.reverse()?.map((comment) => {
                          return (
                            <Box sx={{display:"flex", alignItems:"center"}}>
                              <Avatar src={comment?.userId?.file} sx={{mr:1}} />
                               <Typography variant="body2" sx={{my:2}}>
                              {comment?.userId.name}
                            </Typography> 
                            <Typography variant="body2" sx={{my:2,mx:1}}>
                              : 
                            </Typography>
                            <Typography variant="body2" sx={{my:2, color:'#B1B1B1'}}>
                               {comment.content}
                            </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Card>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

export default HomeScreen;
