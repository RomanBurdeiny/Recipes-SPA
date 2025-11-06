import { useState, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import type { Recipe } from '../../shared/types';
import { useGetRecipesQuery } from '../../shared/api';

const RecipesPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'rating' | 'calories'>('rating');

  const { data, isLoading, isError } = useGetRecipesQuery();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSortChange = (e: SelectChangeEvent<'rating' | 'calories'>) => {
    setSort(e.target.value as 'rating' | 'calories');
  };

  const recipes: Recipe[] = data?.recipes ?? [];

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(query.toLowerCase())
  );

  const sortedRecipes = [...filteredRecipes].sort((a, b) =>
    sort === 'rating' ? b.rating - a.rating : a.caloriesPerServing - b.caloriesPerServing
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Recipes
      </Typography>

      {/* Search & Sort */}
      <Box display="flex" gap={2} mb={4}>
        <TextField
          variant="outlined"
          label="Search recipes..."
          value={query}
          onChange={handleSearchChange}
          sx={{ flex: 1 }}
        />

        <Select value={sort} onChange={handleSortChange}>
          <MenuItem value="rating">By rating</MenuItem>
          <MenuItem value="calories">By calories</MenuItem>
        </Select>
      </Box>

      {/* Loading / Error / Content */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Typography color="error" textAlign="center">
          Error loading recipes
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {sortedRecipes.map(recipe => (
            <Card
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardMedia component="img" height="180" image={recipe.image} alt={recipe.name} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {recipe.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {recipe.cuisine} • {recipe.caloriesPerServing} kcal
                </Typography>
                <Typography variant="body2" color="primary" mt={1}>
                  Rating: {recipe.rating}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
      )}

      {/* Load more */}
      <Box textAlign="center" mt={5}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log('Load more')}
          sx={{ borderRadius: 3, px: 5 }}
        >
          Load more
        </Button>
      </Box>
    </Box>
  );
};

export default RecipesPage;
