import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Buttons from '../components/Buttons';
import Carousel from '../components/Carousel';

import useFetch from '../hooks/useFetch';
import { getDrinkByID, getMealByID } from '../services/fetchFunctions';
import {
  getFromLocalStorage,
  manageFavoritesInLocalStorage,
} from '../services/localStorageHelpers';

import shareIcon from '../images/shareIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import allMeals from '../assets/svg/Meals/allIcon.svg';
import allDrinks from '../assets/svg/Drinks/allIconDrinks.svg';

import styles from '../styles/pages/RecipeDetails.module.sass';

import {
  DONE_RECIPES,
  DRINK,
  ERROR_MESSAGE,
  FAVORITE_BTN,
  FAVORITE_RECIPES,
  INSTRUCTIONS,
  IN_PROGRESS_RECIPES,
  MEAL,
  MEALS,
  RECIPE_CATEGORY,
  RECIPE_PHOTO,
  RECIPE_TITLE,
  SHARE_BTN,
  START_RECIPE_BTN,
  TWO_THOUSAND,
  VIDEO,
} from '../services/constTypes';

function RecipeDetails() {
  const [isURLCopied, setIsURLCopied] = useState(false);
  const [recipeFavorite, setRecipeFavorite] = useState(false);

  const [, pathname, id] = useLocation().pathname.split('/');

  const {
    data: {
      image,
      title,
      category,
      alcoholic,
      video,
      ingredients,
      measures,
      instructions,
      strArea,
    },
    isLoading,
    error,
  } = useFetch(pathname === MEALS ? getMealByID : getDrinkByID, id);

  const showButton = getFromLocalStorage(DONE_RECIPES).some(
    (key) => key.id === id,
  );

  const isRecipeInProgress = !!getFromLocalStorage(IN_PROGRESS_RECIPES)[pathname]
    && !!getFromLocalStorage(IN_PROGRESS_RECIPES)[pathname][id];

  const isFavorite = useCallback(
    () => getFromLocalStorage(FAVORITE_RECIPES).some((recipe) => recipe.id === id),
    [id],
  );

  useEffect(() => {
    setRecipeFavorite(isFavorite);
  }, [isFavorite]);

  const favoriteRecipe = () => {
    manageFavoritesInLocalStorage(FAVORITE_RECIPES, {
      id,
      type:
        pathname === MEALS
          ? MEAL.toLocaleLowerCase()
          : DRINK.toLocaleLowerCase(),
      nationality: strArea || '',
      category,
      alcoholicOrNot: alcoholic || '',
      name: title,
      image,
    });
    setRecipeFavorite(isFavorite);
  };

  const urlToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsURLCopied(true);
    setTimeout(() => {
      setIsURLCopied(false);
    }, TWO_THOUSAND);
  };

  return isLoading ? (
    <p>Carregando...</p>
  ) : (
    <div>
      {error ? (
        <p data-testid={ ERROR_MESSAGE }>Erro</p>
      ) : (
        <div className={ styles.mainContainer }>
          <div className={ styles.headerContainer }>
            <img
              className={ styles.recipeImage }
              src={ image }
              alt="Imagem da Receita"
              width="200"
              data-testid={ RECIPE_PHOTO }
            />
            <div className={ styles.headerContent }>
              <div>
                <img
                  className="categoryIcon"
                  src={ pathname === MEALS ? allMeals : allDrinks }
                  alt="category icon"
                />
                <p data-testid={ RECIPE_CATEGORY }>
                  {category}
                  {' '}
                  {alcoholic}
                </p>
              </div>
              <div>
                <Buttons
                  type="button"
                  dataTestid={ SHARE_BTN }
                  icon={ shareIcon }
                  onClick={ urlToClipboard }
                />
                <Buttons
                  type="button"
                  dataTestid={ FAVORITE_BTN }
                  icon={ recipeFavorite ? blackHeartIcon : whiteHeartIcon }
                  onClick={ favoriteRecipe }
                />
              </div>
            </div>
            <h1 data-testid={ RECIPE_TITLE }>{title}</h1>
          </div>
          <div className={ styles.ingredientsContainer }>
            <h2>Ingredients</h2>
            <ul data-testid="ingredients-ul">
              {ingredients.map((ingredient, index) => (
                <li
                  key={ ingredient }
                  data-testid={ `${index}-ingredient-name-and-measure` }
                >
                  { `${ingredient} - ${measures[index]}` }
                </li>
              ))}
            </ul>
          </div>
          <div className={ styles.instructionsContainer }>
            <h2>Instructions</h2>
            <p data-testid={ INSTRUCTIONS }>{instructions}</p>
          </div>
          {video && (
            <div className={ styles.videoContainer }>
              <h2>Video</h2>
              <iframe data-testid={ VIDEO } title="Youtube Video" src={ video } />
            </div>
          )}
          {isURLCopied && (
            <div>
              <p>Link copied!</p>
            </div>
          )}
          <div>
            <Carousel pathname={ pathname } />
          </div>
          {!showButton && (
            <Link to={ `/${pathname}/${id}/in-progress` }>
              <Buttons
                type="button"
                labelText={
                  isRecipeInProgress ? 'Continue Recipe' : 'Start Recipe'
                }
                dataTestid={ START_RECIPE_BTN }
                btnClass={ styles.btnRecipe }
              />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default RecipeDetails;
