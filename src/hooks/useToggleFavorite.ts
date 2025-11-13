import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { auth } from '../../firebase-config';
import { toggleFavoriteForUser } from '../redux/favorites.slice';
import type { AppDispatch } from '../redux/store';

const useToggleFavorite = () => {
  const dispatch = useDispatch<AppDispatch>();

  const toggleFavorite = useCallback(
    (recipeId: number) => {
      const user = auth.currentUser;
      if (!user) {
        return;
      }

      dispatch(
        toggleFavoriteForUser({
          uid: user.uid,
          recipeId,
        })
      );
    },
    [dispatch]
  );

  return { toggleFavorite };
};

export default useToggleFavorite;
