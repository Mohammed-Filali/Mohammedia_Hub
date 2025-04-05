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

    ReclamationStatusUpdate: async (id ,status) => {
        const {data}=await AxiosClient.put(`api/reclamation/status/${id}`,{'status':status});
        return  data
    },
    DeleteReclamation: async (id) => {
        const {data}=await AxiosClient.delete(`api/reclamation/${id}`);
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


    AddPull:async (values) => {        
        const {data}=await AxiosClient.post('/api/polls', {question:values})
        return  data
    },


    getPull:async () => {        
        const {data}=await AxiosClient.get('/api/polls')
        return  data
    },

    AddVote:async (pollId,voteType) => {        
        const {data}=await AxiosClient.post(`/api/polls/${pollId}/vote`, { vote: voteType })
        return  data
    },

    getVotes:async () => {
        const {data}=await AxiosClient.get('api/votes')
        return  data
    },
    getNews:async () => {
        const {data}=await AxiosClient.get('api/news')
        return  data
    },

    addNew:async (values) => {
        const {data}=await AxiosClient.post('api/news',values)
        return  data
    },
    updateNews:async (id,values) => {
        const {data}=await AxiosClient.post(`api/news/${id}`,values)
        return  data},

    deleteNews:async (id) => {
        const {data}=await AxiosClient.delete(`api/news/${id}`)
        return  data
    },

}


