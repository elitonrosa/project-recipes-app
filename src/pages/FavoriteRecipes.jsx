import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import FavoriteMeal from '../components/FavoriteMeal';
import { disfavor, favoritePromise } from '../services/favoriteHelpers';
import FavoriteDrink from '../components/FavoriteDrink';
import Footer from '../components/Footer';
import '../styles/components/Favorite.sass';
import Buttons from '../components/Buttons';
import allTypes from '../assets/svg/allFoods.svg';
import mealTypes from '../assets/svg/Meals/allIcon.svg';
import drinkTypes from '../assets/svg/Drinks/allIconDrinks.svg';
import favoriteIcon from '../assets/svg/Profile/favoriteIcon.svg';

function FavoriteRecipes() {
  const [favoriteArray, setfavoriteArray] = useState([]);

  const [favoriteFilters, setFavoriteFilters] = useState({
    all: true,
    meal: false,
    drink: false,
  });

  const handleFilter = (filter) => {
    const newFavoriteFilters = {
      all: false,
      meal: false,
      drink: false,
      [filter]: true,
    };
    setFavoriteFilters(newFavoriteFilters);
  };

  useEffect(() => {
    const getRecipes = () => {
      const recipes = favoritePromise();
      if (favoriteFilters.all) {
        setfavoriteArray(recipes);
      } else if (favoriteFilters.meal) {
        setfavoriteArray(recipes.filter((recipe) => recipe.type === 'meal'));
      } else {
        setfavoriteArray(recipes.filter((recipe) => recipe.type === 'drink'));
      }
    };
    getRecipes();
  }, [favoriteFilters]);

  const remove = (id) => {
    disfavor(id);
    const recipes = favoritePromise();
    setfavoriteArray(recipes);
  };

  return (
    <>
      <div className="favoriteMainPage">
        <Header
          title="Favorite Recipes"
          showTitle
          titleIcon={ favoriteIcon }
          withSearchBar={ false }
        />
        <div className="favoriteBtnsFilters">
          <Buttons
            dataTestid="filter-by-all-btn"
            onClick={ () => handleFilter('all') }
            labelText="All"
            icon={ allTypes }
          />
          <Buttons
            dataTestid="filter-by-meal-btn"
            onClick={ () => handleFilter('meal') }
            labelText="Meals"
            icon={ mealTypes }
          />
          <Buttons
            dataTestid="filter-by-drink-btn"
            onClick={ () => handleFilter('drink') }
            labelText="Drinks"
            icon={ drinkTypes }
          />

        </div>
        <div>
          {favoriteArray.map((recipes, index) => (
            recipes.type === 'meal'
              ? (
                <FavoriteMeal
                  recipe={ recipes }
                  index={ index }
                  key={ index }
                  onClick={ remove }
                />
              )
              : (
                <FavoriteDrink
                  recipe={ recipes }
                  index={ index }
                  key={ index }
                  onClick={ remove }
                />
              )
          ))}
        </div>
      </div>
      <div className="footerGap">
        <Footer />
      </div>
    </>
  );
}

export default FavoriteRecipes;
