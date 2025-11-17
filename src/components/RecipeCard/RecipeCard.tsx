import {
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Typography,
  Box,
  Stack,
  Chip,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import type { RecipeCardProps } from './RecipeCardProps';

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onToggleFavorite,
  onOpen,
  onEdit,
  onDelete,
}) => {
  const imageSrc = recipe.image || '/placeholder.jpg';

  const handleCardClick = () => {
    onOpen?.();
  };

  const handleFavClick: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    onToggleFavorite();
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        height: 340,
        display: 'flex',
        flexDirection: 'column',
        cursor: onOpen ? 'pointer' : 'default',
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={handleCardClick}
      >
        <Box sx={{ position: 'relative', width: '100%' }}>
          <CardMedia
            component="img"
            height={160}
            image={imageSrc}
            alt={recipe.name}
            sx={{ objectFit: 'cover' }}
          />

          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'white',
            }}
            onClick={handleFavClick}
          >
            {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            pb: 2,
          }}
        >
          <Typography variant="h6" noWrap title={recipe.name}>
            {recipe.name}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <StarIcon sx={{ color: '#ffb400', fontSize: 20 }} />
              <Typography variant="body2">{recipe.rating}</Typography>
            </Stack>

            {recipe.difficulty && (
              <Chip
                label={recipe.difficulty}
                size="small"
                color={
                  recipe.difficulty === 'Easy'
                    ? 'success'
                    : recipe.difficulty === 'Medium'
                      ? 'warning'
                      : 'error'
                }
              />
            )}
          </Stack>

          {(onEdit || onDelete) && (
            <Stack direction="row" spacing={1} mt={1}>
              {onEdit && (
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: 'pointer' }}
                  onClick={e => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  Edit
                </Typography>
              )}
              {onDelete && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ cursor: 'pointer' }}
                  onClick={e => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  Delete
                </Typography>
              )}
            </Stack>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};

export default RecipeCard;
