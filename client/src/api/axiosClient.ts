import axios from 'axios'

const AxiosClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
  })

  AxiosClient.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  })

  export {AxiosClient}
