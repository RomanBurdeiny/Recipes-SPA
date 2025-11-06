import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import './App.css';

import LogIn from './pages/AuthForm/LogIn';
import SignUp from './pages/RegistrationForm/SignUp';
import RecipesPage from './pages/RecipesPage/RecipesPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Header from './components/Header/Header';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import MyRecipesPage from './pages/MyRecipesPage/MyRecipesPage';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/login"
          element={
            <ProtectedRoute accessAuth={false} redirectTo="/">
              <LogIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <ProtectedRoute accessAuth={false} redirectTo="/">
              <SignUp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RecipesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-recipes"
          element={
            <ProtectedRoute>
              <MyRecipesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </Provider>
);
