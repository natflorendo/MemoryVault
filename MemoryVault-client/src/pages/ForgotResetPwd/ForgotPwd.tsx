import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestResetCode } from "./forgotReset";
import './ForgotResetPwd.css'

export default function ForgotPwd() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await requestResetCode(email);
            setSent(true);
        } catch (err) {
            alert("Failed to send reset code.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="forgot-container">
            <h1>Forgot Password</h1>
            {!sent ? (
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button className="forgot-submit-btn" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                Sending...
                                <span className="spinner"/>
                            </>
                        ) : (
                            "Send Reset Code"
                        )}
                    </button>
                </form>
            ) : (
                <>
                    <button 
                        className="forgot-back-btn" 
                        onClick={() => { setSent(false); setEmail("") } }
                    >
                        Back
                    </button>
                    <p>Check your email for a 6-digit code.</p>
                    <button 
                        className="forgot-submit-btn" 
                        onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
                    >
                        Enter Reset Code
                    </button>
                </>
            )}
            <span>
                Already have an account?{' '}
                <button className="auth-mode" onClick={() => navigate("/login")}>
                    Sign In
                </button>
            </span>
        </div>
    )

}