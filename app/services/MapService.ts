import axios from "axios";

const API_URL = "/api";

class MapService {
  static async searchCoordinates() {
    try {
      const url = `${API_URL}/map?q=*&wt=geojson&geojson.field=coordinates&fl=id,coordinates&start=0&rows=100000`;

      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error(
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}

export default MapService;
