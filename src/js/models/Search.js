import axios from "axios";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    const key = "63266548fda20deabff501971f1c6634";
    try {
      const result = await axios(
        `https://www.food2fork.com/api/search?key=${key}&q=${this.query}`
      );
      this.result = result.data.recipes;
    } catch (error) {
      alert(error);
    }
  }
}
