import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import { renderWithRouter } from './helpers/renderWithRouter';

import App from '../App';

import { favoriteRecipes } from './mock/favoriteRecipes';
import { FAVORITE_RECIPES } from '../services/constTypes';

const ROUTE_FAVORITE_RECIPES = '/favorite-recipes';

describe('Testes da Tela Favorite Recipes', () => {
  it('Testa se os botões são renderizados e funcionam corretamente', async () => {
    localStorage.setItem(FAVORITE_RECIPES, JSON.stringify(favoriteRecipes));
    renderWithRouter(<App />, { initialEntries: [ROUTE_FAVORITE_RECIPES] });

    const allButton = screen.getByTestId('filter-by-all-btn');
    expect(allButton).toBeInTheDocument();
    const mealButton = screen.getByTestId('filter-by-meal-btn');
    expect(mealButton).toBeInTheDocument();
    const drinkButton = screen.getByTestId('filter-by-drink-btn');
    expect(drinkButton).toBeInTheDocument();

    const favoriteRecipesCards = await waitFor(() => screen.getAllByTestId(/-horizontal-name/));

    expect(favoriteRecipesCards.length).toBe(6);

    await act(async () => {
      userEvent.click(mealButton);
    });

    await waitFor(() => {
      const favoriteCards = screen.getAllByTestId(/-horizontal-name/);
      expect(favoriteCards.length).toBe(2);
    });

    await act(async () => {
      userEvent.click(drinkButton);
    });

    await waitFor(() => {
      const favoriteCards = screen.getAllByTestId(/-horizontal-name/);
      expect(favoriteCards.length).toBe(4);
    });

    await act(async () => {
      userEvent.click(allButton);
    });

    await waitFor(() => {
      const favoriteCards = screen.getAllByTestId(/-horizontal-name/);
      expect(favoriteCards.length).toBe(6);
    });
    localStorage.clear();
  });

  it('Testa se é possível remover um favorito', async () => {
    localStorage.setItem(FAVORITE_RECIPES, JSON.stringify(favoriteRecipes));

    renderWithRouter(<App />, { initialEntries: [ROUTE_FAVORITE_RECIPES] });

    const favoriteButtons = await waitFor(() => screen.getAllByTestId(/-horizontal-favorite-btn/));

    expect(favoriteButtons.length).toBe(6);

    await act(async () => {
      userEvent.click(favoriteButtons[0]);
    });

    await waitFor(async () => {
      const favoriteBtns = await waitFor(() => screen.getAllByTestId(/-horizontal-favorite-btn/));
      expect(favoriteBtns.length).toBe(5);
    });

    await act(async () => {
      userEvent.click(favoriteButtons[4]);
    });

    await waitFor(async () => {
      const favoriteBtns = await waitFor(() => screen.getAllByTestId(/-horizontal-favorite-btn/));
      expect(favoriteBtns.length).toBe(4);
    });
  });

  it('Testa se é possível compartilhar uma receita', async () => {
    localStorage.setItem(FAVORITE_RECIPES, JSON.stringify(favoriteRecipes));
    Object.assign(navigator, {
      clipboard: {
        writeText: () => {},
      },
    });

    renderWithRouter(<App />, { initialEntries: [ROUTE_FAVORITE_RECIPES] });

    const shareButtonDrink = await waitFor(() => screen.getByTestId('0-horizontal-share-btn'));
    expect(shareButtonDrink).toBeInTheDocument();
    const shareButtonMeal = await waitFor(() => screen.getByTestId('4-horizontal-share-btn'));
    expect(shareButtonMeal).toBeInTheDocument();

    userEvent.click(shareButtonMeal);

    const msg = await waitFor(() => screen.getByText('Link copied!'));
    expect(msg).toBeInTheDocument();
    userEvent.click(shareButtonDrink);

    localStorage.clear();
  });
});
