export const elements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchResults: document.querySelector(".results"),
  searchResultsList: document.querySelector(".results__list"),
  searchResultsPages: document.querySelector(".results__pages"),
  recipe: document.querySelector(".recipe"),
  shopping: document.querySelector(".shopping__list"),
  likesMenu: document.querySelector(".likes__field"),
  likesList: document.querySelector(".likes__list")
};

export const elementStrings = {
  spinner: "spinner"
};

export const renderLoadingSpinner = parent => {
  const spinner = `
  <div class="${elementStrings.spinner}">
    <svg>
      <use href="img/icons.svg#icon-cw"></use>
    </svg>
  </div>
  `;
  parent.insertAdjacentHTML("afterbegin", spinner);
};

export const clearLoading = () => {
  const spinner = document.querySelector(`.${elementStrings.spinner}`);
  if (spinner) spinner.parentElement.removeChild(spinner);
};
