import React, { useEffect, useState, useRef } from "react";
import SearchBar from "../components/SearchBar";
import ExoplanetCard from "../components/ExoplanetCard";
import { useExoplanetContext } from "../hooks/useExoplanetContext";
import backgroundVideo from "../assets/video.mp4"; // Import the video file

const API_URL = import.meta.env.VITE_API_URL;

const ExoplanetSearch = () => {
  const { exoplanets, selectedPlanet, dispatch } = useExoplanetContext();
  const [planetData, setPlanetData] = useState(null);
  const videoRef = useRef(null); // Create a reference for the video element
  const [videoLoaded, setVideoLoaded] = useState(false); // Track if the video has been lazy-loaded

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
  }, [dispatch]);

  // Fetch planet data when selectedPlanet changes
  useEffect(() => {
    if (selectedPlanet) {
      const fetchPlanetData = async () => {
        setPlanetData(null);
        try {
          const response = await fetch(
            `${API_URL}/exoplanets/${selectedPlanet}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setPlanetData(data);
        } catch (error) {
          console.error("Failed to fetch planet data:", error);
        }
      };
      fetchPlanetData();
    }
  }, [selectedPlanet]);

  // Video loading progress tracking
  useEffect(() => {
    const video = videoRef.current;

    const updateProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        const percentLoaded = (bufferedEnd / duration) * 100;
        console.log(`Video loaded: ${percentLoaded.toFixed(2)}%`);
      }
    };

    const onLoadedMetadata = () => {
      console.log("Video metadata loaded");
    };

    const onLoadedData = () => {
      console.log("Video data loaded");
      setVideoLoaded(true);
    };

    if (video) {
      video.addEventListener("progress", updateProgress);
      video.addEventListener("loadedmetadata", onLoadedMetadata);
      video.addEventListener("loadeddata", onLoadedData);
    }

    return () => {
      if (video) {
        video.removeEventListener("progress", updateProgress);
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
        video.removeEventListener("loadeddata", onLoadedData);
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", overflow: "hidden", height: "100vh" }}>
      {/* Background video */}
      {!videoLoaded && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "greenyellow", // Placeholder background color
            zIndex: -1,
          }}
        />
      )}

      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        preload="auto"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          // zIndex: -1,
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
