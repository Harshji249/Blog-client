import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "https://blog-server-g55n.onrender.com/api/blog"; 

const initialState = {
  items: [],
  deleteItemStatus: "",
  deleteItemError: "",
  fetchAllItemStatus: "",
  fetchAllItemError: "",
  fetchUserItemStatus: "",
  fetchUserItemError: "",
  updatePostStatus: "",
  updatePostError: "",
  editUserStatus: "",
  editUserError:"",
};

export const deleteItem = createAsyncThunk(
  "blog/deletepost",
  async (postId, { rejectWithValue }) => {
    try {
        console.log('postId',postId)
      const response = await axios.delete(baseURL + `/deletepost/${postId.postId}`,{
            headers: {
                'auth-token': localStorage.getItem('auth-token')
            }});
      return response?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const fetchAllItem = createAsyncThunk(
  "blog/viewmypost",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(baseURL + `/viewmypost`,{
        headers: {
            'auth-token': localStorage.getItem('auth-token')
          }
      });
      return response?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const fetchUserItem = createAsyncThunk(
    "blog/viewuserpost",
    async ({userId}, { rejectWithValue }) => {
      try {
        const response = await axios.get(baseURL + `/viewuserpost/${userId}`,{
          headers: {
              'auth-token': localStorage.getItem('auth-token')
            }
        });
        return response?.data;
      } catch (error) {
        console.log(error);
        return rejectWithValue(error?.response?.data);
      }
    }
  );

export const updatePost = createAsyncThunk(
  "blog/updatepost",
  async ({ postId, payload }, { rejectWithValue }) => {
    try {
      const response = await axios.put(baseURL + `/updatepost/${postId}`, { payload }, {
        headers: {
          'auth-token': localStorage.getItem('auth-token')
        }
      });
      return response?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const editUser = createAsyncThunk(
    "blog/edituser",
    async ({ userId, payload }, { rejectWithValue }) => {
      try {
        const response = await axios.put(baseURL + `/edituser/${userId}`, { payload }, {
          headers: {
            'auth-token': localStorage.getItem('auth-token')
          }
        });
        return response?.data;
      } catch (error) {
        console.log(error);
        return rejectWithValue(error?.response?.data);
      }
    }
  );

const ProfileSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteItem.pending, (state) => {
        state.deleteItemStatus = "pending";
        state.deleteItemError = "";
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = action.payload;
        state.addItemStatus = "success";
        state.addItemError = "";
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.deleteItemStatus = "rejected";
        state.deleteItemError = action.payload;
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
      .addCase(fetchUserItem.pending, (state) => {
        state.fetchUserItemStatus = "pending";
        state.fetchUserItemError = "";
      })
      .addCase(fetchUserItem.fulfilled, (state, action) => {
        state.items = action.payload;
        state.fetchUserItemStatus = "success";
        state.fetchUserItemError = "";
      })
      .addCase(fetchUserItem.rejected, (state, action) => {
        state.fetchUserItemStatus = "rejected";
        state.fetchUserItemError = action.payload;
      })
      .addCase(updatePost.pending, (state) => {
        state.updatePostStatus = "pending";
        state.updatePostError = "";
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        // Handle successful addition of comment if needed
        state.updatePostStatus = "success";
        state.updatePostError = "";
      })
      .addCase(updatePost.rejected, (state, action) => {
        // Handle rejected addition of comment if needed
        state.updatePostStatus = "rejected";
        state.updatePostError = action.payload;
      })
      .addCase(editUser.pending, (state) => {
        state.editUserStatus = "pending";
        state.editUserError = "";
      })
      .addCase(editUser.fulfilled, (state, action) => {
        // Handle successful addition of comment if needed
        state.editUserStatus = "success";
        state.editUserError = "";
      })
      .addCase(editUser.rejected, (state, action) => {
        // Handle rejected addition of comment if needed
        state.editUserStatus = "rejected";
        state.editUserError = action.payload;
      });
  },
});

export default ProfileSlice.reducer;
