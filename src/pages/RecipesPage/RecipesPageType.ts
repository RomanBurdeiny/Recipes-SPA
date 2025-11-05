export interface Recipe {
  id: number;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  caloriesPerServing: number;
}

export interface RecipesPageProps {
  initialQuery?: string;
  onRecipeClick?: (id: number) => void;
}
