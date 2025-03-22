import { configureStore } from "@reduxjs/toolkit";


const store = configureStore({
    reducer:{
        user: userReducer,
        auth: authReducer,
        post: postReducer,
    }
})



export default store;
