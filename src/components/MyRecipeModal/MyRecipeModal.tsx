import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { UserRecipe, UserRecipeInput } from '../../shared/types';

interface MyRecipeModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialRecipe: UserRecipe | null;
  onClose: () => void;
  onSave: (data: UserRecipeInput, id?: number) => void;
  onDelete?: (id: number) => void;
}

const emptyForm: UserRecipeInput = {
  name: '',
  image: '',
  cuisine: '',
  rating: 0,
  difficulty: '',
  prepTimeMinutes: 0,
  ingredients: [],
  instructions: [],
};

const MyRecipeModal: React.FC<MyRecipeModalProps> = ({
  open,
  mode,
  initialRecipe,
  onClose,
  onSave,
  onDelete,
}) => {
  const [form, setForm] = useState<UserRecipeInput>(emptyForm);

  useEffect(() => {
    if (mode === 'edit' && initialRecipe) {
      const { ...rest } = initialRecipe;

      setForm({
        ...emptyForm,
        ...rest,
        ingredients: rest.ingredients ?? [],
        instructions: rest.instructions ?? [],
      });
    } else {
      setForm(emptyForm);
    }
  }, [mode, initialRecipe, open]);

  const handleChange =
    (field: keyof UserRecipeInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === 'rating' || field === 'prepTimeMinutes' ? Number(e.target.value) : e.target.value;

      setForm(prev => ({ ...prev, [field]: value }));
    };

  const preventEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  const handleIngredientsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arr = e.target.value
      .split(/[,;]+/)
      .map(s => s.trim())
      .filter(Boolean);
    setForm(prev => ({ ...prev, ingredients: arr }));
  };

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arr = e.target.value
      .split(/[,;]+/)
      .map(s => s.trim())
      .filter(Boolean);
    setForm(prev => ({ ...prev, instructions: arr }));
  };

  const handleSubmit = () => {
    const id = mode === 'edit' && initialRecipe ? initialRecipe.id : undefined;
    onSave(form, id);
  };

  const handleDeleteClick = () => {
    if (onDelete && initialRecipe) {
      onDelete(initialRecipe.id);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'create' ? 'Add new recipe' : 'Edit recipe'}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Title" value={form.name} onChange={handleChange('name')} fullWidth />

          <TextField
            label="Image URL"
            value={form.image}
            onChange={handleChange('image')}
            fullWidth
          />

          <TextField
            label="Cuisine"
            value={form.cuisine}
            onChange={handleChange('cuisine')}
            fullWidth
          />

          <TextField
            label="Rating"
            type="number"
            inputProps={{ min: 0, max: 5, step: 0.1 }}
            value={form.rating}
            onChange={handleChange('rating')}
            fullWidth
          />

          <TextField
            label="Difficulty"
            value={form.difficulty}
            onChange={handleChange('difficulty')}
            fullWidth
          />

          <TextField
            label="Prep time (min)"
            type="number"
            inputProps={{ min: 0 }}
            value={form.prepTimeMinutes}
            onChange={handleChange('prepTimeMinutes')}
            fullWidth
          />

          <TextField
            label="Ingredients (comma or ; separated)"
            value={form.ingredients.join(', ')}
            onChange={handleIngredientsChange}
            onKeyDown={preventEnter}
            fullWidth
          />

          <TextField
            label="Instructions (comma or ; separated)"
            value={form.instructions.join(', ')}
            onChange={handleInstructionsChange}
            onKeyDown={preventEnter}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        {mode === 'edit' && onDelete && (
          <Button color="error" onClick={handleDeleteClick}>
            Delete
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {mode === 'create' ? 'Create' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MyRecipeModal;
