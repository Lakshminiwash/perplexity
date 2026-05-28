import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth";

const Login = ()=> {

    const {handleLogin} = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const user = useSelector(state=>state.auth.user)
    const loading = useSelector(state=>state.auth.loading)

    const [showPassword, setShowPassword] = useState(false);

    const submitHandler = async(e) => {
        e.preventDefault()

        const payload = {
            email,password
        }
        await handleLogin(payload)
    }

    if(!loading && user){
        return <Navigate to="/" replace/>
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
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Welcome back</h2>
                <p className="text-sm text-gray-400 font-light mt-1 mb-6">Sign in to continue exploring</p>

                <form onSubmit={submitHandler}>

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

                    {/* Password Field */}
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
                                placeholder="Your password"
                                autoComplete="current-password"
                                id="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                                required
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
                        className="w-full py-2.5 bg-[#20808D] hover:bg-[#1a6e79] active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition"
                    >
                        Sign in
                    </button>
                </form>

                {/* Navigate to Register */}
                <p className="text-center text-sm text-gray-400 mt-6">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        onClick={() => { navigate("/register") }}
                        className="text-[#20808D] font-medium hover:underline bg-transparent border-none cursor-pointer"
                    >
                        Sign up
                    </button>
                </p>

            </div>
        </div>
    );
}

export default Login