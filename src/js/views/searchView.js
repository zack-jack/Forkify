import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

// Clears the input field of the search bar
export const clearSearchInput = () => {
  elements.searchInput.value = "";
};

// Clears previous search results from the view
export const clearResults = () => {
  elements.searchResultList.innerHTML = "";
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
  elements.searchResultList.insertAdjacentHTML("beforeend", resultMarkup);
};

// Loops through each recipe and renders it to the view
export const renderResults = recipes => {
  recipes.forEach(renderRecipe);
};
