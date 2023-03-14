import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import '../styles/components/Favorite.sass';
import Buttons from './Buttons';

function FavoriteMeal({ recipe, index = 0, onClick }) {
  const [mensage, setMensage] = useState(false);

  const currentType = 'meal';

  const route = currentType.includes(recipe.type.toLowerCase()) ? '/meals' : '/drinks';

  const shareRecipe = () => {
    try {
      navigator.clipboard.writeText(`http://localhost:3000${route}/${recipe.id}`);
    } catch (error) {
      console.error(error);
    }
    setMensage(true);
  };

  return (
    <div className="favoriteRecipeContainer">
      <Link
        to={ `${route}/${recipe.id}` }
        style={ { textDecoration: 'none' } }
        className="favorite-link"
      >
        <img
          alt="foodpicture"
          src={ recipe.image }
          data-testid={ `${index}-horizontal-image` }
          className="favorite-img"
        />

      </Link>

      <div className="favoriteRecipe">

        <div>
          <Link
            to={ `${route}/${recipe.id}` }
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
            {`${recipe.nationality} - ${recipe.category}`}
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
          {mensage && <p>Link copied!</p>}
        </div>
      </div>
    </div>
  );
}

FavoriteMeal.propTypes = {
  index: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  recipe: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    category: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    nationality: PropTypes.string,
  }).isRequired,
};

export default FavoriteMeal;
