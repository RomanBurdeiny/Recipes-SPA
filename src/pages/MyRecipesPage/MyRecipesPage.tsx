// MyRecipesPage.tsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // 👈 добавили

import { auth } from '../../../firebase-config';
import type { RootState, AppDispatch } from '../../redux/store';
import {
  fetchMyRecipesForUser,
  createMyRecipeForUser,
  updateMyRecipeForUser,
  deleteMyRecipeForUser,
} from '../../redux/myRecipes.slice';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import MyRecipeModal from '../../components/MyRecipeModal/MyRecipeModal';
import type { UserRecipe, UserRecipeInput } from '../../shared/types';

const MyRecipesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // 👈

  const uid = auth.currentUser?.uid ?? null;
  const myRecipes = useSelector((s: RootState) => s.myRecipes.items);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedRecipe, setSelectedRecipe] = useState<UserRecipe | null>(null);

  useEffect(() => {
    if (uid) {
      dispatch(fetchMyRecipesForUser(uid));
    }
  }, [uid, dispatch]);

  const openCreateModal = () => {
    setSelectedRecipe(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (recipe: UserRecipe) => {
    setSelectedRecipe(recipe);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleSave = (data: UserRecipeInput, id?: number) => {
    if (!uid) return;

    if (modalMode === 'create') {
      dispatch(createMyRecipeForUser({ uid, recipe: data }));
    } else if (modalMode === 'edit' && id != null) {
      dispatch(updateMyRecipeForUser({ uid, recipe: { id, ...data } }));
    }

    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (!uid) return;
    dispatch(deleteMyRecipeForUser({ uid, recipeId: id }));
    setModalOpen(false);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1280, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        My Recipes
      </Typography>

      <Button variant="contained" sx={{ mb: 3 }} onClick={openCreateModal}>
        Add new recipe
      </Button>

      <Grid container spacing={3}>
        {myRecipes.map(recipe => (
          <Grid key={recipe.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <RecipeCard
              recipe={recipe}
              isFavorite={false}
              onToggleFavorite={() => {}}
              onOpen={() => navigate(`/my-recipes/${recipe.id}`)}
              onEdit={() => openEditModal(recipe)}
              onDelete={() => handleDelete(recipe.id)}
            />
          </Grid>
        ))}
      </Grid>

      <MyRecipeModal
        open={modalOpen}
        mode={modalMode}
        initialRecipe={selectedRecipe}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={modalMode === 'edit' ? handleDelete : undefined}
      />
    </Box>
  );
};

export default MyRecipesPage;
