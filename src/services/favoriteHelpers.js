const getFavoriteRecipe = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];

localStorage.setItem('favoriteRecipes', JSON.stringify(getFavoriteRecipe));

const readFavoriteRecipe = () => JSON.parse(localStorage.getItem('favoriteRecipes'));

const writeFavoriteRecipe = (favoriteRecipes) => localStorage
  .setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));

export const favoritePromise = () => {
  const favoriteStorage = readFavoriteRecipe();
  return favoriteStorage;
};

export const disfavor = (id) => {
  const currentFavoriteRecipes = readFavoriteRecipe();
  const favoriteRecipes = currentFavoriteRecipes.filter(
    (each) => each.id !== id,
  );
  writeFavoriteRecipe(favoriteRecipes);
};
