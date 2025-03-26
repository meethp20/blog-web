import React from 'react'
import service from '../appwrite/config'
import { Link } from 'react-router-dom'

function PostCard({ post }) {
  // Destructure post properties with fallbacks for safety
  const { $id, title, featuredImage, content, author, createdAt, categoryId } = post || {}
  
  // Format date for display
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : ''

  // Create a short excerpt from content - remove HTML tags
  const excerpt = content ? content.replace(/<[^>]*>/g, '').substring(0, 100) + (content.length > 100 ? '...' : '') : ''

  // Determine category class
  const getCategoryClass = () => {
    if (!categoryId) return 'tech'; // Default to tech
    
    // This is a simplified approach - in a real app, you'd fetch the category name from the categoryId
    // For now, we'll just alternate between tech and smut based on the ID's first character
    return categoryId.charAt(0).toLowerCase() < 'm' ? 'tech' : 'smut';
  }

  return (
    <Link to={`/post/${$id}`}>
      <div className='card hover-lift h-full flex flex-col'>
        <div className='relative overflow-hidden rounded-t-lg aspect-video'>
          {featuredImage ? (
            <img 
              src={service.getFilePreview(featuredImage)} 
              alt={title} 
              className='w-full h-full object-cover hover-scale'
            />
          ) : (
            <div className='w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center'>
              <span className='text-gray-400'>No image</span>
            </div>
          )}
          
          {/* Category tag */}
          <div className='absolute top-3 left-3'>
            <span className={`category-tag ${getCategoryClass()}`}>
              {getCategoryClass() === 'tech' ? 'Tech' : 'Smut'}
            </span>
          </div>
        </div>
        
        <div className='p-5 flex-grow flex flex-col'>
          <h3 className='text-xl font-bold mb-2 text-gray-800 line-clamp-2'>{title}</h3>
          
          <p className='text-gray-600 mb-4 text-sm line-clamp-3'>{excerpt}</p>
          
          <div className='mt-auto flex items-center justify-between text-sm text-gray-500'>
            <div className='flex items-center'>
              <div className='w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold mr-2'>
                {author ? author.name?.charAt(0) || 'A' : 'A'}
              </div>
              <span>{author?.name || 'Anonymous'}</span>
            </div>
            
            <span>{formattedDate}</span>
          </div>
        </div>
        
        <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500'></div>
      </div>
    </Link>
  )
}

export default PostCard