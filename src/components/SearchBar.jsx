import React, { useContext, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Buttons from './Buttons';
import Inputs from './Inputs';
import apiFetch from '../helpers/apiFetch';
import RecipesContext from '../context/recipesContext';
import '../styles/components/Search.sass';

function SearchBar() {
  const [searchInfo, setSearchInfo] = useState({
    searchInput: '',
    searchRadio: '',
  });
  const { apiResponse, setApiResponse, setFilteredRecipes } = useContext(RecipesContext);

  const location = useLocation();
  const { pathname } = location;
  const page = pathname.split('/')[1];

  const history = useHistory();

  const apiType = page === 'meals' ? 'themealdb' : 'thecocktaildb';

  const { searchInput, searchRadio } = searchInfo;

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setSearchInfo({
      ...searchInfo,
      [name]: value,
    });
  };

  const getEndpoint = () => {
    const endpoint = {
      ingredient: 'filter.php?i=',
      name: 'search.php?s=',
      firstLetter: 'search.php?f=',
    };

    if (searchInput.length > 1 && searchRadio === 'firstLetter') {
      global.alert('Your search must have only 1 (one) character');
      return false;
    }

    const fullEndPoint = `${endpoint[searchRadio]}${searchInput}`;
    return (searchInput && searchRadio) && fullEndPoint;
  };

  const apiCall = async (endpoint) => {
    const response = await apiFetch(apiType, endpoint);
    return response;
  };

  const handleRedirect = (response) => {
    if (response.length === 1) {
      const firstOfArray = response[0];
      const id = firstOfArray.idMeal || firstOfArray.idDrink;
      history.push(`/${page}/${id}`);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const endpoint = getEndpoint();

    if (!endpoint) return;

    const response = await apiCall(endpoint);

    if (response[page] === null) {
      global.alert('Sorry, we haven\'t found any recipes for these filters.');
    } else {
      const api = {
        ...apiResponse,
        [page]: response[page],
      };
      setApiResponse(api);
      setFilteredRecipes(api);
      handleRedirect(response[page]);
    }
  };

  return (
    <div className="searchBarContainer">
      <form onSubmit={ handleSubmit }>
        <Inputs
          type="text"
          dataTestid="search-input"
          name="searchInput"
          value={ searchInput }
          onChange={ handleChange }
          placeholder="Search"
        />

        <div className="radios">
          <Inputs
            type="radio"
            dataTestid="ingredient-search-radio"
            name="searchRadio"
            value="ingredient"
            labelText="Ingredient"
            onChange={ handleChange }
          />
          <Inputs
            type="radio"
            dataTestid="name-search-radio"
            name="searchRadio"
            value="name"
            labelText="Name"
            onChange={ handleChange }
          />
          <Inputs
            type="radio"
            dataTestid="first-letter-search-radio"
            name="searchRadio"
            value="firstLetter"
            labelText="First Letter"
            onChange={ handleChange }
          />
        </div>
        <Buttons
          type="submit"
          dataTestid="exec-search-btn"
          labelText="Search"
        />
      </form>
    </div>
  );
}

export default SearchBar;
