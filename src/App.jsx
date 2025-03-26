import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthService from './appwrite/auth'
import { login, logout } from './store/authSlice'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import HomePage from './components/HomePage/HomePage'
import Login from './components/Login'
import Signup from './components/Signup'
import Postform from './components/Postform'
import AllPosts from './components/AllPosts'
import SinglePost from './components/SinglePost'
import EditPost from './components/EditPost'
import Profile from './components/Profile/Profile'
import AuthLayout from './components/AuthLayout'
import CategoryPosts from './components/CategoryPosts'
import Categories from './components/Categories'

function App() {
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        AuthService.getCurrentUser()
            .then((userData) => {
                if (userData) {
                    dispatch(login({ userData }))
                } else {
                    dispatch(logout())
                }
            })
            .finally(() => setLoading(false))
    }, [dispatch])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <ErrorBoundary>
            <Router>
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            
                            {/* Protected Routes */}
                            <Route path="/add-post" element={
                                <AuthLayout>
                                    <Postform />
                                </AuthLayout>
                            } />
                            <Route path="/edit-post/:slug" element={
                                <AuthLayout>
                                    <EditPost />
                                </AuthLayout>
                            } />
                            <Route path="/profile" element={
                                <AuthLayout>
                                    <Profile />
                                </AuthLayout>
                            } />
                            <Route path="/categories" element={
                                <AuthLayout>
                                    <Categories />
                                </AuthLayout>
                            } />
                            
                            {/* Public Routes */}
                            <Route path="/all-posts" element={<AllPosts />} />
                            <Route path="/post/:slug" element={<SinglePost />} />
                            <Route path="/category/:slug" element={<CategoryPosts />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </ErrorBoundary>
    )
}

export default App
