import axios from "axios";

const HOST = import.meta.env.VITE_API_URL;

export const requestResetCode = async (email: string) => {
    return axios.post(`${HOST}/auth/request-reset`, { email });
};

export const verifyResetCode = async (email: string, code: string) => {
    return axios.post(`${HOST}/auth/verify-reset-code`, { email, code });
};

export const updatePassword = async (
    email: string, 
    code: string, 
    newPassword: string
) => {
    return axios.post(`${HOST}/auth/set-new-password`, {
        email,
        code,
        password: newPassword
    });
}