import React, { useState,useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AuthService from './appwrite/auth';
import { login,logout } from './store/authSlice';
function App() {
  const {loading,setLoading}=useState(true)
  const dispatch= useDispatch();
  useEffect(()=>{
    AuthService.getCurrentUser()
    .then((userData)=>{ 
      if(userData){
        dispatch(login({userData}))
      }else{
        dispatch(logout())
      }
    })
    .finally(()=>setLoading(false))
  })
  return !loading ? (
   <div className='text-6xl text-center'>bhosda </div>
  ): null
}

export default App
