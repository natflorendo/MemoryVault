import axios from "axios";
import type { User } from "../../components/types";
import type { NavigateFunction } from "react-router-dom";

const HOST = import.meta.env.VITE_API_URL;

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Fetch the current user using the token
export const fetchCurrentUser = async (
    setUser: (user: User) => void,
    loadNotesAndTags: () => void,
    navigate: NavigateFunction
) => {
    try {
        const response = await axios.get<User>(`${HOST}/auth/me`);
        console.log(response.data)
        setUser(response.data);
        loadNotesAndTags();
    } catch (err: any) {
        console.error("Invalid or expired token");
        localStorage.removeItem("token");
        navigate("/login");
    }
    
}

// Handles login or registration form submission
export const handleSubmit = async (
    e: React.FormEvent,
    email: string,
    password: string,
    isRegister: boolean,
    navigate: NavigateFunction
) => {
    e.preventDefault();
    try {
        if (isRegister) {
            await axios.post(`${HOST}/auth/register`, { email, password });
        }
        const res = await axios.post(`${HOST}/auth/login`, { email, password });
        localStorage.setItem('token', res.data.token);

        const root = document.getElementById("root");
        if (root) { 
            root.classList.remove("scrollable-root"); 
            root.classList.add("fixed-root"); 
        }
        navigate('/');
    } catch (err:any) {
        alert('Invalid credentials')
    }
}