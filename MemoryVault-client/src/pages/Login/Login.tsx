import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleSubmit } from "./auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const root = document.getElementById("root");
        if(root) {
            root.classList.add("scrollable-root");
            root.classList.remove("fixed-root"); 
        }
    }, []);

    
    return (
        <div className="login-container">
            <h1>{isRegister ? "Register" : "Log In"}</h1>
            <form onSubmit={(e) => 
                handleSubmit(e, email, password, isRegister, navigate)}
            >
                <label htmlFor="email">Email:</label>
                <input 
                        type="email" 
                        placeholder="Email" 
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
                        required
                />

                <div className="password-container">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        className="toggle-pwd-icon"
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        <FontAwesomeIcon 
                            icon={showPassword ? faEye: faEyeSlash} 
                        />
                    </button>
                </div>


                <button className="login-submit-btn" type="submit">
                    {isRegister ? 'Sign Up' : 'Sign In'}
                </button>
            </form>
            <button
                className="auth-google-btn"
                onClick={() => { 
                    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
                }}
            >
                <img className="google-logo" src="/google-logo.png" alt="Google Logo" />
                <span>Continue with Google</span>
            </button>
            <span className="toggle-auth-mode">
                {isRegister ? (
                    <>
                        Already have an account?{' '}
                        <button className="auth-mode" onClick={() => setIsRegister(false)}>
                            Sign In
                        </button>
                    </>
                ) : (
                    <>
                        Don't have an account?{' '}
                        <button className="auth-mode" onClick={() => setIsRegister(true)}>
                            Sign Up
                        </button>
                    </>
                )}
            </span>
            <button className="forgot-pwd" onClick={() => navigate("/forgot-password")}>
                Forgot Password?
                </button>
        </div>
    )
}

export default Login;