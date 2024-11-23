import React, { useContext, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Chat from './pages/Login/Chat/Chat';
import ProfileUpdate from './pages/Login/ProfileUpdate/ProfileUpdate';
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { AppContext } from './context/AppContext';

const App = () => {
  const nagivate = useNavigate();
  const {loadUserData} = useContext(AppContext)
  useEffect(()=>{
    onAuthStateChanged(auth, async(user)=>{
      if (user) {
        nagivate('/chat')
        await loadUserData(user.uid)
      }
      else{
        nagivate('/')

      }

    })
  },[])
  return (
    <>
    <ToastContainer />
      <Routes>

        <Route path='/' element={<Login/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/profile' element={<ProfileUpdate/>}/>
      </Routes>
    </>
  );
};

export default App;