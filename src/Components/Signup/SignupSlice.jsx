import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "http://localhost:3000/api/auth";

const initialState = {
  userDetails: [],
  SignupStatus: "",
  SignupError: ""
};

export const signup = createAsyncThunk(
  "auth/registeruser",
  async (formData, { rejectWithValue }) => {
    try {
      console.log('payload',formData)
      const response = await axios.post(baseURL + "/registeruser", formData);
      return response?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);
const SignupSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    pending: (state) => {
      return {
        ...state,
        SignupStatus: "pending",
        SignupError: "",
      };
    },
    fulfilled: (state, action) => {
      return {
        ...state,
        userDetails: [action.payload, ...state.userDetails],
        SignupStatus: "success",
        SignupError: "",
      };
    },
    rejected: (state, action) => {
      return {
        ...state,
        SignupStatus: "rejected",
        SignupError: action.payload,
      };
    },
  },
});

export default SignupSlice.reducer;
