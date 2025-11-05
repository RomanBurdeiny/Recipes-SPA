// import { useState } from 'react'
// import { Box, Grid, Typography, TextField, Select, MenuItem, Card, CardMedia, CardContent, Button, CircularProgress } from '@mui/material'
// import type { RecipesPageProps } from './RecipesPageType'

// interface Recipe {
//   id: number
//   name: string
//   image: string
//   cuisine: string
//   rating: number
//   caloriesPerServing: number
// }

// const mockRecipes: Recipe[] = [
//   {
//     id: 1,
//     name: 'Spaghetti Carbonara',
//     image: 'https://dummyjson.com/image/i/products/1/1.jpg',
//     cuisine: 'Italian',
//     rating: 4.7,
//     caloriesPerServing: 520,
//   },
//   {
//     id: 2,
//     name: 'Chicken Curry',
//     image: 'https://dummyjson.com/image/i/products/2/1.jpg',
//     cuisine: 'Indian',
//     rating: 4.5,
//     caloriesPerServing: 610,
//   },
// ]

// const RecipesPage: RecipesPageProps = () => {
//   const [query, setQuery] = useState('')
//   const [sort, setSort] = useState<'rating' | 'calories'>('rating')
//   const [loading, ] = useState(false)

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setQuery(e.target.value)
//   }

//   const handleSortChange = (e) => {
//     setSort(e.target.value)
//   }

//   const sortedRecipes = [...mockRecipes].sort((a, b) =>
//     sort === 'rating' ? b.rating - a.rating : a.caloriesPerServing - b.caloriesPerServing
//   )

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" fontWeight={600} mb={3}>
//         Recipes
//       </Typography>

//       <Box display="flex" gap={2} mb={4}>
//         <TextField
//           variant="outlined"
//           label="Search recipes..."
//           value={query}
//           onChange={handleSearchChange}
//           sx={{ flex: 1 }}
//         />
//         <Select value={sort} onChange={handleSortChange}>
//           <MenuItem value="rating">By rating</MenuItem>
//           <MenuItem value="calories">By calories</MenuItem>
//         </Select>
//       </Box>

//       {loading ? (
//         <Box display="flex" justifyContent="center" mt={5}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Grid container spacing={3}>
//           {sortedRecipes.map((recipe) => (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
//               <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
//                 <CardMedia
//                   component="img"
//                   height="180"
//                   image={recipe.image}
//                   alt={recipe.name}
//                 />
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     {recipe.name}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {recipe.cuisine} • {recipe.caloriesPerServing} kcal
//                   </Typography>
//                   <Typography variant="body2" color="primary" mt={1}>
//                     Rating: {recipe.rating}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* Load more */}
//       <Box textAlign="center" mt={5}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => console.log('Load more')}
//           sx={{ borderRadius: 3, px: 5 }}
//         >
//           Load more
//         </Button>
//       </Box>
//     </Box>
//   )
// }

// export default RecipesPage
