import React from 'react'
import { Link, Links } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {Contaniner , LoginBut} from '../index'
import { useSelector } from 'react-redux'
function Header() {
    const authStatus = useSelector(()=>state.auth.authStatus)
    const navigate=useNavigate()
    const navItems= [
    {
     name :'Home',
     slug:"/",
     active :true
    },
    {
        name:'login',
        slug:"/login",
        active:!authStatus,
    },{
        name :"SignUp",
        slug:"/signup",
        active: !authStatus,
    },{
        name : "All Post",
        slug:"/all-post",
        active:authStatus,
    },{
      name:"add-Post",
      slug:"/all-post",
    }
    
    ]
  return (
    <header className='bg-gray-700 shadow py-3'>
        <Contaniner>
            <nav className='flex'>
            <div>
                <Link to='/'>
                  //logo 
                </Link>
            </div>
            <ul className='flex ml-auto'>
              {navItems.map((items)=>
            items.active ? (
                <li key={item.name}>
                    <button
                    onClick={()=> navigate(item.slug)}
                   className=''
                    >{items.name}</button>
                </li>
            ) : null)}
            {authStatus&&(
                <li>
                    <LoginBut/>
                </li>
            )}
            </ul>
            </nav>
        </Contaniner>
    </header>
  ) 
}

export default Header