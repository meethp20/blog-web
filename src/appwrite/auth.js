import { Client, Account, ID } from 'appwrite'
import conf from '../conf/conf'

class AuthService {
    client = new Client()
    account

    constructor() {
        try {
            this.client
                .setEndpoint(conf.appwriteUrl)
                .setProject(conf.appwriteProjectId)
            this.account = new Account(this.client)
        } catch (error) {
            console.error('Error initializing AuthService:', error)
            throw new Error('Failed to initialize authentication service')
        }
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            )
            if (userAccount) {
                return this.login({ email, password })
            } else {
                throw new Error('Failed to create account')
            }
        } catch (error) {
            console.error('Error creating account:', error)
            throw error
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailSession(email, password)
        } catch (error) {
            console.error('Error during login:', error)
            throw new Error(error.message || 'Failed to login')
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get()
        } catch (error) {
            console.error('Error getting current user:', error)
            return null
        }
    }

    async logout() {
        try {
            return await this.account.deleteSessions()
        } catch (error) {
            console.error('Error during logout:', error)
            throw new Error('Failed to logout')
        }
    }
}

const authService = new AuthService()

export default authService

    