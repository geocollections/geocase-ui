import axios from "axios";

const API_URL = "https://geocase-api.geocollections.info/";
// const MAP_URL = "https://geocase-map.geocollections.info/";

class MapService {
  static async searchCoordinates() {
    try {
      let url = `${API_URL}/map?q=*&wt=geojson&geojson.field=coordinates&fl=id,coordinates&start=0&rows=100000`;

      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }
}

export default MapService;
