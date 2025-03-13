import { AxiosClient } from "../api/axiosClient";


export const UserApi = {
    getCsrfToken : async()=>{
        return await AxiosClient.get("/sanctum/csrf-cookie");
    },
    login : async (values)=>{
        return await AxiosClient.post("/api/login", values )        
         
    },
    logout : async ()=>{
        return await AxiosClient.post("/api/logout" )

    },
    getUser: async () => {
        const {data}=await AxiosClient.get(`api/user`);
        return  data
    },
    
    createUser: async (values) => {
        const {data} = await AxiosClient.post("/api/register", values )
    return data      },

    createReclamation: async (values) => {
        const {data} = await AxiosClient.post("api/reclamations", values )
    return data      },

    getReclamations : async ()=>{
        const {data} = await AxiosClient.get("api/reclamations" )
    return data
    },

    getUsers: async () => {
        const {data}=await AxiosClient.get(`api/users`);
        return  data
    },
    updateUserStatus: async (id,values) => {
        console.log(values);
        
        const {data}=await AxiosClient.put(`api/user/${id}`,{'isActive':values});
        return  data
    },
    
    updateReclamationStatus: async (id,values) => {
        console.log(values);
        
        const {data}=await AxiosClient.put(`api/reclamation/${id}`,values);
        return  data
    },

    getNotifications: async (id) => {
        const {data}=await AxiosClient.get(`/api/notifications/${id}`)
        return  data
    },

    MarkAsRead :async (id) => {        
        const {data}=await AxiosClient.put(`/api/notifications/${id}/read`)
        return  data
    },


    // AddNotifications: async (values) => {
    //     const {data}=await AxiosClient.post(`/api/notifications`,values)
    //     return  data
    // },
}


