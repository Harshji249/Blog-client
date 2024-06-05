import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import Navbar from '../Navbar/Navbar';
import { Card, Box, Avatar, Typography, Button, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { fetchAllItem,followUser } from './FollowersSlice';

const FollowersScreen = () => {
  const location = useLocation();
  const dispatch =useDispatch();
  const followState = useSelector((state) => state.followState);
  const { list } = location.state || {};
  const [selectedTab, setSelectedTab] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowings] = useState([]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleFollow=(id)=>{
    dispatch(followUser(id)).then((res)=>{
        console.log(res)
        dispatch(fetchAllItem())
      })
  } 

  useEffect(()=>{
    dispatch(fetchAllItem()).then((res)=>{
        setFollowers(res.payload.followers)
        setFollowings(res.payload.following)
    })
  },[dispatch])

  return (
    <>
      <Navbar />
      <Card sx={{ width: "80%", margin: "auto", mt: 4, p: 2 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="Followers" />
          <Tab label="Following" />
        </Tabs>

        {selectedTab === 0 && (
          <Box>
            {followState?.items?.followers?.map((item, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center", my: 2 }}>
                <Avatar src={item.file} sx={{ width: 56, height: 56, mr: 2 }} />
                <Typography sx={{ flex: 1 }}>{item.name}</Typography>
                <Button variant="outlined" color="error">Remove</Button>
              </Box>
            ))}
          </Box>
        )}

        {selectedTab === 1 && (
          <Box>
            {/* Render following list similar to followers list */}
            {followState?.items?.following?.map((item, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center", my: 2 }}>
                <Avatar src={item.file} sx={{ width: 56, height: 56, mr: 2 }} />
                <Typography sx={{ flex: 1 }}>{item.name}</Typography>
                <Button variant="outlined" color="error" onClick={()=>handleFollow(item._id)}>UNFOLLOW</Button>
              </Box>
            ))}
          </Box>
        )}
      </Card>
    </>
  );
};

export default FollowersScreen;
