import { elements } from "./base";
import { truncRecipeTitle } from "./searchView";

export const toggleLikeBtn = isLiked => {
  const iconString = isLiked ? "icon-heart" : "icon-heart-outlined";
  document
    .querySelector(".recipe__love use")
    .setAttribute("href", `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numberOfLikes => {
  elements.likesMenu.style.visibility =
    numberOfLikes > 0 ? "visible" : "hidden";
};

export const renderLike = like => {
  const likesMarkup = `
    <li>
      <a class="likes__link" href="#${like.id}">
          <figure class="likes__fig">
              <img src="${like.img}" alt="${like.title}">
          </figure>
          <div class="likes__data">
              <h4 class="likes__name">${truncRecipeTitle(like.title)}</h4>
              <p class="likes__author">${like.author}</p>
          </div>
      </a>
    </li>
  `;

  elements.likesList.insertAdjacentHTML("beforeend", likesMarkup);
};

export const deleteLike = id => {
  const element = document.querySelector(`.likes__link[href*="#${id}"]`)
    .parentElement;
  if (element) {
    element.parentElement.removeChild(element);
  }
};
