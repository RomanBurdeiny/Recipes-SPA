import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../../../firebase-config';
import { type AppDispatch } from '../../redux/store';
import { fetchFavoritesForUser } from '../../redux/favorites.slice';

import type { Recipe } from '../../shared/api';
import { useGetRecipesQuery, useGetRecipeTagsQuery } from '../../shared/api';
import type { RootState } from '../../redux/store';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import useToggleFavorite from '../../hooks/useToggleFavorite';

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

  const favoriteIds = useSelector((s: RootState) => s.favorites.ids);
  const dispatch = useDispatch<AppDispatch>();
  const { toggleFavorite } = useToggleFavorite();
  const uid = auth.currentUser?.uid ?? null;

  useEffect(() => {
    if (uid) {
      dispatch(fetchFavoritesForUser(uid));
    }
  }, [uid, dispatch]);

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
    limit: 10,
    skip: page * 10,
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
      const map = new Map<number, Recipe>();
      [...prev, ...data.recipes].forEach(r => map.set(r.id, r));
      return Array.from(map.values());
    });
  }, [data, page]);

  const hasMore = items.length < total;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSortChange = (e: SelectChangeEvent<UiSort>) => {
    setSort(e.target.value as UiSort);
  };

  const handleFilterChange =
    (key: 'mealType' | 'cuisine' | 'tag') => (e: SelectChangeEvent<string>) =>
      setFilters(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 1280,
        mx: 'auto',
        width: '100%',
      }}
    >
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
            <Grid key={recipe.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <RecipeCard
                recipe={recipe}
                isFavorite={favoriteIds.includes(recipe.id)}
                onToggleFavorite={() => toggleFavorite(recipe.id)}
              />
            </Grid>
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
