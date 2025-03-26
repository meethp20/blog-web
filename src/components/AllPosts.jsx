import React, { useState, useEffect } from 'react'
import { Container } from '../index'
import PostCard from './PostCard'
import service from '../appwrite/config'
import LoadingSkeleton from './LoadingSkeleton'

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const response = await service.getPosts()
            if (response.documents) {
                setPosts(response.documents)
            }
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Container>
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">All Blog Posts</h1>
                    
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <LoadingSkeleton key={n} />
                            ))}
                        </div>
                    ) : (
                        <>
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
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts found</h3>
                                    <p className="text-gray-500">Be the first to create a post!</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts
