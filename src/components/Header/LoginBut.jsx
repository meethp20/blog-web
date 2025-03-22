/* its a logout button actually my typo error */

import React from 'react'
import { useDispatch } from 'react-redux'
import service, { Service } from '../../appwrite/config'
import { logout } from '../../store/authSlice'

function LoginBut() {
    const dispatch = useDispatch();
    const logoutHandler=()=>{
        try {
            service.logout().then(()=>{
                dispatch(logout())
            })
        } catch (error) {
            
        }
    }
  return (
    <div>
        <button className='text-white bg-sky-600 hover:bg-sky-900 hover:scale-105 rounded-full'>logout</button>
    </div>
  )
}

export default LoginBut