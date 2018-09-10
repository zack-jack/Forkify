import Search from "./models/Search";

/** GLOBAL STATE OF THE APP
 *  - select object
 *  - current recipe object
 *  - shopping list object
 *  - liked recipes
 */
const state = {};

const controlSearch = async () => {
  // 1) Get query from the view
  const query = "pizza"; // todo
  if (query) {
    // 2) New search object and add it to state
    state.search = new Search(query);

    // 3) Prepare the UI for the results

    // 4) Search for recipes
    await state.search.getResults();

    // 5) Render results on UI
    console.log(state.search.result);
  }
};

document.querySelector(".search").addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});
