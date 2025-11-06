import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RecipesResponse } from '../shared/types';

export const recipesApi = createApi({
  reducerPath: 'recipesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com',
  }),
  tagTypes: ['Recipes'],
  endpoints: build => ({
    getRecipes: build.query<RecipesResponse, void>({
      query: () => '/recipes',
      providesTags: ['Recipes'],
    }),
  }),
});
export const { useGetRecipesQuery } = recipesApi;
