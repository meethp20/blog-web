import { Client, ID, Databases, Storage, Query } from "appwrite";
import conf from '../conf/conf';

class Service {
    client = new Client();
    databases;
    storage;

    constructor() {
        try {
            this.client
                .setEndpoint(conf.appwriteUrl)
                .setProject(conf.appwriteProjectId);
            this.databases = new Databases(this.client);
            this.storage = new Storage(this.client);
        } catch (error) {
            console.error('Error initializing Service:', error);
            throw new Error('Failed to initialize Appwrite service');
        }
    }

    async createPost({ title, slug, content, featuredImage, status, userId, categoryId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(),
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                    slug,
                    categoryId
                }
            );
        } catch (error) {
            console.error('Error creating post:', error);
            throw new Error('Failed to create post: ' + error.message);
        }
    }

    async updatePost(postId, { title, content, featuredImage, status, slug, categoryId }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    slug,
                    categoryId
                }
            );
        } catch (error) {
            console.error('Error updating post:', error);
            throw new Error('Failed to update post: ' + error.message);
        }
    }

    async deletePost(postId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId
            );
            return true;
        } catch (error) {
            console.error('Error deleting post:', error);
            throw new Error('Failed to delete post: ' + error.message);
        }
    }

    async getPost(slug) {
        try {
            const posts = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [Query.equal('slug', slug)]
            );
            
            if (posts.documents.length === 0) {
                throw new Error('Post not found');
            }
            
            return posts.documents[0];
        } catch (error) {
            console.error('Error getting post:', error);
            throw new Error('Failed to get post: ' + error.message);
        }
    }

    async getPosts(queries = []) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
        } catch (error) {
            console.error('Error getting posts:', error);
            throw new Error('Failed to get posts: ' + error.message);
        }
    }

    async getPostsByCategory(categoryId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [Query.equal('categoryId', categoryId)]
            );
        } catch (error) {
            console.error('Error getting posts by category:', error);
            throw new Error('Failed to get posts by category: ' + error.message);
        }
    }

    // Category methods
    async getCategories() {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCategoryCollectionId
            );
        } catch (error) {
            console.error('Error getting categories:', error);
            throw new Error('Failed to get categories: ' + error.message);
        }
    }

    async getCategoryBySlug(slug) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCategoryCollectionId,
                [Query.equal('slug', slug)]
            );
        } catch (error) {
            console.error('Error getting category by slug:', error);
            throw new Error('Failed to get category: ' + error.message);
        }
    }

    async createCategory({ name, slug, description = '' }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCategoryCollectionId,
                ID.unique(),
                {
                    name,
                    slug,
                    description
                }
            );
        } catch (error) {
            console.error('Error creating category:', error);
            throw new Error('Failed to create category: ' + error.message);
        }
    }

    // File handling methods
    async uploadFile(file) {
        try {
            const result = await this.storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
            return result.$id;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Failed to upload file: ' + error.message);
        }
    }

    async deleteFile(fileId) {
        try {
            await this.storage.deleteFile(
                conf.appwriteBucketId,
                fileId
            );
            return true;
        } catch (error) {
            console.error('Error deleting file:', error);
            throw new Error('Failed to delete file: ' + error.message);
        }
    }

    getFilePreview(fileId) {
        try {
            return this.storage.getFilePreview(
                conf.appwriteBucketId,
                fileId
            );
        } catch (error) {
            console.error('Error getting file preview:', error);
            throw new Error('Failed to get file preview: ' + error.message);
        }
    }
}

const service = new Service();
export default service;