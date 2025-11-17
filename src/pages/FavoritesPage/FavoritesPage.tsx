import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { auth } from '../../../firebase-config';
import { useGetRecipesQuery } from '../../shared/api';
import RecipeCard from '../../components/RecipeCard/RecipeCard';

import type { RootState, AppDispatch } from '../../redux/store';
import { fetchFavoritesForUser, toggleFavoriteForUser } from '../../redux/favorites.slice';

const FavoritesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const uid = auth.currentUser?.uid ?? null;

  const { ids: favoriteIds, loading } = useSelector((state: RootState) => state.favorites);

  const { data, isLoading: recipesLoading } = useGetRecipesQuery({
    limit: 0,
  });

  useEffect(() => {
    if (uid) {
      dispatch(fetchFavoritesForUser(uid));
    }
  }, [uid, dispatch]);

  if (loading || recipesLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  const recipes = data?.recipes ?? [];
  const filteredFavorites = recipes.filter(r => favoriteIds.includes(r.id));

  return (
    <Box sx={{ p: 4, maxWidth: 1280, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Favorite Recipes
      </Typography>

      {filteredFavorites.length === 0 ? (
        <Typography>No favorites yet ❤️</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredFavorites.map(recipe => (
            <Grid key={recipe.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <RecipeCard
                recipe={recipe}
                isFavorite={favoriteIds.includes(recipe.id)}
                onToggleFavorite={() => {
                  if (!uid) return;
                  dispatch(
                    toggleFavoriteForUser({
                      uid,
                      recipeId: recipe.id,
                    })
                  );
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default FavoritesPage;
