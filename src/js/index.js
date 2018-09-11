import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements, renderLoadingSpinner, clearLoading } from "./views/base";

/** GLOBAL STATE OF THE APP
 *  - select object
 *  - current recipe object
 *  - shopping list object
 *  - liked recipes
 */
const state = {};

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

    // 4) Search for recipes
    await state.search.getResults();

    // 5) Render results on UI
    clearLoading();
    searchView.renderResults(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});
