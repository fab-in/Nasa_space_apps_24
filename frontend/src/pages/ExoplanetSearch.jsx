import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import ExoplanetCard from "../components/ExoplanetCard";
import { useExoplanetContext } from "../hooks/useExoplanetContext";
import backgroundVideo from "../assets/space-video.mp4"; // Import the video file

const API_URL = import.meta.env.VITE_API_URL;

const ExoplanetSearch = () => {
  const { exoplanets, selectedPlanet, dispatch } = useExoplanetContext(); // Access selectedPlanet from context
  const [planetData, setPlanetData] = useState(null); // State to store fetched planet data

  // Fetch all exoplanets once
  useEffect(() => {
    const fetchExoplanets = async () => {
      const response = await fetch(`${API_URL}/exoplanets`, {
        method: "GET",
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_EXOPLANETS", payload: json });
      }
    };

    fetchExoplanets();
    console.log(exoplanets);
  }, [dispatch]);

  // Fetch planet data when selectedPlanet changes
  useEffect(() => {
    if (selectedPlanet) {
      const fetchPlanetData = async () => {
        setPlanetData(null);
        try {
          const response = await fetch(
            `${API_URL}/exoplanets/${selectedPlanet}`
          ); // Adjust the URL based on your backend API
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setPlanetData(data); // Update state with fetched data
        } catch (error) {
          console.error("Failed to fetch planet data:", error);
        }
      };

      fetchPlanetData();
    }
  }, [selectedPlanet]); // Watch for changes in selectedPlanet from context

  return (
    <div style={{ position: "relative", overflow: "hidden", height: "100vh" }}>
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1, // Ensures the video is behind the content
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      {selectedPlanet && (
        <ExoplanetCard
          selectedPlanet={selectedPlanet}
          planetData={planetData}
        />
      )}
      <SearchBar />
    </div>
  );
};

export default ExoplanetSearch;
