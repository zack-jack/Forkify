import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

// Clears the input field of the search bar
export const clearSearchInput = () => {
  elements.searchInput.value = "";
};

// Clears previous search results from the view
export const clearResults = () => {
  elements.searchResultsList.innerHTML = "";
  elements.searchResultsPages.innerHTML = "";
};

// Truncates recipe titles that are longer than limit
/** Example
 * "Pasta with tomato and spinach"
 * accumulator starts at 0: 0 + current.length = 5 / newTitle = ['Pasta']
 * accumulator next is 5: accumulator + current.length = 9 / newTitle = ['Pasta', 'with']
 * accumulator next is 9: accumulator + current.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
 * accumulator next is 15: accumulator + current.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
 * accumulator next is 18: accumulator + current.length = 24 / newTitle = ['Pasta', 'with', 'tomato']
 */
const truncRecipeTitle = (title, charLimit = 17) => {
  const newTitle = [];
  if (title.length > charLimit) {
    title.split(" ").reduce((accumulator, current) => {
      if (accumulator + current.length <= charLimit) {
        newTitle.push(current);
      }
      return accumulator + current.length;
    }, 0);
    // Return the new title truncated
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

// Renders the recipe markup in the view
const renderRecipe = recipe => {
  const resultMarkup = `
  <li>
      <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${truncRecipeTitle(recipe.title)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
  </li>
  `;
  elements.searchResultsList.insertAdjacentHTML("beforeend", resultMarkup);
};

// Page button markup rendering
// Type: 'prev' or 'next'
const createPageButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-gotopage=${
  type === "prev" ? page - 1 : page + 1
}>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${
            type === "prev" ? "left" : "right"
          }"></use>
      </svg>
      <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
  </button>
  `;

// Logic for rendering results page navigation
const renderPageButtons = (page, numberOfResults, resultsPerPage) => {
  const pages = Math.ceil(numberOfResults / resultsPerPage);
  let button;

  if (page === 1 && pages > 1) {
    // Only button to go to next page
    button = createPageButton(page, "next");
  } else if (page < pages) {
    // Both buttons to next and previous page
    button = `
    ${createPageButton(page, "prev")}
    ${createPageButton(page, "next")}
    `;
  } else if (page === pages) {
    // Only button to go to previous page
    button = createPageButton(page, "prev");
  }

  elements.searchResultsPages.insertAdjacentHTML("afterbegin", button);
};

// Loops through each recipe and renders it to the view
export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  // Render page buttons
  renderPageButtons(page, recipes.length, resultsPerPage);
};
