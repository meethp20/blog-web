# BlogApp - Modern React Blog Platform

A professional, feature-rich blogging platform built with React, Redux, and Appwrite backend. This application provides a complete solution for creating, managing, and publishing blog content with a beautiful, responsive UI.

![BlogApp Screenshot](https://via.placeholder.com/800x400?text=BlogApp+Screenshot)

## Features

- **User Authentication**: Secure signup, login, and profile management
- **Content Management**: Create, edit, and delete blog posts
- **Rich Text Editing**: TinyMCE integration for professional content creation
- **Category System**: Organize posts with customizable categories
- **Responsive Design**: Beautiful UI that works on all devices
- **Image Management**: Upload and manage featured images for posts
- **Draft System**: Save posts as drafts before publishing

## Tech Stack

- **Frontend**: React, Redux, React Router, TailwindCSS
- **Backend**: Appwrite (BaaS)
- **Build Tool**: Vite
- **Rich Text Editor**: TinyMCE
- **Styling**: TailwindCSS with custom gradients and animations

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Appwrite account and project setup

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_COLLECTION_ID=your-collection-id
VITE_APPWRITE_CATEGORY_COLLECTION_ID=your-category-collection-id
VITE_APPWRITE_BUCKET_ID=your-bucket-id
VITE_TINYMCE_API_KEY=your-tinymce-api-key
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Appwrite Setup

1. Create an Appwrite project
2. Set up a database with two collections:
   - Posts collection
   - Categories collection
3. Create a storage bucket for images
4. Set up authentication methods (email/password, OAuth, etc.)
5. Configure appropriate security rules and permissions

## Project Structure

```
blog-web/
├── public/              # Static assets
├── src/
│   ├── appwrite/        # Appwrite service configuration
│   ├── components/      # React components
│   ├── conf/            # Configuration files
│   ├── store/           # Redux store setup
│   ├── App.jsx          # Main application component
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── .env                 # Environment variables
└── package.json         # Dependencies and scripts
```

## Key Components

- **Header/Footer**: Navigation and site structure
- **Postform**: Create and edit blog posts
- **Categories**: Manage post categories
- **AllPosts**: Display all blog posts
- **SinglePost**: Display individual post with comments
- **RTE**: Rich text editor integration

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Appwrite](https://appwrite.io/) for the backend services
- [TinyMCE](https://www.tiny.cloud/) for the rich text editor
- [TailwindCSS](https://tailwindcss.com/) for styling
- [React](https://reactjs.org/) and the React ecosystem
