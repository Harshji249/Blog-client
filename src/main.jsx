import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import LoginReducer from './Components/Login/LoginSlice.jsx'
import SignupReducer from './Components/Signup/SignupSlice.jsx'
import HomeReducer from './Components/Home/HomeSlice.jsx'
import ProfileReducer from './Components/Profile/ProfileSlice.jsx'

const store = configureStore({
  reducer: {
    loginUserState: LoginReducer,
    signupUserState: SignupReducer,
    blogsState: HomeReducer,
    profileState: ProfileReducer,
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <App />
</Provider> 
)
