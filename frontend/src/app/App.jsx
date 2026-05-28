import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './App.routes'
import { useAuth } from '../features/auth/hook/useAuth'
import { useEffect } from 'react'

const App = () => {
    const auth = useAuth()
    useEffect(()=>{
        auth.handleGetme()
    },[])
  return (
    <RouterProvider router={router}/>   
  )
}

export default App