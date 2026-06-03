import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setError, setValidationError } from "../auth.slice";

const STRENGTH_COLORS = ["#E24B4A", "#EF9F27", "#1D9E75", "#20808D"];

export default function Register() {

    const dispatch = useDispatch()

    const { handleRegister } = useAuth()
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [submitted, setSubmitted] = useState(false)

    const user = useSelector((state) => state.auth.user)
    const loading = useSelector((state) => state.auth.loading)
    const validationError = useSelector((state) => state.auth.validationError)
    const error = useSelector((state) => state.auth.error)

    useEffect(() => {
        if (!submitted) return
        if (loading) return
        if (Array.isArray(validationError) && validationError.length > 0) {
            const errorMessage = validationError
                .map(element => element.msg)
                .join("\n")
            alert(errorMessage)
            return
        }
        if (error) {
            alert(typeof error === 'string' ? error : error.message || "Registration failed")          
            return
        }
        alert("Registration successful! Check your Gmail to verify.")
    }, [loading])

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault()

        dispatch(setValidationError([]))
        setSubmitted(true)
        dispatch(setError(null))
        const payload = {
            username,
            email,
            password,
        }
        const success = await handleRegister(payload)
        if (success) {
        alert("Registration successful! Check your Gmail to verify.")
    }
    }

    if (!loading && user) {
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen bg-[#f4f4f0] flex items-center justify-center px-4 font-['Sora',sans-serif]">
            <div className="bg-white border border-[#e2e2de] rounded-2xl p-10 w-full max-w-md shadow-sm">

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-[#20808D] rounded-lg flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
                            strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <circle cx="12" cy="12" r="3" />
                            <line x1="12" y1="2" x2="12" y2="6" />
                            <line x1="12" y1="18" x2="12" y2="22" />
                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                            <line x1="2" y1="12" x2="6" y2="12" />
                            <line x1="18" y1="12" x2="22" y2="12" />
                        </svg>
                    </div>
                    <span className="text-lg font-semibold text-gray-900 tracking-tight">Perplexity</span>
                </div>

                {/* Heading */}
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Create account</h2>
                <p className="text-sm text-gray-400 font-light mt-1 mb-6">Join millions of curious minds</p>

                <form onSubmit={submitHandler}>
                    {/* Full Name Field */}
                    <div className="mb-4">
                        <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-1.5">
                            Full Name
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => { setUsername(e.target.value) }}
                                placeholder="Jane Smith"
                                autoComplete="name"
                                required
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#f1efe8] border border-[#d3d1c7] rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-[#20808D] focus:ring-2 focus:ring-[#20808D]/20 focus:bg-white transition"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-1.5">
                            Email
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#f1efe8] border border-[#d3d1c7] rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-[#20808D] focus:ring-2 focus:ring-[#20808D]/20 focus:bg-white transition"
                            />
                        </div>
                    </div>

                    {/* Password Field with Strength */}
                    <div className="mb-5">
                        <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                autoComplete="new-password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#f1efe8] border border-[#d3d1c7] rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-[#20808D] focus:ring-2 focus:ring-[#20808D]/20 focus:bg-white transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#20808D] transition"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full cursor-pointer py-2.5 bg-[#20808D] hover:bg-[#1a6e79] active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition"
                    >
                        {loading ? "creating..." : "Create account"}
                    </button>

                </form>

                {/* Terms */}
                <p className="text-center text-[11px] text-gray-400 mt-4 leading-relaxed">
                    By signing up, you agree to the{" "}
                    <span className="text-[#20808D] cursor-pointer hover:underline">Terms of Service</span>{" "}
                    and{" "}
                    <span className="text-[#20808D] cursor-pointer hover:underline">Privacy Policy</span>
                </p>

                {/* Navigate to Login */}
                <p className="text-center text-sm text-gray-400 mt-5">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-[#20808D] font-medium hover:underline bg-transparent border-none cursor-pointer"
                    >
                        Sign in
                    </button>
                </p>

            </div>
        </div>
    );
}