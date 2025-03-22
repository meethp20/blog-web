                import conf from "../conf/conf"
    import {Client,Account} from "appwrite"

    export class AuthService{
        client=new Client();
        account;
        constructor(){
            this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
            this.account= new Account(this.client);
        }
        async createAccount({email,password,name}){
            try{
                const userAccount =await this.account.create
                (Id.unique(),email,password,name);
                if(userAccount){
                    return this.login({email,password});
                }else{
                    return userAccount;
                }
            }catch(error){
                throw error;
            }
        }
        async login({email,password}){
            try{
                return await this.account.createEmailSession(email,password);
            }catch(error){
                throw error;
            }
        }
        async getCurrentUser(){
            try{
                return await this.account.get();
            }catch(error){
                console.log("get user error :  " ,error)
            }
            return null;
        }
        async logout(){
            try{
                await this.account.deleteSessions();
            }catch(error){
                console.log("appwrite:logout.error",error);
                
            }
        }
    }

    const authService = new AuthService();

    export default AuthService;

    