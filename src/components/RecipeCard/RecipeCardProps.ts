import type { Recipe } from '../../shared/types';
import type { UserRecipe } from '../../shared/types';

export type AnyRecipe = Recipe | UserRecipe;

export interface RecipeCardProps {
  recipe: AnyRecipe;
  isFavorite?: boolean;
  onToggleFavorite: () => void;
  onOpen?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}
