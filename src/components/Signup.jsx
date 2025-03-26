import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login as authLogin } from '../store/authSlice'
import AuthService from '../appwrite/auth'
import { Container, Input, Button } from '../index'

function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const create = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const userData = await AuthService.createAccount({
                ...formData,
            })

            if (userData) {
                const userData = await AuthService.getCurrentUser()
                if (userData) {
                    dispatch(authLogin({ userData }))
                    navigate("/")
                }
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    return (
        <Container>
            <div className='mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10'>
                <div className='mb-2 flex justify-center'>
                    <span className='inline-block w-full max-w-[100px]'>
                        {/* Add your logo here */}
                    </span>
                </div>
                <h2 className="text-2xl font-bold text-center mb-4">Create an account</h2>
                <p className='mt-2 text-center text-base text-black/60'>
                    Already have an account?{' '}
                    <Link to="/login" className='font-medium text-primary transition-all duration-200 hover:underline'>
                        Sign in
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={create} className="mt-8">
                    <div className='space-y-5'>
                        <Input
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <Button 
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </div>
                </form>
            </div>
        </Container>
    )
}

export default Signup