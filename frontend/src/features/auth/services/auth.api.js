import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials:true
})

export async function register({email,username,password}) {
   try {
     const response = await api.post("/api/auth/register",
        {
            email,password,username
        }
    )
    return response.data
   } catch (error) {
    throw error?.response?.data || { message: error.message || "Network error" }
   }
}

export async function login({email,password}) {
   try {
     const response = await api.post("/api/auth/login",{
        email,password
    })
    return response.data
   } catch (error) {
    throw error?.response?.data
   }
}

export async function getMe() {
    const response = await api.get("/api/auth/getme")
    return response.data
}

export async function logOut() {
    const response = await api.post("/api/auth/logOut")
    return response.data
}