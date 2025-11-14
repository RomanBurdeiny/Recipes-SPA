import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Chip, Divider } from '@mui/material';
import { useGetRecipesQuery } from '../../shared/api';
import type { Recipe } from '../../shared/types';

const RecipeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const recipeId = Number(id);
  const { data, isLoading } = useGetRecipesQuery({ limit: 0 });

  const recipe = data?.recipes.find(r => r.id === recipeId) as Recipe;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h5">Recipe not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1280, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" fontWeight={700} mb={2}>
        {recipe.name}
      </Typography>

      <Box
        component="img"
        src={recipe.image}
        alt={recipe.name}
        sx={{
          width: '100%',
          maxHeight: 500,
          objectFit: 'cover',
          borderRadius: 3,
          mb: 4,
        }}
      />

      {/* Метаданные */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <Chip label={`Cuisine: ${recipe.cuisine}`} color="primary" />
        <Chip label={`Meal type: ${recipe.mealType}`} color="secondary" />
        <Chip label={`Calories: ${recipe.caloriesPerServing} kcal`} />
        <Chip label={`Rating: ${recipe.rating}`} />
        <Chip label={`Difficulty: ${recipe.difficulty}`} />
        <Chip label={`Prep: ${recipe.prepTimeMinutes} min`} />
        <Chip label={`Cook: ${recipe.cookTimeMinutes} min`} />
      </Box>

      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" fontWeight={600} mb={1}>
        Ingredients
      </Typography>
      <Box sx={{ pl: 2, mb: 4 }}>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          recipe.ingredients.map((ing: string, idx: number) => (
            <Typography key={idx} variant="body1">
              • {ing}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No ingredients list available.
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" fontWeight={600} mb={1}>
        Instructions
      </Typography>
      <Box sx={{ pl: 2 }}>
        {recipe.instructions && recipe.instructions.length > 0 ? (
          recipe.instructions.map((step: string, idx: number) => (
            <Typography key={idx} variant="body1" mb={1}>
              {idx + 1}. {step}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No instructions available.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default RecipeDetailsPage;
