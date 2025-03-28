import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor= 'bg-blue-600',
    textColor = " text-white",
    clasName = '',
    ...props
}) {

  return (
    <div
     className={`px-4 py-2 rounded-lg ${className} ${bgColor} ${textColor}` }
     { ...props}>
        {children}
        </div>
  )
}

export default Button