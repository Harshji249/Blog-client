import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "http://localhost:3000/api/blog";

const initialState = {
  items: [],
  addItemStatus: "",
  addItemError: "",
  fetchAllItemStatus: "",
  fetchAllItemError: "",
  addCommentStatus: "",
  addCommentError: "",
  followUserStatus: "",
  followUserError: "",
};

export const addItem = createAsyncThunk(
  "blog/addnewpost",
  async (blog, { rejectWithValue }) => {
    try {
      const response = await axios.post(baseURL + "/addnewpost", blog, {
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

export const fetchAllItem = createAsyncThunk(
  "blog/viewallpost",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(baseURL + "/viewallpost",{
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

export const addComment = createAsyncThunk(
  "blog/addcomment",
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseURL + `/addcomment/${postId}`,
        { content },
        {
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
          },
        }
      );
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

const HomeSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addItem.pending, (state) => {
        state.addItemStatus = "pending";
        state.addItemError = "";
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items = action.payload;
        state.addItemStatus = "success";
        state.addItemError = "";
      })
      .addCase(addItem.rejected, (state, action) => {
        state.addItemStatus = "rejected";
        state.addItemError = action.payload;
      })
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
      .addCase(addComment.pending, (state) => {
        state.addCommentStatus = "pending";
        state.addCommentError = "";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        // Handle successful addition of comment if needed
        state.addCommentStatus = "success";
        state.addCommentError = "";
      })
      .addCase(addComment.rejected, (state, action) => {
        // Handle rejected addition of comment if needed
        state.addCommentStatus = "rejected";
        state.addCommentError = action.payload;
      })
      .addCase(followUser.pending, (state) => {
        state.followUserStatus = "pending";
        state.followUserError = "";
      })
      .addCase(followUser.fulfilled, (state, action) => {
        // Handle successful addition of comment if needed
        state.followUserStatus = "success";
        state.followUserError = "";
      })
      .addCase(followUser.rejected, (state, action) => {
        // Handle rejected addition of comment if needed
        state.followUserStatus = "rejected";
        state.followUserError = action.payload;
      });
  },
});

export default HomeSlice.reducer;
