import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import '../styles/components/Favorite.sass';
import Buttons from './Buttons';
import ClipboardModal from './ClipboardModal';
import { TWO_THOUSAND } from '../services/constTypes';

function FavoriteDrink({ recipe, index, onClick }) {
  const [isURLCopied, setIsURLCopied] = useState(false);

  const { pathname } = useLocation();
  const [http, baseURL] = String(window.location.href).split('//');

  const shareRecipe = () => {
    navigator.clipboard.writeText(
      `${http}//${baseURL.replaceAll(
        pathname,
        '',
      )}/${recipe.type.toLowerCase()}s/${recipe.id}`,
    );
    setIsURLCopied(true);
    setTimeout(() => {
      setIsURLCopied(false);
    }, TWO_THOUSAND);
  };

  return (
    <div className="favoriteRecipeContainer">
      <Link
        to={ `drinks/${recipe.id}` }
        style={ { textDecoration: 'none' } }
        className="favorite-link"
      >
        <img
          alt={ recipe.name }
          src={ recipe.image }
          data-testid={ `${index}-horizontal-image` }
          className="favorite-img"
        />

      </Link>

      <div className="favoriteRecipe">

        <div>
          <Link
            to={ `drinks/${recipe.id}` }
            style={ { textDecoration: 'none' } }
            className="favorite-link"
          >
            <p
              data-testid={ `${index}-horizontal-name` }
              className="favorite-name"
            >
              { recipe.name }
            </p>
          </Link>

          <span
            data-testid={ `${index}-horizontal-top-text` }
            className="favorite-category"
          >
            {recipe.alcoholicOrNot}
          </span>
        </div>

        <div className="favoriteBtnContainer">
          <Buttons
            dataTestid={ `${index}-horizontal-share-btn` }
            onClick={ shareRecipe }
            icon={ shareIcon }
          />

          <Buttons
            dataTestid={ `${index}-horizontal-favorite-btn` }
            onClick={ () => onClick(recipe.id) }
            icon={ blackHeartIcon }
          />

        </div>
      </div>
      {isURLCopied && (
        <ClipboardModal />
      )}
    </div>
  );
}

FavoriteDrink.propTypes = {
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  recipe: PropTypes.shape({
    alcoholicOrNot: PropTypes.string,
    category: PropTypes.string,
    id: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    nationality: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
};

export default FavoriteDrink;
