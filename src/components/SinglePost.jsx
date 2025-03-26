import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import parse from 'html-react-parser'
import { Container } from '../index'
import service from '../appwrite/config'

function SinglePost() {
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()
    
    const userData = useSelector(state => state.auth.userData)
    const isAuthor = post && userData && post.userId === userData.$id

    useEffect(() => {
        if (slug) {
            fetchPost()
        }
    }, [slug])

    const fetchPost = async () => {
        try {
            const response = await service.getPost(slug)
            if (response) {
                setPost(response)
            } else {
                setError("Post not found")
                setTimeout(() => navigate('/'), 3000)
            }
        } catch (error) {
            console.error("Error fetching post:", error)
            setError("Failed to load post")
        } finally {
            setLoading(false)
        }
    }

    const deletePost = async () => {
        if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
            try {
                const status = await service.deletePost(post.$id)
                if (status) {
                    navigate('/')
                }
            } catch (error) {
                console.error("Error deleting post:", error)
            }
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                            <div className="h-96 bg-gray-200 rounded mb-8"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <Container>
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-red-50 p-6 rounded-lg">
                            <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                            <p className="text-red-500 mb-4">{error}</p>
                            <p className="text-gray-600">Redirecting to homepage...</p>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Container>
                {post && (
                    <article className="max-w-4xl mx-auto">
                        {/* Post Header */}
                        <header className="mb-8">
                            <h1 className="text-4xl font-bold mb-4 text-gray-800">{post.title}</h1>
                            <div className="flex items-center text-gray-500 mb-6">
                                <span className="mr-4">
                                    {new Date(post.$createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                                {post.categoryId && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                                        {post.category?.name || 'Uncategorized'}
                                    </span>
                                )}
                            </div>
                            
                            {/* Author Actions */}
                            {isAuthor && (
                                <div className="flex space-x-3 mb-6">
                                    <Link 
                                        to={`/edit-post/${post.$id}`}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Edit Post
                                    </Link>
                                    <button
                                        onClick={deletePost}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Delete Post
                                    </button>
                                </div>
                            )}
                            
                            {/* Featured Image */}
                            {post.featuredImage && (
                                <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                                    <img 
                                        src={service.getFilePreview(post.featuredImage)} 
                                        alt={post.title}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            )}
                        </header>
                        
                        {/* Post Content */}
                        <div className="prose prose-lg max-w-none">
                            {parse(post.content || '')}
                        </div>
                        
                        {/* Post Footer */}
                        <footer className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <Link 
                                    to="/"
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    &larr; Back to Home
                                </Link>
                                <div className="flex space-x-4">
                                    <button className="text-gray-500 hover:text-blue-600 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                        </svg>
                                    </button>
                                    <button className="text-gray-500 hover:text-blue-600 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </article>
                )}
            </Container>
        </div>
    )
}

export default SinglePost
