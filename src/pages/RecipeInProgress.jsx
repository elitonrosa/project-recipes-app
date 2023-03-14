import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Buttons from '../components/Buttons';
import Inputs from '../components/Inputs';
import useFetch from '../hooks/useFetch';
import { getDrinkByID, getMealByID } from '../services/fetchFunctions';
import {
  getFromLocalStorage,
  setDoneRecipeInLocalStorage,
  setInProgressToLocalStorage,
} from '../services/localStorageHelpers';
import '../styles/pages/RecipeInProgress.sass';

import {
  DRINK,
  ERROR_MESSAGE,
  FINISH_RECIPE_BTN,
  INSTRUCTIONS,
  MEAL,
  MEALS,
  IN_PROGRESS_RECIPES,
} from '../services/constTypes';
import HeaderRecipes from '../components/HeaderRecipes';
import ClipboardModal from '../components/ClipboardModal';

function RecipeInProgress() {
  const [, pathname, id] = useLocation().pathname.split('/');
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
    data,
    isLoading,
    error,
  } = useFetch(pathname === MEALS ? getMealByID : getDrinkByID, id);

  const [isURLCopied, setIsURLCopied] = useState(false);
  const [completed, setCompleted] = useState({});
  const [disableButton, setDisableButton] = useState(true);

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

  return (
    <div className="progressPage">
      {isLoading ? (
        <div className="loading-div">
          <span className="loader" />
        </div>
      ) : (
        <div className="progressContainer">
          {error ? (
            <p data-testid={ ERROR_MESSAGE }>Erro</p>
          ) : (
            <>
              <HeaderRecipes { ...data } setIsURLCopied={ setIsURLCopied } />
              {isURLCopied && (
                <ClipboardModal />
              )}
              <div className="instructionsContainer">
                <h2>Instructions</h2>
                <p
                  data-testid={ INSTRUCTIONS }
                  className="instructions"
                >
                  {instructions}
                </p>
              </div>
              <div className="ingredientsContainer">
                <h2>Ingredients</h2>
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
