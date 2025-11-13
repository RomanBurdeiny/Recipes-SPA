import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import useSignOut from '../../hooks/useSignOut';
import { auth } from '../../../firebase-config';
import useAuth from '../../hooks/useAuth';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const user = auth.currentUser;
  const handleSignOut = useSignOut();

  if (!isAuthenticated) return null;

  return (
    <AppBar
      position="sticky"
      sx={{
        mb: 4,
        backgroundColor: '#ff7a21',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          maxWidth: 1280,
          width: '100%',
          mx: 'auto',
          px: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={3}>
          <Typography
            variant="h4"
            sx={{
              cursor: 'pointer',
              mr: 3,
              fontFamily: '"Great Vibes", cursive',
              fontSize: '40px',
              color: '#fff',
              textShadow: '2px 2px 6px rgba(0,0,0,0.35)',
            }}
            onClick={() => navigate('/')}
          >
            Recipes
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
            <Typography variant="body2" sx={{ color: '#fff', mr: 1 }}>
              {user.email}
            </Typography>
          )}

          <Button
            color="inherit"
            onClick={handleSignOut}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Sign Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
