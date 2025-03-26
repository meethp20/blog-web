import React from 'react'

function LoadingSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 card">
            <div className="h-48 bg-gray-200 rounded-lg mb-4 shimmer"></div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 shimmer"></div>
            </div>
            <div className="mt-4 flex items-center space-x-4">
                <div className="h-8 w-8 bg-gray-200 rounded-full shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-24 shimmer"></div>
            </div>
        </div>
    )
}

export default LoadingSkeleton