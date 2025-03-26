import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import service from '../../appwrite/config'
import Header from '../Header/Header'
import PostCard from '../Postcard'
import Button from '../Button'
import Input from '../Input'
import LoadingSkeleton from '../LoadingSkeleton'

function Profile() {
    const { userData } = useSelector((state) => state.auth)
    const [userPosts, setUserPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const { register, handleSubmit, setValue } = useForm()

    useEffect(() => {
        fetchUserPosts()
        if (userData) {
            setValue('name', userData.name)
            setValue('email', userData.email)
        }
    }, [userData])

    const fetchUserPosts = async () => {
        try {
            const response = await service.getUserPosts(userData.$id)
            setUserPosts(response.documents)
        } catch (error) {
            console.error('Error fetching user posts:', error)
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (data) => {
        try {
            await service.updateUser(userData.$id, {
                name: data.name,
                email: data.email
            })
            setEditing(false)
        } catch (error) {
            console.error('Error updating profile:', error)
        }
    }

    if (loading) {
        return (
            <div>
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <LoadingSkeleton />
                </div>
            </div>
        )
    }

    return (
        <div>
            <Header />
            <main className="container mx-auto px-4 py-8">
                {/* Profile Section */}
                <section className="mb-12">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
                            <div>
                                <h2 className="text-2xl font-semibold">{userData.name}</h2>
                                <p className="text-gray-600">{userData.email}</p>
                            </div>
                        </div>

                        {editing ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <Input
                                    label="Name"
                                    {...register('name', { required: true })}
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    {...register('email', { required: true })}
                                />
                                <div className="flex space-x-4">
                                    <Button type="submit">Save Changes</Button>
                                    <Button
                                        type="button"
                                        onClick={() => setEditing(false)}
                                        className="bg-gray-500 hover:bg-gray-600"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <Button onClick={() => setEditing(true)}>
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </section>

                {/* User Posts */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userPosts.map((post) => (
                            <PostCard key={post.$id} post={post} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Profile 