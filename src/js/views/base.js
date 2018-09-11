export const elements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchResults: document.querySelector(".results"),
  searchResultsList: document.querySelector(".results__list")
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
