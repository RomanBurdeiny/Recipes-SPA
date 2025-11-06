import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase-config';
import useAuth from '../../hooks/useAuth';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const user = auth.currentUser;

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" sx={{ cursor: 'pointer', mr: 4 }} onClick={() => navigate('/')}>
            🍲 Recipes
          </Typography>

          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            All Recipes
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Favorites
          </NavLink>

          <NavLink
            to="/my-recipes"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            My Recipes
          </NavLink>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          {user?.email && (
            <Typography variant="body2" sx={{ color: '#fff', mr: 2 }}>
              {user.email}
            </Typography>
          )}
          <Button color="inherit" onClick={handleLogout}>
            Sign Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
