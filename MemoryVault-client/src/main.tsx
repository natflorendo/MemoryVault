import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx'
import Login from './pages/Login/Login.tsx';
import OAuthHandler from './pages/Login/OAuthHandler.tsx';
import ForgotPwd from './pages/ForgotResetPwd/ForgotPwd.tsx';
import ResetPwd from './pages/ForgotResetPwd/ResetPwd.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/oauth-success" element={<OAuthHandler />} />
        <Route path="/" element={<App/>}/>
        <Route path="/forgot-password" element={<ForgotPwd/>}></Route>
        <Route path="/reset-password" element={<ResetPwd/>}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
