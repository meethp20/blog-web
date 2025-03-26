import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({children, authentication = true}) {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)
    
    useEffect(() => {
        if (authentication && !authStatus) {
            navigate("/login")
        } else if (!authentication && authStatus) {
            navigate("/")
        }
        setLoader(false)
    }, [navigate, authStatus, authentication])

    if (loader) return <div>Loading...</div>
    
    return <>{children}</>
}