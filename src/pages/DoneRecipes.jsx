import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import shareIcon from '../images/shareIcon.svg';
import { DONE_RECIPES } from '../services/constTypes';
import { getFromLocalStorage } from '../services/localStorageHelpers';

import allTypes from '../assets/svg/allFoods.svg';
import mealTypes from '../assets/svg/Meals/allIcon.svg';
import drinkTypes from '../assets/svg/Drinks/allIconDrinks.svg';
import doneIcon from '../assets/svg/Profile/checkIcon.svg';
import Buttons from '../components/Buttons';
import '../styles/pages/DoneRecipes.sass';
import Footer from '../components/Footer';
import ClipboardModal from '../components/ClipboardModal';

function DoneRecipes() {
  const [isURLCopied, setIsURLCopied] = useState(false);
  const [filteredDoneRecipes, setfilteredDoneRecipes] = useState([]);
  const [doneRecipes, setDoneRecipes] = useState([]);

  const { pathname } = useLocation();
  const [http, baseURL] = String(window.location.href).split('//');

  const handleShareClick = (type, id) => {
    const newPathname = `${type}s/${id}`;
    const url = `${http}//${baseURL.replaceAll(pathname, '')}/${newPathname}`;
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
    <div className="doneMainPage">
      <Header
        title="Done Recipes"
        showTitle
        titleIcon={ doneIcon }
        withSearchBar={ false }
      />

      <div className="doneBtnsFilters">
        <Buttons
          dataTestid="filter-by-all-btn"
          onClick={ () => handleFilterAll() }
          labelText="All"
          icon={ allTypes }
        />

        <Buttons
          dataTestid="filter-by-meal-btn"
          onClick={ () => handleFilterMeal() }
          labelText="Meals"
          icon={ mealTypes }
        />

        <Buttons
          dataTestid="filter-by-drink-btn"
          onClick={ () => handleFilterDrink() }
          labelText="Drinks"
          icon={ drinkTypes }
        />

      </div>
      <div className="doneCardsContainer">
        {filteredDoneRecipes && filteredDoneRecipes.map((recipe, index) => (
          <div key={ index } className="doneCard">
            <Link
              to={ `/${recipe.type}s/${recipe.id}` }
              className="done-link"
            >
              <img
                data-testid={ `${index}-horizontal-image` }
                src={ recipe.image }
                alt={ recipe.name }
                className="doneCard-img"
              />
            </Link>

            <div className="doneCards-descriptions">
              <div className="nameContainer">
                <Link
                  to={ `/${recipe.type}s/${recipe.id}` }
                  className="done-link"
                >
                  <p data-testid={ `${index}-horizontal-name` }>
                    {recipe.name}
                  </p>
                </Link>
                <div>
                  <span
                    data-testid={ `${index}-horizontal-top-text` }
                  >
                    {recipe.alcoholicOrNot}
                  </span>
                </div>
              </div>

              <span data-testid={ `${index}-horizontal-top-text` }>
                {`
              ${recipe.nationality ? `${recipe.nationality} - ` : ''}${recipe.category}`}
              </span>
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

              <span
                data-testid={ `${index}-horizontal-done-date` }
                className="doneCard-date"
              >
                {recipe.doneDate}
              </span>

              <Buttons
                dataTestid={ `${index}-horizontal-share-btn` }
                onClick={ () => handleShareClick(recipe.type, recipe.id) }
                icon={ shareIcon }
              />
            </div>
          </div>
        ))}
      </div>
      {isURLCopied && (
        <ClipboardModal />
      )}
      <div className="footerGap">
        <Footer />
      </div>
    </div>
  );
}

export default DoneRecipes;
