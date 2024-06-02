import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "https://blog-server-g55n.onrender.com/api/auth";

const initialState = {
  userDetails: [],
  loginStatus: "",
  loginError: "",
};

export const login = createAsyncThunk(
  "auth/loginuser",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post(baseURL + "/loginuser", user);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
const LoginSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    pending: (state) => {
      return {
        ...state,
        loginStatus: "pending",
        loginError: "",
      };
    },
    fulfilled: (state, action) => {
      return {
        ...state,
        userDetails: [action.payload, ...state.userDetails],
        loginStatus: "success",
        loginError: "",
      };
    },
    rejected: (state, action) => {
      return {
        ...state,
        loginStatus: "rejected",
        loginError: action.payload,
      };
    },
  },
  // extraReducers: {
  //     [login.pending]: (state, action) => {
  //         return {
  //             ...state,
  //             loginStatus: "pending",
  //             loginError: ""

  //         }
  //     },
  //     [login.fulfilled]: (state, action) => {

  //         return {
  //             ...state,
  //             userDetails: [action.payload, ...state.userDetails],
  //             loginStatus: "success",
  //             loginError: ""

  //         }
  //     },
  //     [login.rejected]: (state, action) => {
  //         return {
  //             ...state,
  //             loginStatus: "rejected",
  //             loginError: action.payload

  //         }
  //     },
  // }
});

export default LoginSlice.reducer;
