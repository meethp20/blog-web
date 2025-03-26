import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PostCard from '../PostCard'
import service from '../../appwrite/config'
import LoadingSkeleton from '../LoadingSkeleton'
import { useSelector } from 'react-redux'

function HomePage() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState([])
    const [featuredPost, setFeaturedPost] = useState(null)
    const [popularPosts, setPopularPosts] = useState([])
    const [email, setEmail] = useState('')
    const [subscribeStatus, setSubscribeStatus] = useState({ loading: false, success: false, error: null })
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(() => {
        fetchPosts()
        fetchCategories()
    }, [])

    const fetchPosts = async () => {
        try {
            const response = await service.getPosts()
            if (response.documents && response.documents.length > 0) {
                // Set the first post as featured if it has an image
                const postsWithImages = response.documents.filter(post => post.featuredImage)
                if (postsWithImages.length > 0) {
                    setFeaturedPost(postsWithImages[0])
                    
                    // Get remaining posts
                    const remainingPosts = response.documents.filter(post => post.$id !== postsWithImages[0].$id)
                    setPosts(remainingPosts)
                    
                    // Set some posts as popular (for demo purposes)
                    if (remainingPosts.length > 3) {
                        setPopularPosts(remainingPosts.slice(0, 3))
                    } else {
                        setPopularPosts(remainingPosts)
                    }
                } else {
                    setPosts(response.documents)
                    if (response.documents.length > 3) {
                        setPopularPosts(response.documents.slice(0, 3))
                    } else {
                        setPopularPosts(response.documents)
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await service.getCategories()
            if (response.documents) {
                setCategories(response.documents)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const handleSubscribe = (e) => {
        e.preventDefault()
        if (!email || !email.includes('@')) {
            setSubscribeStatus({ loading: false, success: false, error: 'Please enter a valid email address' })
            return
        }
        
        setSubscribeStatus({ loading: true, success: false, error: null })
        
        // Simulate API call
        setTimeout(() => {
            setSubscribeStatus({ loading: false, success: true, error: null })
            setEmail('')
            
            // Reset success message after 3 seconds
            setTimeout(() => {
                setSubscribeStatus({ loading: false, success: false, error: null })
            }, 3000)
        }, 1000)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="w-full h-64 bg-gray-200 shimmer rounded-xl mb-8 mt-8 mx-auto max-w-6xl"></div>
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <LoadingSkeleton key={n} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <section className="mb-12 fade-in">
                    {featuredPost ? (
                        <div className="relative rounded-xl overflow-hidden shadow-lg hover-lift">
                            <div className="relative h-[400px] md:h-[500px]">
                                <img 
                                    src={service.getFilePreview(featuredPost.featuredImage)} 
                                    alt={featuredPost.title} 
                                    className="w-full h-full object-cover hover-scale"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                                    <div className="mb-2 flex gap-2">
                                        <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full bounce">Featured</span>
                                        {featuredPost.categoryId && categories.find(cat => cat.$id === featuredPost.categoryId) && (
                                            <Link 
                                                to={`/category/${categories.find(cat => cat.$id === featuredPost.categoryId).slug}`}
                                                className={`category-tag ${categories.find(cat => cat.$id === featuredPost.categoryId).name.toLowerCase()}`}
                                            >
                                                {categories.find(cat => cat.$id === featuredPost.categoryId).name}
                                            </Link>
                                        )}
                                    </div>
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 slide-in-left">{featuredPost.title}</h1>
                                    <p className="text-gray-200 mb-4 max-w-2xl line-clamp-2 slide-in-left" style={{ animationDelay: '0.1s' }}>
                                        {featuredPost.content && featuredPost.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                    </p>
                                    <Link 
                                        to={`/post/${featuredPost.slug}`}
                                        className="btn-gradient inline-block px-6 py-3 rounded-lg font-medium slide-in-left"
                                        style={{ animationDelay: '0.2s' }}
                                    >
                                        Read Article
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover-lift">
                            <h1 className="text-4xl font-bold mb-4 gradient-text zoom-in">Welcome to Our Blog</h1>
                            <p className="text-gray-600 max-w-2xl mx-auto mb-6 slide-up" style={{ animationDelay: '0.1s' }}>Discover amazing stories and insights from our community.</p>
                            {authStatus ? (
                                <Link 
                                    to="/add-post"
                                    className="btn-gradient inline-block px-6 py-3 rounded-lg font-medium slide-up"
                                    style={{ animationDelay: '0.2s' }}
                                >
                                    Create Your First Post
                                </Link>
                            ) : (
                                <Link 
                                    to="/login"
                                    className="btn-gradient inline-block px-6 py-3 rounded-lg font-medium slide-up"
                                    style={{ animationDelay: '0.2s' }}
                                >
                                    Join Our Community
                                </Link>
                            )}
                        </div>
                    )}
                </section>

                {/* Categories */}
                <section className="mb-12 slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold gradient-text">Categories</h2>
                        <Link to="/categories" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover-scale">
                            View All
                        </Link>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {categories.length > 0 ? (
                            categories.map((category, index) => (
                                <Link
                                    key={category.$id}
                                    to={`/category/${category.slug}`}
                                    className={`category-tag ${category.name.toLowerCase()}`}
                                    style={{ animationDelay: `${0.05 * index}s` }}
                                >
                                    {category.name}
                                </Link>
                            ))
                        ) : (
                            <div className="text-gray-500 italic">No categories found</div>
                        )}
                    </div>
                </section>

                {/* Popular Posts */}
                {popularPosts.length > 0 && (
                    <section className="mb-12 slide-up" style={{ animationDelay: '0.15s' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold gradient-text">Popular Posts</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {popularPosts.map((post, index) => (
                                <Link key={post.$id} to={`/post/${post.slug}`} className="block group zoom-in" style={{ animationDelay: `${0.1 + (0.05 * index)}s` }}>
                                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover-lift">
                                        <div className="relative h-40">
                                            {post.featuredImage ? (
                                                <img 
                                                    src={service.getFilePreview(post.featuredImage)} 
                                                    alt={post.title} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                                                    <span className="text-gray-400">No image</span>
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2">
                                                <div className="bg-white/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-gray-700 font-medium">
                                                    Popular
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{post.title}</h3>
                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                {post.content && post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Latest Posts */}
                <section className="mb-12 slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold gradient-text">Latest Posts</h2>
                        <Link to="/all-posts" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover-scale">
                            View All
                        </Link>
                    </div>
                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post, index) => (
                                <div key={post.$id} className="zoom-in" style={{ animationDelay: `${0.2 + (0.05 * index)}s` }}>
                                    <PostCard post={post} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 slide-up">
                            <h3 className="text-xl font-semibold gradient-text mb-2">No posts yet</h3>
                            <p className="text-gray-500 mb-4">Check back later for new content</p>
                            {authStatus && (
                                <Link 
                                    to="/add-post"
                                    className="btn-gradient inline-block px-6 py-3 rounded-lg font-medium"
                                >
                                    Create First Post
                                </Link>
                            )}
                        </div>
                    )}
                </section>

                {/* Newsletter Section */}
                <section className="mb-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white slide-in-right" style={{ animationDelay: '0.25s' }}>
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4 bounce">Stay Updated</h2>
                        <p className="mb-6 slide-up" style={{ animationDelay: '0.3s' }}>Subscribe to our newsletter to receive the latest updates and articles</p>
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto slide-up" style={{ animationDelay: '0.35s' }}>
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                className="flex-grow px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={subscribeStatus.loading || subscribeStatus.success}
                            />
                            <button 
                                type="submit"
                                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-70 hover-scale"
                                disabled={subscribeStatus.loading || subscribeStatus.success}
                            >
                                {subscribeStatus.loading ? 'Subscribing...' : 
                                 subscribeStatus.success ? 'Subscribed!' : 'Subscribe'}
                            </button>
                        </form>
                        {subscribeStatus.error && (
                            <p className="mt-2 text-red-200 fade-in">{subscribeStatus.error}</p>
                        )}
                        {subscribeStatus.success && (
                            <p className="mt-2 text-green-200 fade-in">Thank you for subscribing!</p>
                        )}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="mb-12 bg-white rounded-xl p-8 shadow-md text-center slide-in-left" style={{ animationDelay: '0.3s' }}>
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4 gradient-text bounce">Ready to Share Your Story?</h2>
                        <p className="text-gray-600 mb-6 slide-up" style={{ animationDelay: '0.35s' }}>Join our community of writers and share your knowledge with the world</p>
                        {authStatus ? (
                            <Link 
                                to="/add-post"
                                className="btn-gradient inline-block px-8 py-4 rounded-lg font-medium slide-up"
                                style={{ animationDelay: '0.4s' }}
                            >
                                Create New Post
                            </Link>
                        ) : (
                            <Link 
                                to="/login"
                                className="btn-gradient inline-block px-8 py-4 rounded-lg font-medium slide-up"
                                style={{ animationDelay: '0.4s' }}
                            >
                                Sign In to Get Started
                            </Link>
                        )}
                    </div>
                </section>
            </main>
        </div>
    )
}

export default HomePage