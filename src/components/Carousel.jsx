import PropTypes from 'prop-types';
import React from 'react';

import useFetch from '../hooks/useFetch';
import {
  getDrinksRecommendations,
  getMealsRecommendations,
} from '../services/fetchFunctions';

import styles from '../styles/components/Carousel.module.css';

import { MEALS, SIX, ZERO } from '../services/constTypes';

function Carousel({ pathname }) {
  const { data, isLoading } = useFetch(
    pathname === MEALS ? getDrinksRecommendations : getMealsRecommendations,
  );

  return (
    isLoading ? <p>Carregando...</p> : (
      <div className={ styles.carouselContainer }>
        {data.splice(ZERO, SIX).map((recommendation, index) => (
          <div
            key={ index }
            data-testid={ `${index}-recommendation-card` }
            className={ styles.carouselCard }
          >
            <img src={ recommendation.image } alt={ recommendation.title } />
            <p data-testid={ `${index}-recommendation-title` }>
              {recommendation.title}
            </p>
          </div>
        ))}
      </div>
    )
  );
}

Carousel.propTypes = {
  pathname: PropTypes.string,
}.isRequired;

export default Carousel;
