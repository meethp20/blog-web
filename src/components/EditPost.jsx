import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../index";
import service from "../appwrite/config";
import RTE from "./RTE";

function EditPost() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        status: "active",
        categoryId: "",
    });

    useEffect(() => {
        // Fetch post and categories when component mounts
        const fetchData = async () => {
            try {
                setLoading(true);
                const [postData, categoriesData] = await Promise.all([
                    service.getPost(slug),
                    service.getCategories()
                ]);
                
                if (postData) {
                    setPost(postData);
                    setFormData({
                        title: postData.title || "",
                        slug: postData.slug || "",
                        content: postData.content || "",
                        status: postData.status || "active",
                        categoryId: postData.categoryId || "",
                    });
                    
                    if (postData.featuredImage) {
                        setImagePreview(service.getFilePreview(postData.featuredImage));
                    }
                } else {
                    setError("Post not found");
                    setTimeout(() => navigate("/all-posts"), 3000);
                }
                
                if (categoriesData?.documents) {
                    setCategories(categoriesData.documents);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load post data");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchData();
        }
    }, [slug, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!formData.title || !formData.content) {
            setError("Title and content are required");
            setLoading(false);
            return;
        }

        try {
            let featuredImageId = post.featuredImage;
            
            // If a new image was uploaded, process it first
            if (imageFile) {
                const fileId = await service.uploadFile(imageFile);
                if (fileId) {
                    featuredImageId = fileId;
                    // Delete the old image if there was one
                    if (post.featuredImage) {
                        await service.deleteFile(post.featuredImage);
                    }
                }
            }
            
            // Update the post
            const response = await service.updatePost(post.$id, {
                ...formData,
                featuredImage: featuredImageId,
            });

            if (response) {
                navigate(`/post/${formData.slug}`);
            }
        } catch (error) {
            console.error("Error updating post:", error);
            setError(error.message || "Failed to update post");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === "file") {
            if (files.length > 0) {
                setImageFile(files[0]);
                setImagePreview(URL.createObjectURL(files[0]));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleEditorChange = (content) => {
        setFormData(prev => ({
            ...prev,
            content
        }));
    };

    if (loading && !post) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-12 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-12 bg-gray-200 rounded"></div>
                                <div className="h-64 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    if (error && !post) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="bg-red-50 p-6 rounded-lg">
                            <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                            <p className="text-red-500 mb-4">{error}</p>
                            <p className="text-gray-600">Redirecting to all posts...</p>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Container>
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Edit Post</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                                {error}
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter post title"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Slug</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="post-url-slug"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">URL-friendly version of the title</p>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Category</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category.$id} value={category.$id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Content *</label>
                            <RTE
                                name="content"
                                value={formData.content}
                                onChange={handleEditorChange}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Featured Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                <input
                                    type="file"
                                    name="featuredImage"
                                    onChange={handleChange}
                                    accept="image/png, image/jpeg, image/jpg, image/gif"
                                    className="hidden"
                                    id="featured-image"
                                />
                                <label htmlFor="featured-image" className="cursor-pointer">
                                    {imagePreview ? (
                                        <div className="flex flex-col items-center">
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                className="max-h-40 mb-4 rounded"
                                            />
                                            <span className="text-blue-600 font-medium">Change image</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-gray-600">Click to upload an image</span>
                                            <span className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG, GIF up to 5MB</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="active">Published</option>
                                <option value="inactive">Draft</option>
                            </select>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/post/${post.slug}`)}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-colors"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </span>
                                ) : "Update Post"}
                            </button>
                        </div>
                    </form>
                </div>
            </Container>
        </div>
    );
}

export default EditPost;
