import { createRoot } from 'react-dom/client';
import './index.css';
import LogIn from './pages/AuthForm/LogIn';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './pages/RegistrationForm/SignUp';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LogIn />} />
      <Route path="/" element={<SignUp />} />
    </Routes>
  </BrowserRouter>
);
