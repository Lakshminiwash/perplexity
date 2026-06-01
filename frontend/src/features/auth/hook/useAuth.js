import { useDispatch } from "react-redux";
import { setValidationError,setError, setLoading, setUser } from "../auth.slice";
import { getMe, login, register } from "../services/auth.api";

export function useAuth() {
    const dispatch = useDispatch()

    async function handleRegister({ email, password, username }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            dispatch(setValidationError([]))
            await register({ email, password, username })
        } catch (error) {
            dispatch(setError(error))
            dispatch(setValidationError(error?.errors || error.response?.data?.message || "Registration failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setError(null))
            dispatch(setLoading(true))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error || "login failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetme() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch user data"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetme
    }
}