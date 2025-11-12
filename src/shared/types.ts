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
