import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './Login';

const OAuthHandler = () => {
  const navigate = useNavigate();
  const hasRun = useRef(false); //prevent re-render

  useEffect(() => {
    if(hasRun.current) { return; }
    hasRun.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    } else {
      alert("OAuth login failed.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="oAuth-spinner-wrapper">
      <div className="oAuth-spinner"/>
    </div>
);
};

export default OAuthHandler;