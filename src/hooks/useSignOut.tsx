import { signOut } from 'firebase/auth';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../redux/auth.slice';

const useSignOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      toast.success('Successfully logged out');
      navigate('/login', { replace: true });
    } catch (error: unknown) {
      toast.error(`Error signing out ${(error as Error).message}`);
    }
  }, [navigate, dispatch]);
  return handleSignOut;
};
export default useSignOut;
