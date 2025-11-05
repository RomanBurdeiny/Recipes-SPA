import { createRoot } from 'react-dom/client';
import './App.css';
import LogIn from './pages/AuthForm/LogIn';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './pages/RegistrationForm/SignUp';
import RecipesPage from './pages/RecipesPage/RecipesPage';
import { store } from './redux/store';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    ё
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<RecipesPage />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
