import { configureStore } from '@reduxjs/toolkit';
import { recipesApi } from '../shared/api';

export const store = configureStore({
  reducer: {
    [recipesApi.reducerPath]: recipesApi.reducer,
    // сюда же потом добавишь authReducer, favouritesReducer и т.д.
  },
  middleware: getDefault => getDefault().concat(recipesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
