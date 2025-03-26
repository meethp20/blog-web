import React from 'react'

function Input({
    label,
    type = "text",
    placeholder,
    className = "",
    ...props
}) {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
                {...props}
            />
        </div>
    )
}

export default Input