import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import App from '../App';

import { renderWithRouter } from './helpers/renderWithRouter';
import { DONE_RECIPES } from '../services/constTypes';
import { doneRecipes as recipesOnLS } from './mock/doneRecipes';

const ROUTE_DONE_RECIPES = '/done-recipes';

describe('Testa a página de receitas feitas', () => {
  it('Verifica se os botões de filtro são renderizados', async () => {
    renderWithRouter(<App />, { initialEntries: [ROUTE_DONE_RECIPES] });

    await waitFor(() => {
      const doneRecipes = screen.getByTestId('page-title');
      expect(doneRecipes).toBeInTheDocument();
    });

    const allFilter = screen.getByTestId('filter-by-all-btn');
    expect(allFilter).toBeInTheDocument();
    const mealFilter = screen.getByTestId('filter-by-meal-btn');
    expect(mealFilter).toBeInTheDocument();
    const drinkFilter = screen.getByTestId('filter-by-drink-btn');
    expect(drinkFilter).toBeInTheDocument();
  });

  it('Verifica se as receitas feitas são renderizadas corretamente', async () => {
    localStorage.setItem(DONE_RECIPES, JSON.stringify(recipesOnLS));

    renderWithRouter(<App />, { initialEntries: [ROUTE_DONE_RECIPES] });

    await waitFor(
      () => {
        const img = screen.getByTestId('0-horizontal-image');
        expect(img).toBeInTheDocument();
      },
    );

    const allFilter = screen.getByTestId('filter-by-all-btn');
    const mealFilter = screen.getByTestId('filter-by-meal-btn');
    const drinkFilter = screen.getByTestId('filter-by-drink-btn');
    const doneRecipesCard = screen.getAllByTestId(/-horizontal-name/);

    expect(doneRecipesCard.length).toBe(3);

    await act(async () => {
      userEvent.click(mealFilter);
    });

    await waitFor(() => {
      const doneRecipesList = screen.getAllByTestId(/-horizontal-name/);
      expect(doneRecipesList.length).toBe(1);
    });

    await act(async () => {
      userEvent.click(drinkFilter);
    });

    await waitFor(() => {
      const doneRecipesList = screen.getAllByTestId(/-horizontal-name/);
      expect(doneRecipesList.length).toBe(2);
    });

    userEvent.click(allFilter);
    localStorage.clear();
  });

  it('Testa se é possivel compartilhar uma receita', async () => {
    localStorage.setItem(DONE_RECIPES, JSON.stringify(recipesOnLS));
    Object.assign(navigator, {
      clipboard: {
        writeText: () => {},
      },
    });

    renderWithRouter(<App />, { initialEntries: [ROUTE_DONE_RECIPES] });

    await waitFor(
      () => {
        const img = screen.getByTestId('0-horizontal-image');
        expect(img).toBeInTheDocument();
      },
    );

    const shareButton = screen.getByTestId('0-share-btn');

    await act(async () => {
      userEvent.click(shareButton);
    });

    const msg = screen.getByText(/Link copied!/i);
    expect(msg).toBeInTheDocument();

    await waitFor(() => {
      expect(msg).not.toBeInTheDocument();
    }, { timeout: 3000 });

    localStorage.clear();
  });
});
