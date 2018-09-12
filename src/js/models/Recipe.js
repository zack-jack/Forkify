import axios from "axios";
import { key } from "../config";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const result = await axios(
        `https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
      this.title = result.data.recipe.title;
      this.author = result.data.recipe.publisher;
      this.img = result.data.recipe.image_url;
      this.url = result.data.recipe.source_url;
      this.ingredients = result.data.recipe.ingredients;
    } catch (error) {
      alert("Something went wrong :(");
    }
  }

  calcTime() {
    // Assumes 15 minutes for every 3 ingredients
    const numOfIngredients = this.ingredients.length;
    const period = Math.ceil(numOfIngredients / 3);
    this.time = period * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "cup",
      "pounds",
      "pound",
      "package"
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "c",
      "c",
      "lb",
      "lb",
      "pkg"
    ];
    const units = [...unitsShort, "kg", "g"];

    const newIngredients = this.ingredients.map(element => {
      // 1) Uniform units
      let ingredient = element.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      // 2) Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      // 3) Parse ingredients into count, unit, and ingredient
      const arrIngredients = ingredient.split(" ");
      const unitIndex = arrIngredients.findIndex(ingredElement =>
        units.includes(ingredElement)
      );

      let objectIngredient;

      if (unitIndex > -1) {
        // There is a unit
        const arrCount = arrIngredients.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIngredients[0].replace("-", "+"));
        } else {
          count = eval(arrIngredients.slice(0, unitIndex).join("+"));
        }

        objectIngredient = {
          count,
          unit: arrIngredients[unitIndex],
          ingredient: arrIngredients.slice(unitIndex + 1).join(" ")
        };
      } else if (parseInt(arrIngredients[0], 10)) {
        // There is no unit, but the first element is a number
        objectIngredient = {
          count: parseInt(arrIngredients[0], 10),
          unit: "",
          ingredient: arrIngredients.slice(1).join(" ")
        };
      } else if (unitIndex === -1) {
        // There is no unit
        objectIngredient = {
          count: 1,
          unit: "",
          ingredient
        };
      }

      return objectIngredient;
    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // Servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach(ingredient => {
      ingredient.count *= newServings / this.servings;
    });

    this.servings = newServings;
  }
}
