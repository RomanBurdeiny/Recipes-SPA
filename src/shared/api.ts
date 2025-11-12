import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Recipe {
  id: number;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  caloriesPerServing: number;
  difficulty?: string;
  prepTimeMinutes?: number;
  mealType?: string[];
  tags?: string[];
}

export interface RecipesResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}

export type SortKey = 'name' | 'rating' | 'difficulty' | 'prepTimeMinutes';
export type SortOrder = 'asc' | 'desc';

export type RecipesQuery = {
  limit?: number;
  skip?: number;
  sortBy?: SortKey;
  order?: SortOrder;
  select?: string;
  mealType?: string;
  tag?: string;
  cuisine?: string;

  q?: string;
};

const qs = (obj: Record<string, unknown>) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== '' && v !== null)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');

export const recipesApi = createApi({
  reducerPath: 'recipesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),
  tagTypes: ['Recipes', 'Recipe', 'Tags'],
  endpoints: build => ({
    getRecipes: build.query<RecipesResponse, RecipesQuery | void>({
      query: args => {
        const p = {
          limit: args?.limit ?? 10,
          skip: args?.skip ?? 0,
          sortBy: args?.sortBy,
          order: args?.order,
          select:
            args?.select ??
            'id,name,image,cuisine,rating,caloriesPerServing,prepTimeMinutes,difficulty,mealType,tags',
        };

        let basePath = '/recipes';
        if (args?.mealType) basePath = `/recipes/meal-type/${encodeURIComponent(args.mealType)}`;
        else if (args?.tag) basePath = `/recipes/tag/${encodeURIComponent(args.tag)}`;
        else if (args?.cuisine) basePath = `/recipes/cuisine/${encodeURIComponent(args.cuisine)}`;
        else if (args?.q) basePath = `/recipes/search?q=${encodeURIComponent(args.q)}`;

        const query = qs(p);
        return `${basePath}${basePath.includes('?') ? (query ? `&${query}` : '') : query ? `?${query}` : ''}`;
      },
      providesTags: res =>
        res
          ? [
              ...res.recipes.map(r => ({ type: 'Recipe' as const, id: r.id })),
              { type: 'Recipes' as const, id: 'LIST' },
            ]
          : [{ type: 'Recipes' as const, id: 'LIST' }],
    }),

    getRecipeTags: build.query<string[], void>({
      query: () => '/recipes/tags',
      providesTags: [{ type: 'Tags', id: 'LIST' }],
    }),
  }),
});

export const { useGetRecipesQuery, useGetRecipeTagsQuery } = recipesApi;
