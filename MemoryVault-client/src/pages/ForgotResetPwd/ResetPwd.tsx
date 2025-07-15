import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyResetCode, updatePassword } from "./forgotReset";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './ForgotResetPwd.css';

export default function ResetPwd() {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [codeVerified, setCodeVerified] = useState(false);

    useEffect(() => {
        const queryEmail = new URLSearchParams(location.search).get("email");

        if(!queryEmail) {
            navigate("/forgot-password");
        } else {
            setEmail(queryEmail);
        }
    }, [location.search, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if(!codeVerified) {
                await verifyResetCode(email, code);
                setCodeVerified(true);
            } else {
                await updatePassword(email, code, newPassword);
                navigate("/login");
            }
        } catch (err: any) {
            alert("Something went wrong. Check your inputs.")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="reset-container">
            <h1>Reset Your Password</h1>
            <button 
                className="forgot-back-btn" 
                onClick={() => { navigate("/forgot-password") } }
            >
                Back
            </button>
            <form onSubmit={handleSubmit}>
                {!codeVerified ? (
                    <>
                        <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                        <button className="reset-submit-btn"  type="submit">Verify Code</button>
                    </>
                ) : (
                    <>
                        <div className="reset-password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button
                                className="reset-toggle-pwd-icon"
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                <FontAwesomeIcon 
                                    icon={showPassword ? faEye: faEyeSlash} 
                                />
                            </button>
                        </div>
                        <button  className="reset-submit-btn" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    Set Password
                                    <span className="spinner"/>
                                </>
                            ) : (
                                "Set Password"
                            )}
                        </button>
                    </>
                )}
            </form>
        </div>
    )
}