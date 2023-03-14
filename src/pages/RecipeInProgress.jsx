import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Buttons from '../components/Buttons';
import Inputs from '../components/Inputs';
import useFetch from '../hooks/useFetch';
import { getDrinkByID, getMealByID } from '../services/fetchFunctions';
import {
  getFromLocalStorage,
  manageFavoritesInLocalStorage,
  setDoneRecipeInLocalStorage,
  setInProgressToLocalStorage,
} from '../services/localStorageHelpers';
import shareIcon from '../images/shareIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import '../styles/pages/RecipeInProgress.sass';
import leftArrow from '../assets/svg/arrowLeft.svg';

import {
  DRINK,
  ERROR_MESSAGE,
  FAVORITE_BTN,
  FAVORITE_RECIPES,
  FINISH_RECIPE_BTN,
  INSTRUCTIONS,
  MEAL,
  MEALS,
  RECIPE_CATEGORY,
  RECIPE_PHOTO,
  RECIPE_TITLE,
  SHARE_BTN,
  IN_PROGRESS_RECIPES,
  TWO_THOUSAND,
} from '../services/constTypes';

function RecipeInProgress() {
  const [, pathname, id, pageStatus] = useLocation().pathname.split('/');
  const history = useHistory();
  const {
    data: {
      image,
      title,
      category,
      alcoholic,
      ingredients,
      measures,
      instructions,
      strArea,
      strTags,
    },
    isLoading,
    error,
  } = useFetch(pathname === MEALS ? getMealByID : getDrinkByID, id);

  const [recipeFavorite, setRecipeFavorite] = useState(false);
  const [isURLCopied, setIsURLCopied] = useState(false);
  const [completed, setCompleted] = useState({});
  const [disableButton, setDisableButton] = useState(true);

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

  const isRecipeInProgress = !!getFromLocalStorage(IN_PROGRESS_RECIPES)[pathname]
    && !!getFromLocalStorage(IN_PROGRESS_RECIPES)[pathname][id];

  useEffect(() => {
    if (isRecipeInProgress) {
      setCompleted(getFromLocalStorage(IN_PROGRESS_RECIPES)[pathname][id]);
    }
  }, [isRecipeInProgress, id, pathname]);

  const onChange = ({ target: { name, checked } }) => {
    setCompleted((prevState) => ({ ...prevState, [name]: checked }));
  };

  useEffect(() => {
    setInProgressToLocalStorage(completed, pathname, id);
  }, [completed, id, pathname]);

  const isAllChecked = Object.values(completed).every((value) => value)
    && ingredients
    && Object.keys(completed).length === ingredients.length;

  useEffect(() => {
    if (isAllChecked) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [isAllChecked, completed]);

  const urlToClipboard = () => {
    navigator.clipboard.writeText(
      String(window.location.href).replace(`/${pageStatus}`, ''),
    );
    setIsURLCopied(true);
    setTimeout(() => {
      setIsURLCopied(false);
    }, TWO_THOUSAND);
  };

  const onClickFinish = () => {
    setDoneRecipeInLocalStorage({
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
      tags: strTags === 'null' ? [] : strTags.split(','),
      doneDate: new Date(),
    });
    history.push('/done-recipes');
  };
  const goBackPage = () => history.goBack();

  return (
    <div className="progressPage">
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div className="progressContainer">
          {error ? (
            <p data-testid={ ERROR_MESSAGE }>Erro</p>
          ) : (
            <>
              <div className="topPage">
                <img
                  src={ image }
                  alt="Imagem da Receita"
                  width="200"
                  data-testid={ RECIPE_PHOTO }
                  className="recipeImage"
                />
                <h1
                  data-testid={ RECIPE_TITLE }
                  className="recipeTitle"
                >
                  {title}
                </h1>
                <p
                  data-testid={ RECIPE_CATEGORY }
                  className="recipeCategory"
                >
                  {category}
                  {' '}
                  {alcoholic}
                </p>
                <div className="btnContainer">
                  <Buttons
                    type="button"
                    icon={ leftArrow }
                    onClick={ goBackPage }
                    labelText="Back"
                  />
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
              <div className="instructionsContainer">
                <p>Instructions</p>
                <p
                  data-testid={ INSTRUCTIONS }
                  className="instructions"
                >
                  {instructions}
                </p>
              </div>
              <div className="ingredientsContainer">
                <p>Ingredients</p>
                <ul data-testid="ingredients-ul" className="ingredients">
                  {ingredients.map((ingredient, index) => (
                    <li
                      key={ ingredient }
                      data-testid={ `${index}-ingredient-step` }
                      className={ completed[ingredient] ? 'risco' : undefined }
                    >
                      <Inputs
                        type="checkbox"
                        labelText={ `${ingredient} - ${measures[index]}` }
                        onChange={ onChange }
                        checked={ completed[ingredient] }
                        dataTestid={ `${index}-ingredient-checkbox` }
                        name={ ingredient }
                      />
                    </li>
                  ))}
                </ul>
              </div>
              {isURLCopied && (
                <div>
                  <p>Link copied!</p>
                </div>
              )}
              <div className="finishRecipe">
                <Buttons
                  type="button"
                  dataTestid={ FINISH_RECIPE_BTN }
                  labelText="Finish Recipe"
                  isDisabled={ disableButton }
                  name="Finish Recipe"
                  btnClass="btnRecipe"
                  onClick={ onClickFinish }
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default RecipeInProgress;
