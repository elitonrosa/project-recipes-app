import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import shareIcon from '../images/shareIcon.svg';
import { DONE_RECIPES } from '../services/constTypes';
import { getFromLocalStorage } from '../services/localStorageHelpers';

function DoneRecipes() {
  const [isURLCopied, setIsURLCopied] = useState(false);
  const [filteredDoneRecipes, setfilteredDoneRecipes] = useState([]);
  const [doneRecipes, setDoneRecipes] = useState([]);

  const { pathname } = useLocation();
  const [, baseURL] = String(window.location.href).split('//');

  const handleShareClick = (type, id) => {
    const newPathname = `${type}s/${id}`;
    const url = `${baseURL.replaceAll(pathname, '')}/${newPathname}`;
    navigator.clipboard.writeText(url);
    setIsURLCopied(true);
    const THREE_THOUSAND = 3000;
    setTimeout(() => {
      setIsURLCopied(false);
    }, THREE_THOUSAND);
  };

  const handleFilterMeal = () => {
    const meals = doneRecipes.filter((recipe) => recipe.type === 'meal');
    setfilteredDoneRecipes(meals);
  };

  const handleFilterDrink = () => {
    const drinks = doneRecipes.filter((recipe) => recipe.type === 'drink');
    setfilteredDoneRecipes(drinks);
  };

  const handleFilterAll = useCallback(() => {
    setfilteredDoneRecipes(doneRecipes);
  }, [doneRecipes]);

  useEffect(() => {
    setDoneRecipes(getFromLocalStorage(DONE_RECIPES));
  }, []);

  useEffect(() => {
    setfilteredDoneRecipes(doneRecipes);
  }, [doneRecipes]);

  return (
    <div>
      <Header title="Done Recipes" withSearchBar={ false } />
      <div className="done-container">
        <div className="header-btns">
          <button
            data-testid="filter-by-all-btn"
            type="button"
            onClick={ () => handleFilterAll() }
          >
            All
          </button>
          <button
            data-testid="filter-by-meal-btn"
            type="button"
            onClick={ () => handleFilterMeal() }
          >
            Meals
          </button>
          <button
            data-testid="filter-by-drink-btn"
            type="button"
            onClick={ () => handleFilterDrink() }
          >
            Drinks
          </button>
        </div>
        <div className="done-cards">
          {filteredDoneRecipes && filteredDoneRecipes.map((recipe, index) => (
            <div key={ index }>
              <Link to={ `/${recipe.type}s/${recipe.id}` }>
                <div>
                  <img
                    data-testid={ `${index}-horizontal-image` }
                    src={ recipe.image }
                    alt={ recipe.name }
                    className="doneCards-img"
                  />
                </div>
              </Link>

              <div className="doneCards-descriptions">
                <h3 data-testid={ `${index}-horizontal-top-text` }>
                  {recipe.alcoholicOrNot}
                </h3>

                <Link to={ `/${recipe.type}s/${recipe.id}` }>
                  <h2 data-testid={ `${index}-horizontal-name` }>
                    {`Name: ${recipe.name}`}

                  </h2>
                </Link>
                <h3 data-testid={ `${index}-horizontal-top-text` }>
                  {`Category-nationality: ${recipe.nationality} - ${recipe.category}`}
                </h3>
                <h3 data-testid={ `${index}-horizontal-done-date` }>
                  {`Done in : ${recipe.doneDate}`}
                </h3>
                {
                  recipe.type === 'meal' && (
                    recipe.tags && recipe.tags.length > 0 && (
                      <h3 data-testid={ `${index}-horizontal-tag` }>
                        {
                          recipe.tags.map((tag, indexTag) => (
                            <span
                              key={ indexTag }
                              data-testid={ `${index}-${tag}-horizontal-tag` }
                            >
                              {tag}
                              {indexTag < recipe.tags.length - 1 && ', '}
                            </span>
                          ))
                        }
                      </h3>
                    )
                  )
                }
                <button
                  type="button"
                  onClick={ () => handleShareClick(recipe.type, recipe.id) }
                  className="share-btn"
                  data-testid={ `${index}-share-btn` }
                >
                  <img
                    data-testid={ `${index}-horizontal-share-btn` }
                    src={ shareIcon }
                    alt="Compartilhar"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isURLCopied && (
        <div>
          <p>Link copied!</p>
        </div>
      )}
    </div>
  );
}

export default DoneRecipes;
