import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';
import SearchBar from './SearchBar';
import '../styles/components/Header.sass';
import logo from '../assets/svg/smallLogo.svg';

function Header({
  title,
  titleIcon,
  showTitle = false,
  withProfileIcon = true,
  withSearchBar = true,
}) {
  const profileLink = '/profile';
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleClick = () => {
    setShowSearchBar(!showSearchBar);
  };

  return (
    <>
      <div className="headerContainer">
        <Link to="/meals" className="imgContainer">

          <img src={ logo } alt="logo" />
          <p>
            Recipes
            {' '}
            <span>app</span>
          </p>

        </Link>
        <div className="profileContainer">

          {withSearchBar
      && (
        <div>
          <button onClick={ handleClick }>
            <img src={ searchIcon } alt="searchIcon" data-testid="search-top-btn" />
          </button>

        </div>
      )}

          {withProfileIcon && (
            <Link to={ profileLink }>
              <img
                src={ profileIcon }
                alt="profileIcon"
                data-testid="profile-top-btn"
              />
            </Link>
          )}
        </div>
      </div>
      <div className="gap" />
      {showSearchBar && <SearchBar />}
      <div style={ !showTitle ? { display: 'none' } : null } className="titleContainer">
        <img src={ titleIcon } alt="title" />
        <h1
          data-testid="page-title"
        >
          {title}
        </h1>
      </div>
    </>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  withProfileIcon: PropTypes.bool,
  withSearchBar: PropTypes.bool,
}.isRequired;

export default Header;
