import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container } from '../index'
import PostCard from './PostCard'
import service from '../appwrite/config'
import LoadingSkeleton from './LoadingSkeleton'

function CategoryPosts() {
    const { slug } = useParams()
    const [posts, setPosts] = useState([])
    const [category, setCategory] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (slug) {
            fetchCategoryAndPosts()
        }
    }, [slug])

    const fetchCategoryAndPosts = async () => {
        try {
            setLoading(true)
            // First get the category by slug
            const categoryData = await service.getCategoryBySlug(slug)
            
            if (categoryData?.documents && categoryData.documents.length > 0) {
                const categoryObj = categoryData.documents[0]
                setCategory(categoryObj)
                
                // Then get posts for this category
                const postsData = await service.getPostsByCategory(categoryObj.$id)
                if (postsData?.documents) {
                    setPosts(postsData.documents)
                } else {
                    setPosts([])
                }
            } else {
                setError("Category not found")
            }
        } catch (error) {
            console.error("Error fetching category posts:", error)
            setError("Failed to load posts for this category")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <Container>
                    <div className="max-w-6xl mx-auto">
                        <div className="animate-pulse mb-8">
                            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <LoadingSkeleton key={n} />
                            ))}
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
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="bg-red-50 p-6 rounded-lg">
                            <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                            <p className="text-red-500 mb-4">{error}</p>
                            <Link to="/" className="text-blue-600 hover:text-blue-800">
                                Return to Home
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Container>
                <div className="max-w-6xl mx-auto">
                    {category && (
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-2 text-gray-800">
                                {category.name}
                            </h1>
                            {category.description && (
                                <p className="text-gray-600">{category.description}</p>
                            )}
                        </div>
                    )}
                    
                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <div key={post.$id} className="transform transition-transform hover:-translate-y-1">
                                    <PostCard post={post} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts in this category</h3>
                            <p className="text-gray-500 mb-4">Be the first to create a post in this category!</p>
                            <Link 
                                to="/add-post"
                                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-colors"
                            >
                                Create Post
                            </Link>
                        </div>
                    )}
                    
                    <div className="mt-8 text-center">
                        <Link 
                            to="/"
                            className="inline-block px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default CategoryPosts
