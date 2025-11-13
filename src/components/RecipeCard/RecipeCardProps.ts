import type { Recipe } from '../../shared/api';
import type { UserRecipe } from '../../shared/types';

export type AnyRecipe = Recipe | UserRecipe;

export interface RecipeCardProps {
  recipe: AnyRecipe;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;

  onEdit?: () => void;
  onDelete?: () => void;
}
