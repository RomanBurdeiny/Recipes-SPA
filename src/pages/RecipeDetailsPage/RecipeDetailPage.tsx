import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography, Chip, Stack, Divider, Grid } from '@mui/material';

import { useGetRecipesQuery } from '../../shared/api';
import type { RootState } from '../../redux/store';
import type { UserRecipe, Recipe } from '../../shared/types';
import RecipeCard from '../../components/RecipeCard/RecipeCard';

const RecipeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipeId = Number(id);

  const myRecipe = useSelector((s: RootState) => s.myRecipes.items.find(r => r.id === recipeId)) as
    | UserRecipe
    | undefined;

  const { data, isLoading, isError } = useGetRecipesQuery({
    limit: 50,
  });

  const apiRecipe = data?.recipes.find((r: Recipe) => r.id === recipeId) ?? undefined;

  const recipe = myRecipe || apiRecipe;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading recipe</div>;
  }

  if (!recipe) {
    return (
      <Box sx={{ p: 4, maxWidth: 1280, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h5" mt={4}>
          Recipe not found
        </Typography>
      </Box>
    );
  }

  const normalizeTags = (tags: unknown): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags as string[];
    if (typeof tags === 'string') {
      return tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
    }
    return [];
  };

  const currentTags = normalizeTags((recipe as Recipe).tags);

  const allRecipes: Recipe[] = data?.recipes ?? [];

  const similarRecipes = allRecipes
    .filter(r => r.id !== recipeId)
    .filter(r => {
      const rTags = normalizeTags(r.tags);
      if (!currentTags.length || !rTags.length) return false;
      return rTags.some(tag => currentTags.includes(tag));
    })
    .slice(0, 4);

  return (
    <Box sx={{ p: 4, maxWidth: 1280, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={600} mb={2}>
        {recipe.name}
      </Typography>

      {recipe.image && (
        <Box
          sx={{
            width: '100%',
            maxHeight: 400,
            overflow: 'hidden',
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Box
            component="img"
            src={recipe.image}
            alt={recipe.name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      )}

      <Stack direction="row" spacing={1} mb={3} flexWrap="wrap">
        {recipe.cuisine && <Chip label={`Cuisine: ${recipe.cuisine}`} />}
        {recipe.rating && <Chip label={`Rating: ${recipe.rating}`} />}
        {recipe.difficulty && <Chip label={recipe.difficulty} />}
        {recipe.prepTimeMinutes && <Chip label={`Prep: ${recipe.prepTimeMinutes} min`} />}
        {recipe.mealType && <Chip label={recipe.mealType} />}
        {recipe.tags && (
          <Chip label={Array.isArray(recipe.tags) ? recipe.tags.join(', ') : recipe.tags} />
        )}
      </Stack>

      {(recipe as UserRecipe).ingredients && (
        <>
          <Typography variant="h5" mb={1}>
            Ingredients
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            {(recipe as UserRecipe).ingredients?.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </Box>
        </>
      )}

      <Divider sx={{ my: 3 }} />

      {(recipe as UserRecipe).instructions && (
        <>
          <Typography variant="h5" mb={1}>
            Instructions
          </Typography>
          <Box component="ol" sx={{ pl: 3 }}>
            {(recipe as UserRecipe).instructions?.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </Box>
        </>
      )}

      {similarRecipes.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h5" mb={2}>
            Similar recipes
          </Typography>

          <Grid container spacing={2}>
            {similarRecipes.map(similar => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={similar.id}>
                <RecipeCard
                  recipe={similar}
                  isFavorite={false}
                  onToggleFavorite={() => {}}
                  onOpen={() => navigate(`/recipes/${similar.id}`)}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default RecipeDetailsPage;
