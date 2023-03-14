import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  DRINK,
  FAVORITE_BTN,
  FAVORITE_RECIPES,
  MEAL,
  MEALS,
  RECIPE_CATEGORY,
  RECIPE_PHOTO,
  RECIPE_TITLE,
  SHARE_BTN,
  TWO_THOUSAND,
} from '../services/constTypes';

import shareIcon from '../images/shareIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import backIcon from '../assets/svg/arrowLeft.svg';

import styles from '../styles/components/HeaderRecipes.module.sass';

import Buttons from './Buttons';
import {
  getFromLocalStorage,
  manageFavoritesInLocalStorage,
} from '../services/localStorageHelpers';

function HeaderRecipes({ image, title, category, alcoholic, strArea, setIsURLCopied }) {
  const [recipeFavorite, setRecipeFavorite] = useState(false);

  const [, pathname, id] = useLocation().pathname.split('/');

  const history = useHistory();

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

  const goBackPage = () => history.goBack();

  return (
    <div className={ styles.headerContainer }>
      <img
        className={ styles.recipeImage }
        src={ image }
        alt="Imagem da Receita"
        width="200"
        data-testid={ RECIPE_PHOTO }
      />
      <div className={ styles.headerContent }>
        <div className={ styles.goBackWrapper }>
          <button
            type="button"
            onClick={ goBackPage }
            className={ styles.goBackButton }
          >
            <img
              className="categoryIcon"
              src={ backIcon }
              alt="category icon"
            />
            <p className={ styles.backBtnText }>Back</p>
          </button>
          <p data-testid={ RECIPE_CATEGORY } style={ { display: 'none' } }>
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
  );
}

HeaderRecipes.propTypes = {
  alcoholic: PropTypes.string,
  category: PropTypes.string,
  image: PropTypes.string,
  strArea: PropTypes.string,
  title: PropTypes.string,
}.isRequired;

export default HeaderRecipes;
