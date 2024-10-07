import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Spinner,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useExoplanetContext } from "../hooks/useExoplanetContext"; // Import ExoplanetContext hook
import Rocket from "@mui/icons-material/Rocket"; // Existing rocket icon
import ExploreIcon from "@mui/icons-material/Explore"; // New icon for constellation
import styles from "./ExoplanetCard.module.css"; // Import css modules stylesheet as styles

const API_URL = import.meta.env.VITE_API_URL; // Define the API URL

export default function ExoplanetCard() {
  const { selectedPlanet } = useExoplanetContext(); // Get selectedPlanet from context
  const [planetData, setPlanetData] = useState(null); // State to store fetched planet data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to fetch planet data from the backend API
  const fetchPlanetData = async (planetName) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/exoplanets/${planetName}`);
      if (!response.ok) {
        throw new Error("Failed to fetch planet data.");
      }
      const data = await response.json();
      setPlanetData(data); // Update state with fetched data
    } catch (err) {
      setError(err.message); // Update error state
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Fetch planet data when selectedPlanet changes
  useEffect(() => {
    if (selectedPlanet) {
      fetchPlanetData(selectedPlanet); // Fetch data for selected planet
    }
  }, [selectedPlanet]);

  const handleExploreClick = () => {
    // Navigate to /skyview with RA and Dec as query parameters
    const ra = planetData?.ra || "N/A";
    const dec = planetData?.dec || "N/A";
    const dist = planetData?.distance || "N/A";
    navigate(`/skyview?ra=${ra}&dec=${dec}&dist=${dist}`);
  };

  const handleExploreClick2 = () => {
    // Navigate to /skyview with RA and Dec as query parameters
    const ra = planetData?.ra || "N/A";
    const dec = planetData?.dec || "N/A";
    const dist = planetData?.distance || "N/A";
    navigate(`/constellation?ra=${ra}&dec=${dec}&dist=${dist}`);
  };

  return (
    <Card className={[styles.exoplanetCard, "dark max-w-[400px]"]} style={{ position: 'relative', zIndex: 1000 }}>
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">{selectedPlanet}</p>
          {/* Exoplanet Name */}
        </div>
      </CardHeader>
      <Divider />

      {/* Show loading spinner if planet data is being fetched */}
      {loading ? (
        <Spinner style={{ margin: "10px" }} size="lg" />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <CardBody>
            <p>
              <strong>RA:</strong> {planetData?.ra || "N/A"}
            </p>
            <p>
              <strong>Dec:</strong> {planetData?.dec || "N/A"}
            </p>
            <p>
              <strong>Distance:</strong> {planetData?.distance || "N/A"}
            </p>
            <p>
              <strong>Orbital Period (days):</strong>{" "}
              {planetData?.orbital_period || "N/A"}
            </p>
            <p>
              <strong>Semi-Major Axis (AU):</strong>{" "}
              {planetData?.semi_major_axis || "N/A"}
            </p>
            <p>
              <strong>Mass (Jupiter Masses):</strong>{" "}
              {planetData?.mass || "N/A"}
            </p>
            <p>
              <strong>Radius (Jupiter Radius):</strong>{" "}
              {planetData?.radius || "N/A"}
            </p>
          </CardBody>
          <Divider />
          <CardFooter>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* First Button */}
              <Button color="primary" onClick={handleExploreClick}>
                Explore the skies! <Rocket /> {/* Rocket icon */}
              </Button>

              {/* Second Button */}
              <Button color="secondary" onClick={handleExploreClick2}>
                Create a Constellation! <ExploreIcon /> {/* Replaced icon */}
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
