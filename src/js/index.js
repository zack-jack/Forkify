import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoadingSpinner, clearLoading } from "./views/base";

/** GLOBAL STATE OF THE APP
 *  - select object
 *  - current recipe object
 *  - shopping list object
 *  - liked recipes
 */
const state = {};

/**
 *  SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1) Get query from the view
  const query = searchView.getInput();
  console.log(query);
  if (query) {
    // 2) New search object and add it to state
    state.search = new Search(query);

    // 3) Prepare the UI for the results
    searchView.clearSearchInput();
    searchView.clearResults();
    renderLoadingSpinner(elements.searchResults);

    try {
      // 4) Search for recipes
      await state.search.getResults();

      // 5) Render results on UI
      clearLoading();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert("Something went wrong with the search.");
    }
  }
};

// Search bar submit event listener
elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultsPages.addEventListener("click", e => {
  const buttonTarget = e.target.closest(".btn-inline");
  if (buttonTarget) {
    const goToPage = parseInt(buttonTarget.dataset.gotopage, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 *  RECIPE CONTROLLER
 */
const controlRecipe = async () => {
  // Get hash ID from url and remove "#"
  const id = window.location.hash.replace("#", "");
  console.log(id);

  if (id) {
    // Prepare the UI for changes
    recipeView.clearRecipe();
    renderLoadingSpinner(elements.recipe);

    // Highlight selected recipe
    if (state.search) searchView.highlightSelected(id);

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render the recipe
      clearLoading();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert("Error processing recipe.");
    }
  }
};

// Event listeners for recipe id hash change and load
["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);

// Servings count event listeners
elements.recipe.addEventListener("click", event => {
  if (event.target.matches(".btn-decrease, .btn-decrease *")) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (event.target.matches(".btn-increase, .btn-increase *")) {
    // Increase button is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  }
  console.log(state.recipe);
});
