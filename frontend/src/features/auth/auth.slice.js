import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        loading:true,
        error:null,
        validationError:null
    },
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload
        },
        clearUser: (state) => {
            state.user = null
        },
        setLoading:(state,action)=>{
            state.loading = action.payload
        },
        setValidationError:(state,action)=>{
            state.validationError = action.payload
        },
        setError:(state,action)=>{
            state.error = action.payload
        }
    }
})

export const {setUser,setLoading,setValidationError,clearUser,setError } = authSlice.actions
export default authSlice.reducer