import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/authSlice'
import { Container, Button } from '../../index'

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const authStatus = useSelector((state) => state.auth.status)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const navItems = [
        {
            name: 'Home',
            slug: '/',
            active: true
        },
        {
            name: 'Login',
            slug: '/login',
            active: !authStatus
        },
        {
            name: 'Signup',
            slug: '/signup',
            active: !authStatus
        },
        {
            name: 'All Posts',
            slug: '/all-posts',
            active: authStatus
        },
        {
            name: 'Add Post',
            slug: '/add-post',
            active: authStatus
        },
        {
            name: 'Categories',
            slug: '/categories',
            active: authStatus
        }
    ]

    const handleLogout = () => {
        dispatch(logout())
        navigate('/')
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <header className='sticky top-0 z-50 bg-white shadow-md'>
            <Container>
                <nav className='flex items-center justify-between py-4'>
                    <div className='flex items-center'>
                        <Link to='/' className='flex items-center'>
                            <span className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text'>BlogApp</span>
                        </Link>
                    </div>
                    
                    {/* Mobile menu button */}
                    <div className='md:hidden'>
                        <button 
                            onClick={toggleMenu}
                            className='p-2 text-gray-700 rounded-md focus:outline-none'
                        >
                            <svg 
                                className='w-6 h-6' 
                                fill='none' 
                                stroke='currentColor' 
                                viewBox='0 0 24 24'
                            >
                                {isMenuOpen ? (
                                    <path 
                                        strokeLinecap='round' 
                                        strokeLinejoin='round' 
                                        strokeWidth={2} 
                                        d='M6 18L18 6M6 6l12 12' 
                                    />
                                ) : (
                                    <path 
                                        strokeLinecap='round' 
                                        strokeLinejoin='round' 
                                        strokeWidth={2} 
                                        d='M4 6h16M4 12h16M4 18h16' 
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <ul className='hidden md:flex items-center space-x-2'>
                        {navItems.map((item) => 
                            item.active ? (
                                <li key={item.name}>
                                    <button
                                        onClick={() => navigate(item.slug)}
                                        className='px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors'
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ) : null
                        )}
                        {authStatus && (
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className='ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
                                >
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
                
                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className='md:hidden bg-white py-2 px-4 rounded-lg shadow-lg absolute left-0 right-0 mt-2 z-50 slide-up'>
                        <ul className='flex flex-col space-y-2'>
                            {navItems.map((item) => 
                                item.active ? (
                                    <li key={item.name}>
                                        <button
                                            onClick={() => {
                                                navigate(item.slug)
                                                setIsMenuOpen(false)
                                            }}
                                            className='w-full text-left px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors'
                                        >
                                            {item.name}
                                        </button>
                                    </li>
                                ) : null
                            )}
                            {authStatus && (
                                <li>
                                    <button
                                        onClick={() => {
                                            handleLogout()
                                            setIsMenuOpen(false)
                                        }}
                                        className='w-full text-left px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
                                    >
                                        Logout
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </Container>
        </header>
    )
}

export default Header