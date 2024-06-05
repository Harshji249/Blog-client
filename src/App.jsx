import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import LoginScreen from './Components/Login/LoginScreen';
import SignupScreen from './Components/Signup/SignupScreen';
import Protected from './ProtectedRoutes';
import HomeScreen from './Components/Home/HomeScreen';
import ProfileScreen from './Components/Profile/ProfileScreen';
import FollowersScreen from './Components/Followers/FollowersScreen';

function App() {

  return (
    <>
      <Router>
        <Routes>
        <Route path='/' element={<Protected Components={<LoginScreen />} />} />
        <Route path='/signup' element={<Protected Components={<SignupScreen />} />}  />
        <Route path='/home' element={<Protected Components={<HomeScreen />} />}  />
        <Route path='/profile' element={<Protected Components={<ProfileScreen />} />}  />
        <Route path='/follow' element={<Protected Components={<FollowersScreen />} />}  />
         </Routes>
      </Router> 
    </>
  )
}

export default App
