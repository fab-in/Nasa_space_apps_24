import React, { useEffect, useState, useRef } from "react";
import SearchBar from "../components/SearchBar";
import ExoplanetCard from "../components/ExoplanetCard";
import { useExoplanetContext } from "../hooks/useExoplanetContext";
import backgroundVideo from "../assets/video.mp4"; // Import the video file
import ExoplanetSearchCard from "../components/ExoplanetSearchCard";
import RocketIcon from "@mui/icons-material/Rocket";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const ExoplanetSearch = () => {
  const { exoplanets, selectedPlanet, dispatch } = useExoplanetContext();
  const [planetData, setPlanetData] = useState(null);
  const videoRef = useRef(null); // Create a reference for the video element
  const [videoLoaded, setVideoLoaded] = useState(false); // Track if the video has been lazy-loaded
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const planetsPerPage = 12; // Number of planets per page
  const navigate = useNavigate();

  // Fetch all exoplanets once
  useEffect(() => {
    const fetchExoplanets = async () => {
      const response = await fetch(`${API_URL}/exoplanets`, {
        method: "GET",
      });
      const json = await response.json();
      console.log(json);
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

  // Pagination logic
  const indexOfLastPlanet = currentPage * planetsPerPage;
  const indexOfFirstPlanet = indexOfLastPlanet - planetsPerPage;
  const currentPlanets = exoplanets?.slice(
    indexOfFirstPlanet,
    indexOfLastPlanet
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

      {currentPlanets && (
        <>
          {/* Table of Planets */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <table style={{ width: "80%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{ padding: "10px", borderBottom: "2px solid gray" }}
                  >
                    Planet Name
                  </th>
                  <th
                    style={{ padding: "10px", borderBottom: "2px solid gray" }}
                  >
                    View
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPlanets?.map((planet, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        borderBottom: "1px solid lightgray",
                      }}
                    >
                      {planet.name} {/* Display planet name */}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        borderBottom: "1px solid lightgray",
                      }}
                    >
                      {/* <RocketIcon style={{ fontSize: 30 }} />{" "} */}
                      {/* Display icon */}
                      <Button
                        color="primary"
                        onClick={() => {
                          const ra = planet?.ra || "N/A";
                          const dec = planet?.dec || "N/A";
                          const dist = planet?.dist || "N/A";
                          navigate(`/skyview?ra=${ra}&dec=${dec}&dist=${dist}`);
                          dispatch({ type: "SET_SELECTED_PLANET", payload: planet?.name });
                        }}
                      >
                        <RocketIcon /> {/* Rocket icon */}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            {Array.from(
              { length: Math.ceil(exoplanets?.length / planetsPerPage) },
              (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  style={{
                    margin: "0 5px",
                    padding: "5px 10px",
                    backgroundColor:
                      currentPage === i + 1 ? "blue" : "lightgray",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExoplanetSearch;
