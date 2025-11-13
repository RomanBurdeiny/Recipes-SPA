import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { ref, get, set, remove } from 'firebase/database';
import { db } from '../../firebase-config';
import type { RootState } from './store';

interface FavoritesState {
  ids: number[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  ids: [],
  loading: false,
  error: null,
};

export const fetchFavoritesForUser = createAsyncThunk<number[], string>(
  'favorites/fetchForUser',
  async uid => {
    const snap = await get(ref(db, `users/${uid}/favorites`));
    if (!snap.exists()) return [];
    const data = snap.val() as Record<string, true>;
    return Object.keys(data).map(id => Number(id));
  }
);
export const toggleFavoriteForUser = createAsyncThunk<
  number,
  { uid: string; recipeId: number },
  { state: RootState }
>('favorites/toggleForUser', async ({ uid, recipeId }, { getState }) => {
  const state = getState().favorites;
  const isFav = state.ids.includes(recipeId);

  const favRef = ref(db, `users/${uid}/favorites/${recipeId}`);

  if (isFav) {
    await remove(favRef);
  } else {
    await set(favRef, true);
  }

  return recipeId;
});
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites(state) {
      state.ids = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFavoritesForUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoritesForUser.fulfilled, (state, action: PayloadAction<number[]>) => {
        state.loading = false;
        state.ids = action.payload;
      })
      .addCase(fetchFavoritesForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load favorites';
      })

      .addCase(toggleFavoriteForUser.fulfilled, (state, action: PayloadAction<number>) => {
        const id = action.payload;
        state.ids = state.ids.includes(id) ? state.ids.filter(x => x !== id) : [...state.ids, id];
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
