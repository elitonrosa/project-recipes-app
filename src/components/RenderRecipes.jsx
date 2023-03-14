import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import RecipesContext from '../context/recipesContext';
import '../styles/components/RenderRecipes.sass';

function RenderRecipes() {
  const { filteredRecipes } = useContext(RecipesContext);
  const [showRecipes, setShowRecipes] = useState([]);

  const location = useLocation();
  const { pathname } = location;
  const pageName = pathname.split('/')[1];

  const intervalRecipes = (params) => {
    const skip = 12;
    const firstIndex = params * skip;
    const lastIndex = firstIndex + skip;
    const recipes = filteredRecipes[pageName].slice(firstIndex, lastIndex);
    setShowRecipes(recipes);
  };

  const getIdType = () => {
    if (pageName === 'meals') {
      return 'idMeal';
    }
    return 'idDrink';
  };

  const idType = getIdType();

  useEffect(() => {
    intervalRecipes(0);
  }, [filteredRecipes]);

  return (
    <div className="test">
      <div className="cardRecipeContainer">
        {showRecipes.map((recipe, index) => (
          <Link to={ `/${pageName}/${recipe[idType]}` } key={ index }>
            <div
              data-testid={ `${index}-recipe-card` }
              className="cardRecipe"
            >
              <img
                src={ recipe.strMealThumb || recipe.strDrinkThumb }
                alt={ recipe.strMeal || recipe.strDrink }
                className="recipe-img"
                data-testid={ `${index}-card-img` }
              />
              <p data-testid={ `${index}-card-name` } className="recipe-name">
                {recipe.strMeal || recipe.strDrink}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RenderRecipes;
