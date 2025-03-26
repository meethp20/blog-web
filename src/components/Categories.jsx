import React, { useState, useEffect } from 'react';
import { Container } from '../index';
import service from '../appwrite/config';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [addingStatus, setAddingStatus] = useState({ loading: false, error: null });
    
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);
    const isAdmin = userData?.role === 'admin';

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await service.getCategories();
            if (response?.documents) {
                setCategories(response.documents);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Auto-generate slug from name if the slug field wasn't manually edited
        if (name === 'name' && !newCategory.slugEdited) {
            setNewCategory(prev => ({
                ...prev,
                [name]: value,
                slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            }));
        } else {
            // If user is editing the slug directly, mark it as edited
            if (name === 'slug') {
                setNewCategory(prev => ({
                    ...prev,
                    slugEdited: true,
                    [name]: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                }));
            } else {
                setNewCategory(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!newCategory.name || !newCategory.slug) {
            setAddingStatus({ loading: false, error: "Name and slug are required" });
            return;
        }
        
        try {
            setAddingStatus({ loading: true, error: null });
            const response = await service.createCategory({
                name: newCategory.name,
                slug: newCategory.slug,
                description: newCategory.description
            });
            
            if (response) {
                setCategories(prev => [...prev, response]);
                setNewCategory({ name: '', slug: '', description: '' });
                setIsAdding(false);
            }
        } catch (error) {
            console.error("Error creating category:", error);
            setAddingStatus({ loading: false, error: error.message || "Failed to create category" });
        } finally {
            setAddingStatus({ loading: false, error: null });
        }
    };

    // Add predefined categories
    const addPredefinedCategories = async () => {
        const predefinedCategories = [
            { name: 'Tech', slug: 'tech', description: 'Technology related posts' },
            { name: 'Smut', slug: 'smut', description: 'Adult content posts' },
            { name: 'Lifestyle', slug: 'lifestyle', description: 'Lifestyle and personal development' },
            { name: 'Travel', slug: 'travel', description: 'Travel experiences and guides' },
            { name: 'Food', slug: 'food', description: 'Food recipes and reviews' }
        ];
        
        setLoading(true);
        
        try {
            // Check which categories already exist
            const existingCategories = categories.map(cat => cat.slug);
            const categoriesToAdd = predefinedCategories.filter(cat => !existingCategories.includes(cat.slug));
            
            if (categoriesToAdd.length === 0) {
                setError("All predefined categories already exist");
                setLoading(false);
                return;
            }
            
            // Add each new category
            const promises = categoriesToAdd.map(category => 
                service.createCategory(category)
            );
            
            await Promise.all(promises);
            await fetchCategories(); // Refresh the list
            
        } catch (error) {
            console.error("Error adding predefined categories:", error);
            setError("Failed to add predefined categories");
        } finally {
            setLoading(false);
        }
    };

    if (loading && categories.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                        <div className="space-x-3">
                            <button
                                onClick={addPredefinedCategories}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                disabled={loading}
                            >
                                {loading ? "Adding..." : "Add Predefined Categories"}
                            </button>
                            
                            {isAdmin && (
                                <button
                                    onClick={() => setIsAdding(!isAdding)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {isAdding ? "Cancel" : "Add New Category"}
                                </button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {isAdding && (
                        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                            <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newCategory.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Slug *</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={newCategory.slug}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">URL-friendly version (e.g., "tech-news")</p>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={newCategory.description}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows="3"
                                    ></textarea>
                                </div>
                                
                                {addingStatus.error && (
                                    <div className="text-red-600">
                                        {addingStatus.error}
                                    </div>
                                )}
                                
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        disabled={addingStatus.loading}
                                    >
                                        {addingStatus.loading ? "Adding..." : "Add Category"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {categories.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {categories.map(category => (
                                    <div 
                                        key={category.$id}
                                        className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/category/${category.slug}`)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                                                {category.description && (
                                                    <p className="text-gray-600 mt-1">{category.description}</p>
                                                )}
                                                <p className="text-sm text-gray-500 mt-2">Slug: {category.slug}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-500 mr-4">
                                                    {category.postCount || 0} posts
                                                </span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <h3 className="text-lg font-medium text-gray-700 mb-2">No categories found</h3>
                                <p className="text-gray-500 mb-4">Create your first category to organize your blog posts</p>
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Create Category
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Categories;
