import axios from "axios";

const GEOKOGUD_PUBLIC_API = "https://api.geocollections.info";

class StaticPageService {
  static async getPage(id) {
    try {
      let url = `${GEOKOGUD_PUBLIC_API}/page/${id}`;

      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default StaticPageService;
