export const getFromLocalStorage = (key, isObject = true) => (isObject
  ? JSON.parse(localStorage.getItem(key) ?? '[]')
  : localStorage.getItem(key));

export const manageFavoritesInLocalStorage = (key, value) => {
  const data = JSON.parse(localStorage.getItem(key) ?? '[]');
  if (!data.some((obj) => obj.id === value.id)) {
    localStorage.setItem(key, JSON.stringify([...data, value]));
  } else {
    localStorage.setItem(
      key,
      JSON.stringify(data.filter((recipe) => recipe.id !== value.id)),
    );
  }
};

export const removeFavoriteFromLocalStorage = (key, id) => {
  const data = JSON.parse(localStorage.getItem(key) ?? '[]');
  if (data.some((obj) => obj.id === id)) {
    localStorage.setItem(
      key,
      JSON.stringify(data.filter((recipe) => recipe.id !== id)),
    );
  }
};
