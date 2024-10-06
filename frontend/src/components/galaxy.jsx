import * as THREE from "three";
import { Star } from "./star.jsx";
import {
  CORE_X_DIST,
  CORE_Y_DIST,
  GALAXY_THICKNESS,
} from "../config/galaxyConfig.jsx";
import { gaussianRandom } from "../utils/utils.jsx";

const API_URL = import.meta.env.VITE_API_URL; // Define the API URL

export class Galaxy {
  constructor(scene, ra, dec, dist) {
    this.scene = scene;
    this.ra = ra;
    this.dec = dec;
    this.dist = dist;

    // Await for stars to be generated before adding to the scene
    this.generateStars().then((stars) => {
      stars.forEach((star) => star.toThreeObject(scene));
      this.stars = stars; // Store the stars array
    });
  }

  async generateStars() {
    let stars = [];

    // Function to load data from the JSON file
    const loadGaiaData = async () => {
      console.log("Loading data");
      console.log(this.ra, this.dec, this.dist);
      const response = await fetch(
        `${API_URL}/stars/ra=${this.ra}&dec=${this.dec}&dist=${this.dist}`
      ); // Adjust URL as needed
      if (!response.ok) {
        throw new Error("Failed to fetch stars.");
      }
      const data = await response.json();
      console.log(data);
      return data;
    };

    function normalizeStars(data) {
      const maxX = Math.max(...data.map((d) => Math.abs(d.X)));
      const maxY = Math.max(...data.map((d) => Math.abs(d.Y)));
      const maxZ = Math.max(...data.map((d) => Math.abs(d.Z)));
      const maxVal = Math.max(maxX, maxY, maxZ); // Get the overall max value for uniform scaling

      return data.map((d) => ({
        X: d.X / maxVal,
        Y: d.Y / maxVal,
        Z: d.Z / maxVal,
      }));
    }

    async function plotStars() {
      // Load data from exo.json
      const starData = await loadGaiaData();

      // Normalize the data
      const normalizedData = normalizeStars(starData);

      // Plot each star in the scene
      normalizedData.forEach((starCoords) => {
        const position = new THREE.Vector3(
          starCoords.X * 1000,
          starCoords.Y * 1000,
          starCoords.Z * 1000
        ); // Scaled for visualization
        let star = new Star(position);
        stars.push(star);
      });
    }

    // Call plotStars() to load stars from JSON and wait for completion
    await plotStars();

    return stars; // Return the stars array once all stars are generated
  }
}
