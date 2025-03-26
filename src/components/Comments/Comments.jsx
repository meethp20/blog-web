import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import service from '../../appwrite/config'
import Button from '../Button'
import Input from '../Input'

function Comments({ postId }) {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const { register, handleSubmit, reset } = useForm()
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        fetchComments()
    }, [postId])

    const fetchComments = async () => {
        try {
            const response = await service.getComments(postId)
            setComments(response.documents)
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (data) => {
        try {
            const comment = await service.createComment({
                content: data.content,
                postId: postId,
                userId: userData.$id,
                userName: userData.name
            })
            setComments([...comments, comment])
            reset()
        } catch (error) {
            console.error('Error creating comment:', error)
        }
    }

    if (loading) {
        return <div>Loading comments...</div>
    }

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Comments</h3>
            
            {/* Comment Form */}
            {userData && (
                <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
                    <Input
                        label="Add a comment"
                        placeholder="Write your comment here..."
                        {...register('content', { required: true })}
                    />
                    <Button type="submit" className="mt-4">
                        Post Comment
                    </Button>
                </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.$id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                            <span className="font-semibold">{comment.userName}</span>
                            <span className="text-gray-500 text-sm">
                                {new Date(comment.$createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Comments 