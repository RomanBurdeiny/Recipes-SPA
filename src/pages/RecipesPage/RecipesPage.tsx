import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

import type { Recipe } from '../../shared/api';
import { useGetRecipesQuery, useGetRecipeTagsQuery } from '../../shared/api';

const PAGE_SIZE = 10;

type UiSort = 'rating' | 'difficulty' | 'time' | 'alphabet';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const CUISINES = ['Italian', 'Indian', 'American', 'Mexican', 'French', 'Chinese'];

const RecipesPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<UiSort>('rating');
  const [filters, setFilters] = useState({ mealType: '', cuisine: '', tag: '' });

  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Recipe[]>([]);
  const [total, setTotal] = useState(0);

  const sortBy = useMemo(() => {
    switch (sort) {
      case 'rating':
        return 'rating' as const;
      case 'difficulty':
        return 'difficulty' as const;
      case 'time':
        return 'prepTimeMinutes' as const;
      case 'alphabet':
        return 'name' as const;
      default:
        return 'rating' as const;
    }
  }, [sort]);

  const order = sort === 'rating' ? 'desc' : 'asc';

  const canUseServerSearch = !filters.mealType && !filters.cuisine && !filters.tag && query.trim();

  const { data, isLoading, isFetching, isError } = useGetRecipesQuery({
    limit: PAGE_SIZE,
    skip: page * PAGE_SIZE,
    sortBy,
    order,
    mealType: filters.mealType || undefined,
    cuisine: filters.cuisine || undefined,
    tag: filters.tag || undefined,
    q: canUseServerSearch ? query.trim() : undefined,
  });

  const { data: allTags = [] } = useGetRecipeTagsQuery();

  useEffect(() => {
    setPage(0);
    setItems([]);
    setTotal(0);
  }, [query, sort, filters.mealType, filters.cuisine, filters.tag]);

  useEffect(() => {
    if (!data) return;
    setTotal(data.total);
    setItems(prev => {
      if (page === 0) return data.recipes;
      // аккум + уникальность по id
      const map = new Map<number, Recipe>();
      [...prev, ...data.recipes].forEach(r => map.set(r.id, r));
      return Array.from(map.values());
    });
  }, [data, page]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSortChange = (e: SelectChangeEvent<UiSort>) => {
    setSort(e.target.value as UiSort);
  };

  const handleFilterChange =
    (key: 'mealType' | 'cuisine' | 'tag') => (e: SelectChangeEvent<string>) =>
      setFilters(prev => ({ ...prev, [key]: e.target.value }));

  const hasMore = items.length < total;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Recipes
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
        <TextField
          variant="outlined"
          label="Search recipes..."
          value={query}
          onChange={handleSearchChange}
          sx={{ flex: 1, minWidth: 220 }}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sort} label="Sort by" onChange={handleSortChange}>
            <MenuItem value="rating">Rating (desc)</MenuItem>
            <MenuItem value="difficulty">Difficulty (asc)</MenuItem>
            <MenuItem value="time">Prep time (asc)</MenuItem>
            <MenuItem value="alphabet">Alphabet (asc)</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Meal type</InputLabel>
          <Select
            value={filters.mealType}
            label="Meal type"
            onChange={handleFilterChange('mealType')}
          >
            <MenuItem value="">All</MenuItem>
            {MEAL_TYPES.map(m => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Cuisine</InputLabel>
          <Select value={filters.cuisine} label="Cuisine" onChange={handleFilterChange('cuisine')}>
            <MenuItem value="">All</MenuItem>
            {CUISINES.map(c => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Tag</InputLabel>
          <Select value={filters.tag} label="Tag" onChange={handleFilterChange('tag')}>
            <MenuItem value="">All</MenuItem>
            {allTags.slice(0, 40).map(t => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isLoading && items.length === 0 ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Typography color="error" textAlign="center">
          Error loading recipes
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {items.map(recipe => (
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

      <Box textAlign="center" mt={5}>
        {hasMore && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setPage(p => p + 1)}
            disabled={isFetching}
            sx={{ borderRadius: 3, px: 5 }}
          >
            {isFetching ? 'Loading…' : 'Load more'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default RecipesPage;
