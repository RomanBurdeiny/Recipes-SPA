import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { ref, get, set, remove } from 'firebase/database';
import { db } from '../../firebase-config';
import type { RootState } from './store';
import type { UserRecipe, UserRecipeInput } from '../shared/types';

interface MyRecipesState {
  items: UserRecipe[];
  loading: boolean;
  error: string | null;
}

const initialState: MyRecipesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchMyRecipesForUser = createAsyncThunk<UserRecipe[], string>(
  'myRecipes/fetchForUser',
  async uid => {
    const snap = await get(ref(db, `users/${uid}/recipes`));
    if (!snap.exists()) return [];
    const data = snap.val() as Record<string, UserRecipe>;
    return Object.entries(data).map(([id, value]) => ({
      ...value,
      id: Number(id),
    }));
  }
);

export const createMyRecipeForUser = createAsyncThunk<
  UserRecipe,
  { uid: string; recipe: UserRecipeInput }
>('myRecipes/createForUser', async ({ uid, recipe }) => {
  const id = Date.now();
  const recipeWithId: UserRecipe = { id, ...recipe };

  await set(ref(db, `users/${uid}/recipes/${id}`), recipeWithId);

  return recipeWithId;
});

export const deleteMyRecipeForUser = createAsyncThunk<number, { uid: string; recipeId: number }>(
  'myRecipes/deleteForUser',
  async ({ uid, recipeId }) => {
    await remove(ref(db, `users/${uid}/recipes/${recipeId}`));
    return recipeId;
  }
);

export const updateMyRecipeForUser = createAsyncThunk<
  UserRecipe,
  { uid: string; recipe: UserRecipe }
>('myRecipes/updateForUser', async ({ uid, recipe }) => {
  await set(ref(db, `users/${uid}/recipes/${recipe.id}`), recipe);
  return recipe;
});

const myRecipesSlice = createSlice({
  name: 'myRecipes',
  initialState,
  reducers: {
    clearMyRecipes(state) {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMyRecipesForUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRecipesForUser.fulfilled, (state, action: PayloadAction<UserRecipe[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyRecipesForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load my recipes';
      })

      .addCase(createMyRecipeForUser.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(updateMyRecipeForUser.fulfilled, (state, action: PayloadAction<UserRecipe>) => {
        const updated = action.payload;
        const idx = state.items.findIndex(r => r.id === updated.id);
        if (idx !== -1) {
          state.items[idx] = updated;
        }
      })

      .addCase(deleteMyRecipeForUser.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter(r => r.id !== id);
      });
  },
});

export const { clearMyRecipes } = myRecipesSlice.actions;
export default myRecipesSlice.reducer;

export const selectMyRecipes = (state: RootState) => state.myRecipes.items;
