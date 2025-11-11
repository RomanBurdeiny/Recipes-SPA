export interface Recipe {
  id: number;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  caloriesPerServing: number;
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
