import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoadingSpinner, clearLoading } from "./views/base";

/** GLOBAL STATE OF THE APP
 *  - select object
 *  - current recipe object
 *  - shopping list object
 *  - liked recipes
 */
const state = {};
window.state = state;

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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      console.log(error);
      alert("Error processing recipe.");
    }
  }
};

// Event listeners for recipe id hash change and load
["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);

/**
 *  LIST CONTROLLER
 */
// FOR TESTING
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

const controlList = () => {
  // Create a new list if there isn't one yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(element => {
    const item = state.list.addItem(
      element.count,
      element.unit,
      element.ingredient
    );

    listView.renderItem(item);
  });
};

//Delete and update list item events
elements.shopping.addEventListener("click", event => {
  const id = event.target.closest(".shopping__item").dataset.itemid;
  console.log(id);
  if (event.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);

    // Handle the count update
  } else if (event.target.matches(".shopping__count--value")) {
    const value = parseFloat(event.target.value, 10);
    state.list.updateCount(id, value);
  }
});

/**
 *  LIKE CONTROLLER
 */
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has not yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    // Toggle the like button
    likesView.toggleLikeBtn(true);

    // Add like to the UI list
    likesView.renderLike(newLike);

    // User has liked current recipe
  } else {
    // Remove like from the state
    state.likes.deleteLike(currentID);

    // Toggle the like button
    likesView.toggleLikeBtn(false);

    // Remove like from the UI list
  }

  // Hides the top bar likes menu if likes array is empty
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

/**
 *  LIST EVENT LISTENERS
 */
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
  } else if (event.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // Add ingredients to the shopping list
    controlList();
  } else if (event.target.matches(".recipe__love, .recipe__love *")) {
    // Like controller
    controlLike();
  }
});

window.list = new List();
