import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Buttons from '../components/Buttons';
import Carousel from '../components/Carousel';
import HeaderRecipes from '../components/HeaderRecipes';

import useFetch from '../hooks/useFetch';
import { getDrinkByID, getMealByID } from '../services/fetchFunctions';
import { getFromLocalStorage } from '../services/localStorageHelpers';

import styles from '../styles/pages/RecipeDetails.module.sass';

import {
  DONE_RECIPES,
  ERROR_MESSAGE,
  INSTRUCTIONS,
  IN_PROGRESS_RECIPES,
  MEALS,
  START_RECIPE_BTN,
  VIDEO,
} from '../services/constTypes';

function RecipeDetails() {
  const [isURLCopied, setIsURLCopied] = useState(false);

  const [, pathname, id] = useLocation().pathname.split('/');

  const {
    data: { video, ingredients, measures, instructions },
    data,
    isLoading,
    error,
  } = useFetch(pathname === MEALS ? getMealByID : getDrinkByID, id);

  const showButton = getFromLocalStorage(DONE_RECIPES).some(
    (key) => key.id === id,
  );

  const isRecipeInProgress = !!getFromLocalStorage(IN_PROGRESS_RECIPES)[pathname]
    && !!getFromLocalStorage(IN_PROGRESS_RECIPES)[pathname][id];

  return isLoading ? (
    <div className={ styles.loadingDiv }>
      <span className="loader" />
    </div>
  ) : (
    <div>
      {error ? (
        <p data-testid={ ERROR_MESSAGE }>Erro</p>
      ) : (
        <div className={ styles.mainContainer }>
          <HeaderRecipes { ...data } setIsURLCopied={ setIsURLCopied } />
          <div className={ styles.ingredientsContainer }>
            <h2>Ingredients</h2>
            <ul data-testid="ingredients-ul">
              {ingredients.map((ingredient, index) => (
                <li
                  key={ ingredient }
                  data-testid={ `${index}-ingredient-name-and-measure` }
                >
                  {`${ingredient} - ${measures[index]}`}
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
