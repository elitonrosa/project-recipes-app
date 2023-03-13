import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { renderWithRouter } from './helpers/renderWithRouter';
import Meals from '../pages/Meals';
import fullMealCategories from '../../cypress/mocks/mealCategories';
import fullDrinkCategories from '../../cypress/mocks/drinkCategories';
import beefMeals from '../../cypress/mocks/beefMeals';
import { BEEF_CATEGORY_FILTER } from '../services/constTypes';

const mealsCategories = fullMealCategories.meals;
const drinksCategories = fullDrinkCategories.drinks;

const fiveDrinksCategories = drinksCategories.reduce(
  (acc, { strCategory }, index) => {
    if (index < 5) acc.push(strCategory);
    return acc;
  },
  [],
);
const fiveMealsCategories = mealsCategories.reduce(
  (acc, { strCategory }, index) => {
    if (index < 5) acc.push(strCategory);
    return acc;
  },
  [],
);

describe('Testando o componente CategoriesFilter', () => {
  it('Verifica se as 5(cinco) categorias são renderizadas corretamente na Pagina Meals.', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValue({
        json: jest.fn().mockResolvedValue(fullMealCategories),
      });
    renderWithRouter(<Meals />, {
      initialEntries: ['/meals'],
    });

    await waitFor(() => {
      fiveMealsCategories.forEach((category) => {
        const categoriesFilter = screen.getByTestId(
          `${category}-category-filter`,
        );
        expect(categoriesFilter).toBeInTheDocument();
      });
    });
  });

  it('Verifica se as 5(cinco) categorias são renderizadas corretamente na Pagina Drinks', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValue({
        json: jest.fn().mockResolvedValue(fullDrinkCategories),
      });
    renderWithRouter(<Meals />, {
      initialEntries: ['/drinks'],
    });

    await waitFor(() => {
      fiveDrinksCategories.forEach((category) => {
        const categoriesFilter = screen.getByTestId(
          `${category}-category-filter`,
        );
        expect(categoriesFilter).toBeInTheDocument();
      });
    });
  });

  it('Verifica se os filtros são aplicados corretamente na Pagina Meals', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValue({
        json: jest.fn().mockResolvedValue(fullMealCategories),
      });
    renderWithRouter(<Meals />, {
      initialEntries: ['/meals'],
    });

    await waitFor(async () => {
      const beefCategory = screen.getByTestId(BEEF_CATEGORY_FILTER);
      expect(beefCategory).toBeInTheDocument();
    });

    const beefCategory = screen.getByTestId(BEEF_CATEGORY_FILTER);
    await act(async () => {
      userEvent.click(beefCategory);
    });

    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({ json: () => Promise.resolve(beefMeals) }));
    const beefMeal = screen.getByTestId('0-card-name');
    expect(beefMeal).toBeInTheDocument();
  });

  it('Verifica se os filtros é Limpo quando Clicar duas vezes', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValue({
        json: jest.fn().mockResolvedValue(fullMealCategories),
      });
    renderWithRouter(<Meals />, {
      initialEntries: ['/meals'],
    });

    await waitFor(() => {
      const beefCategory = screen.getByTestId('Beef-category-filter');
      expect(beefCategory).toBeInTheDocument();
      userEvent.click(beefCategory);
      userEvent.click(beefCategory);
    });

    await act(async () => {
      const beefCategory = screen.getByTestId('Beef-category-filter');
      expect(beefCategory).toBeInTheDocument();
      userEvent.click(beefCategory);
      userEvent.click(beefCategory);
      const AllCategory = screen.getByTestId('All-category-filter');
      userEvent.click(AllCategory);
    });
  });
});
