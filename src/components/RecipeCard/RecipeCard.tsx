import { Card, CardMedia, CardContent, IconButton, Box, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { RecipeCardProps } from './RecipeCardProps';

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite = false,
  onToggleFavorite,
  onEdit,
  onDelete,
}) => {
  const imageSrc = (recipe as { image?: string }).image ?? '/placeholder.jpg';

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        height: 320,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: onEdit ? 'pointer' : 'default',
      }}
      onClick={onEdit || undefined}
    >
      <CardMedia
        component="img"
        height={160}
        image={imageSrc}
        alt={recipe.name}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <Typography variant="h6" noWrap title={recipe.name}>
          {recipe.name}
        </Typography>

        <Box mt="auto" display="flex" justifyContent="space-between" alignItems="center">
          {onEdit || onDelete ? (
            <Box>
              {onEdit && (
                <IconButton
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
              {onDelete && (
                <IconButton
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ) : (
            <span />
          )}

          {onToggleFavorite && (
            <IconButton
              aria-label="favorite"
              onClick={e => {
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
