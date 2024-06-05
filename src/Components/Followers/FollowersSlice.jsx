import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "http://localhost:3000/api/blog";

const initialState = {
  items: [],
  fetchAllItemStatus: "",
  fetchAllItemError: "",
  followUserStatus: "",
  followUserError: "",
};



export const fetchAllItem = createAsyncThunk(
  "blog/followdetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(baseURL + "/followdetails",{
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
        },
      });
      return response?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);


export const followUser = createAsyncThunk(
  "blog/follow",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(baseURL + `/follow/${id}`, {},{
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
        },
      });
      return response?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

const FollowersSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllItem.pending, (state) => {
        state.fetchAllItemStatus = "pending";
        state.fetchAllItemError = "";
      })
      .addCase(fetchAllItem.fulfilled, (state, action) => {
        state.items = action.payload;
        state.fetchAllItemStatus = "success";
        state.fetchAllItemError = "";
      })
      .addCase(fetchAllItem.rejected, (state, action) => {
        state.fetchAllItemStatus = "rejected";
        state.fetchAllItemError = action.payload;
      })
      .addCase(followUser.pending, (state) => {
        state.followUserStatus = "pending";
        state.followUserError = "";
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.followUserStatus = "success";
        state.followUserError = "";
      })
      .addCase(followUser.rejected, (state, action) => {
        state.followUserStatus = "rejected";
        state.followUserError = action.payload;
      });
  },
});

export default FollowersSlice.reducer;
