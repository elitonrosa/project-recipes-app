import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

function FavoriteDrink({ recipe, index, onClick }) {
  const [mensage, setMensage] = useState(false);

  const shareRecipe = () => {
    navigator.clipboard.writeText(`http://localhost:3000${recipe.type}s/${recipe.id}`);
    setMensage(true);
  };

  return (
    <div>
      <div>
        <Link to={ `${recipe.type}s/${recipe.id}` } style={ { textDecoration: 'none' } }>
          <img
            alt="foodpicture"
            src={ recipe.image }
            data-testid={ `${index}-horizontal-image` }
            className="doneCards-img"

          />
          <h3 data-testid={ `${index}-horizontal-name` }>{ recipe.name }</h3>
        </Link>
      </div>
      <p data-testid={ `${index}-horizontal-top-text` }>{recipe.alcoholicOrNot}</p>
      <button
        src={ shareIcon }
        data-testid={ `${index}-horizontal-share-btn` }
        onClick={ shareRecipe }
      >
        <img src={ shareIcon } alt="Share icon" />
      </button>
      {mensage && <p>Link copied!</p>}
      <button
        src={ blackHeartIcon }
        data-testid={ `${index}-horizontal-favorite-btn` }
        onClick={ () => onClick(recipe.id) }
      >
        <img src={ blackHeartIcon } alt="Black heart icon" />
      </button>
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
