import { configureStore } from '@reduxjs/toolkit';
import { recipesApi } from '../shared/api';
import favoritesReducer from '../redux/favorites.slice';
import authReducer from './auth.slice';
import myRecipesReducer from './myRecipes.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    myRecipes: myRecipesReducer,
    [recipesApi.reducerPath]: recipesApi.reducer,
  },
  middleware: getDefault => getDefault().concat(recipesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
