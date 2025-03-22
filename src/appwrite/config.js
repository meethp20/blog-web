import conf from "../conf/conf";
import { Client,ID,Databases,Storage,Query } from "appwrite";
 
export class Service{
    client = new Client();
    databases;
    bucket;
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.account= new Account(this.client);
        this.databases=new Databases(this.client);
        this.bucket=new Storage(this.client);
    }
    async createPost({title,slug,content,featuredImage,status}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            )
        } catch (error) {
            console.log("error in appwrite createpost",error)
        }
    }
    async updatePost( slug,{title,content,featuredImage,status,userId}){
        try {
            return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            slug,
            {
               title,
               content,
               featuredImage,                                  
               status
            }
            )
        } catch (error) {
            console.log("error appwrite config updatepost",error)
        }
    }
    async deletePost({slug}){
        try {
           await this.databases.deleteDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            slug
           )
          return true;   
        } catch (error) {
            console.log("error at deletepost in config.js appwrite " , error);
            return false;                 
        }
    }
    async getPost({slug}){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug

            )
        } catch (error) {
            console.log("appwrite serive getPost")
        }
    }
    async uploadFile(file){}

    async deleteFile(fileId){}

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBuckedId,
            fileId
        )
    }
}
const service = new Service()
export default service 