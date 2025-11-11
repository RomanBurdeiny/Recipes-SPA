import { configureStore } from '@reduxjs/toolkit';
import { recipesApi } from '../shared/api';
import authReducer from './auth.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [recipesApi.reducerPath]: recipesApi.reducer,
  },
  middleware: getDefault => getDefault().concat(recipesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
