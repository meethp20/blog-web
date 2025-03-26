import React from 'react'
import { Link } from 'react-router-dom'

function Logo() {
    return (
        <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-white">BlogApp</h1>
        </Link>
    )
}

export default Logo 