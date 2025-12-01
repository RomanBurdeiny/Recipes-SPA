export interface Recipe {
  id: number;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  caloriesPerServing: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  tags: string[];
  userId: number;
  reviewCount: number;
  mealType: string[];
  ingredients?: string[];
  instructions?: string[];
}

export interface RecipesResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
}

export interface RecipesResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}

export interface UserRecipe {
  id: number;
  name: string;
  image?: string;
  mealType?: string;
  cuisine?: string;
  prepTimeMinutes?: number;
  caloriesPerServing?: number;
  description?: string;
  rating: number;
  difficulty?: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
}
export type UserRecipeInput = Omit<UserRecipe, 'id'>;
