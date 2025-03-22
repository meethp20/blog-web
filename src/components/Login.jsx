import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import {Button} from 'components/Button'
import { useDispatch } from 'react-redux'
import AuthService from '../appwrite/auth'
import { useForm } from 'react-hook-form'
import service from '../appwrite/config'
import Input from './Input'

const login =async (data) =>{
    setError("")
    try {
        const session =  AuthService.login(data,email)
        if(session){
            const userData=await AuthService.getCurrentUser()
            if(userData) dispatch(authLogin(userData));
            navigate("/")
        
        }
    } catch (error) {
        setError(error.message)
    }

}
function Login() {
 const navigate  =useNavigate()
 const dispatch = useDispatch()
  const {register,handleSubmit} = useForm()
  const [error,setError] = useState("") 
    return (
    <div className='flex items-center justify-center w-full'>
        <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
        <div className='mb-2 flex justify-center '> 
            <span className='inline-block w-full max-w-[100px]'>
                /*logo */
            </span>
            <h2>sign in to your account</h2>
           <p className='mt-2 text-center text-base text-black/60'>
           dont have any account
           <Link to="/signup" className=' font-medium text-primary transition-all duration-200 hover:underline'>
           sign up
           </Link>
           {error &&<p className="text-red-600 mt-8">{error}</p>}
          <form onSubmit={handleSubmit(login)}>
            <div className='space-y-5'>
                <Input
                 label="Email"
                 placeholder="enter your email"
                 type="email"
                 {...register("email",{
                    required:true,
                    validate:{
                        matchPattern:(value)=>/^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/.test(value)|| "email address must be a valid address"
                    }
                 })}  />

                 <Input
                 label="password: "
                 type="password"
                 placeholder="enter your password"
                 {...register("password",{
                    required:true,
                 })}
                 />
                 <Button 
                 type="submit"
                 className="w-full"
                 >sign in</Button>
            </div>
          </form>

           </p>
        </div>
        </div>
        
    </div>
  )
}

export default Login