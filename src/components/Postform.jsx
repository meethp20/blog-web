import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Input, Button } from "../index";
import service from "../appwrite/config";
import RTE from "./RTE";

function Postform() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const userData = useSelector((state) => state.auth.userData);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        status: "active",
        featuredImage: null,
        categoryId: "",
    });

    useEffect(() => {
        // Fetch categories when component mounts
        const fetchCategories = async () => {
            try {
                const response = await service.getCategories();
                if (response.documents) {
                    setCategories(response.documents);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    // Generate slug from title
    useEffect(() => {
        if (formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-zA-Z0-9]/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");
            
            setFormData(prev => ({
                ...prev,
                slug
            }));
        }
    }, [formData.title]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!formData.title || !formData.content || !formData.featuredImage) {
            setError("Please fill all required fields and upload a featured image");
            setLoading(false);
            return;
        }

        try {
            // First upload the image
            const fileId = await service.uploadFile(formData.featuredImage);
            
            if (fileId) {
                // Then create the post with the file ID
                const response = await service.createPost({
                    title: formData.title,
                    slug: formData.slug,
                    content: formData.content,
                    status: formData.status,
                    featuredImage: fileId,
                    categoryId: formData.categoryId || undefined,
                    userId: userData.$id,
                });

                if (response) {
                    navigate("/all-posts");
                }
            } else {
                throw new Error("Failed to upload image");
            }
        } catch (error) {
            console.error("Error creating post:", error);
            setError(error.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === "file") {
            if (files.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    [name]: files[0]
                }));
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

    return (
        <Container>
            <div className="max-w-3xl mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Create New Post</h1>
                
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
                        <p className="text-sm text-gray-500 mt-1">URL-friendly version of the title (auto-generated)</p>
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
                        <label className="block text-gray-700 font-medium mb-2">Featured Image *</label>
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
                                {formData.featuredImage ? (
                                    <div className="flex flex-col items-center">
                                        <img 
                                            src={URL.createObjectURL(formData.featuredImage)} 
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
                            onClick={() => navigate("/all-posts")}
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
                                    Creating...
                                </span>
                            ) : "Create Post"}
                        </button>
                    </div>
                </form>
            </div>
        </Container>
    );
}

export default Postform;