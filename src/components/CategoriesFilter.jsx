import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import RecipesContext from '../context/recipesContext';
import apiFetch from '../helpers/apiFetch';
import Buttons from './Buttons';
import beefIcon from '../assets/svg/Meals/beef.svg';
import goatIcon from '../assets/svg/Meals/goat.svg';
import chickenIcon from '../assets/svg/Meals/chicken.svg';
import breakfastIcon from '../assets/svg/Meals/breakfast.svg';
import dessertIcon from '../assets/svg/Meals/dessert.svg';
import allMeals from '../assets/svg/Meals/allIcon.svg';
import shakeIcon from '../assets/svg/Drinks/shake.svg';
import cocktailIcon from '../assets/svg/Drinks/cocktail.svg';
import cocoaIcon from '../assets/svg/Drinks/cocoa.svg';
import otherIcon from '../assets/svg/Drinks/other.svg';
import ordinaryIcon from '../assets/svg/Drinks/ordinary.svg';
import allDrinks from '../assets/svg/Drinks/allIconDrinks.svg';

import '../styles/components/CategoriesFilter.sass';

const icons = {
  meals: {
    Beef: beefIcon,
    Goat: goatIcon,
    Chicken: chickenIcon,
    Breakfast: breakfastIcon,
    Dessert: dessertIcon,
    All: allMeals,
  },
  drinks: {
    Shake: shakeIcon,
    Cocktail: cocktailIcon,
    Cocoa: cocoaIcon,
    'Other / Unknown': otherIcon,
    'Ordinary Drink': ordinaryIcon,
    All: allDrinks,
  },

};

function CategoriesFilter({ apiType, pageName }) {
  const [categoryList, setCategoryList] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const { apiResponse, setFilteredRecipes } = useContext(RecipesContext);

  const amountOfCategories = 5;

  const apiCall = async (endpoint) => {
    const response = await apiFetch(apiType, endpoint);
    return response;
  };

  const getCategoriesByName = async (amount) => {
    const endpoint = 'list.php?c=list';
    const response = await apiCall(endpoint);

    const categoriesReduce = response[pageName].reduce((acc, { strCategory }, index) => {
      if (index < amount) {
        acc.push(strCategory);
      }
      return acc;
    }, []);
    setCategoryList(categoriesReduce);
  };

  const getRecipesByCategory = async (category) => {
    const endpoint = `filter.php?c=${category}`;
    const response = await apiCall(endpoint);
    const api = {
      ...apiResponse,
      [pageName]: response[pageName],
    };
    setFilteredRecipes(api);
  };

  const handleClick = (category) => {
    if (category === 'All' || category === categoryFilter) {
      setCategoryFilter('');
      setFilteredRecipes(apiResponse);
      return;
    }

    setCategoryFilter(category);
  };

  useEffect(() => {
    getCategoriesByName(amountOfCategories);
  }, []);

  useEffect(() => {
    if (categoryFilter === '') return;

    getRecipesByCategory(categoryFilter);
  }, [categoryFilter]);

  return (
    <div className="categoriesContainer">
      <Buttons
        category="All"
        labelText="All"
        dataTestid="All-category-filter"
        onClick={ () => handleClick('All') }
        icon={ icons[pageName].All }
        btnClass={ `categoryBtn ${categoryFilter === '' ? 'Selected' : ''}` }
      />

      {categoryList.map((category) => (
        <Buttons
          key={ category }
          category={ category }
          labelText={ category.split(' ')[0] }
          dataTestid={ `${category}-category-filter` }
          onClick={ () => handleClick(category) }
          icon={ icons[pageName][category] }
          btnClass={ `categoryBtn ${categoryFilter === category ? 'Selected' : ''}` }
        />
      ))}

    </div>
  );
}

CategoriesFilter.propTypes = {
  apiType: PropTypes.string,
}.isRequired;

export default CategoriesFilter;
