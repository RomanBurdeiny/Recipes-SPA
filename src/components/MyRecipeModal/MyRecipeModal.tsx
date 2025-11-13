import { useEffect, useState, type ChangeEvent, type FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
} from '@mui/material';
import type { UserRecipe, UserRecipeInput } from '../../shared/types';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const CUISINES = ['Italian', 'Indian', 'American', 'Mexican', 'French', 'Chinese'];

type Mode = 'create' | 'edit';

interface MyRecipeModalProps {
  open: boolean;
  mode: Mode;
  initialRecipe?: UserRecipe | null;
  onClose: () => void;
  onSave: (data: UserRecipeInput, id?: number) => void; // id только для edit
  onDelete?: (id: number) => void;
}

const emptyForm: UserRecipeInput = {
  name: '',
  image: '',
  mealType: '',
  cuisine: '',
  prepTimeMinutes: undefined,
  caloriesPerServing: undefined,
  description: '',
};

const MyRecipeModal: FC<MyRecipeModalProps> = ({
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
      setForm(initialRecipe);
    } else if (mode === 'create') {
      setForm(emptyForm);
    }
  }, [mode, initialRecipe, open]);

  const handleChange = (key: keyof UserRecipeInput) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({
      ...prev,
      [key]:
        key === 'prepTimeMinutes' || key === 'caloriesPerServing'
          ? value === ''
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSave(form, initialRecipe?.id);
  };

  const handleDelete = () => {
    if (mode === 'edit' && initialRecipe && onDelete) {
      onDelete(initialRecipe.id);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'create' ? 'Add new recipe' : 'Edit recipe'}</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Recipe name"
            value={form.name}
            onChange={handleChange('name')}
            fullWidth
            required
          />

          <TextField
            label="Image URL"
            value={form.image ?? ''}
            onChange={handleChange('image')}
            fullWidth
          />

          <TextField
            select
            label="Meal type"
            value={form.mealType ?? ''}
            onChange={handleChange('mealType')}
            fullWidth
          >
            <MenuItem value="">None</MenuItem>
            {MEAL_TYPES.map(m => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Cuisine"
            value={form.cuisine ?? ''}
            onChange={handleChange('cuisine')}
            fullWidth
          >
            <MenuItem value="">None</MenuItem>
            {CUISINES.map(c => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Prep time (min)"
              type="number"
              value={form.prepTimeMinutes ?? ''}
              onChange={handleChange('prepTimeMinutes')}
              fullWidth
            />
            <TextField
              label="Calories per serving"
              type="number"
              value={form.caloriesPerServing ?? ''}
              onChange={handleChange('caloriesPerServing')}
              fullWidth
            />
          </Box>

          <TextField
            label="Description"
            value={form.description ?? ''}
            onChange={handleChange('description')}
            fullWidth
            multiline
            minRows={3}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        {mode === 'edit' && onDelete && (
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {mode === 'create' ? 'Create' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MyRecipeModal;
