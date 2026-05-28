import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";
import Protected from "../features/auth/component/Protected.jsx";
import Dashboard from "../features/auth/pages/Dashboard.jsx";


export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },{
        path: "/",
        element: <Protected>
            <Dashboard />
        </Protected>
    }

])