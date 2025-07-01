import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyResetCode, updatePassword } from "./forgotReset";
import './ForgotResetPwd.css';

export default function ResetPwd() {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
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
        try {
            console.log(codeVerified);
            if(!codeVerified) {
                await verifyResetCode(email, code);
                setCodeVerified(true);
            } else {
                await updatePassword(email, code, newPassword);
                navigate("/login");
            }
        } catch (err: any) {
            alert("Something went wrong. Check your inputs.")
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
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button  className="reset-submit-btn" type="submit">Set Password</button>
                    </>
                )}
            </form>
        </div>
    )
}