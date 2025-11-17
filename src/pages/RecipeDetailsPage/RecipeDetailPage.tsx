// pages/RecipeDetailsPage/RecipeDetailsPage.tsx
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography, Chip, Stack, Divider } from '@mui/material';

import { useGetRecipesQuery } from '../../shared/api';
import type { RootState } from '../../redux/store';
import type { UserRecipe, Recipe } from '../../shared/types';

const RecipeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const recipeId = Number(id);

  // 1) Ищем в моих рецептах
  const myRecipe = useSelector((s: RootState) => s.myRecipes.items.find(r => r.id === recipeId)) as
    | UserRecipe
    | undefined;

  // 2) Загружаем API рецепты
  const { data } = useGetRecipesQuery({ limit: 0 });
  const apiRecipe = data?.recipes.find((r: Recipe) => r.id === recipeId) ?? undefined;

  // 3) Универсальный рецепт
  const recipe = myRecipe || apiRecipe;

  if (!recipe) {
    return (
      <Box sx={{ p: 4, maxWidth: 1280, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h5" mt={4}>
          Recipe not found
        </Typography>
      </Box>
    );
  }

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

      {/* Чипсы */}
      <Stack direction="row" spacing={1} mb={3} flexWrap="wrap">
        {recipe.cuisine && <Chip label={`Cuisine: ${recipe.cuisine}`} />}
        {'rating' in recipe && <Chip label={`Rating: ${recipe.rating}`} />}
        {recipe.difficulty && <Chip label={recipe.difficulty} />}
        {recipe.prepTimeMinutes && <Chip label={`Prep: ${recipe.prepTimeMinutes} min`} />}
      </Stack>

      {/* Ingredients */}
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

      {/* Instructions */}
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
    </Box>
  );
};

export default RecipeDetailsPage;
