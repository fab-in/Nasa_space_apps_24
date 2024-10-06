import React, { useEffect, useState } from "react";
import { useExoplanetContext } from "../hooks/useExoplanetContext";
import { useLocation } from "react-router-dom";
import ExoSky from "../components/ExoSky";
import ExoplanetCard from "../components/ExoplanetCard";

const API_URL = import.meta.env.VITE_API_URL;

function SkyView() {
  const { selectedPlanet } = useExoplanetContext();
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ra, setRa] = useState(0);
  const [dec, setDec] = useState(0);
  const [dist, setDist] = useState(0);
  const location = useLocation();

  // Function to parse query parameters
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    const ra = parseFloat(params.get("ra"));
    const dec = parseFloat(params.get("dec"));
    const dist = parseFloat(params.get("dist"));
    return { ra, dec, dist };
  };

  // Function to fetch stars based on RA and Dec
  const fetchStars = async (ra, dec, dist) => {
    try {
      const response = await fetch(
        `${API_URL}/stars/ra=${ra}&dec=${dec}&dist=${dist}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch stars.");
      }
      const data = await response.json();
      setStars(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { ra, dec, dist } = getQueryParams();
    if (ra && dec && dist) {
      setRa(ra);
      setDec(dec);
      setDist(dist);
      fetchStars(ra, dec, dist); // Fetch stars with valid parameters
    }
  }, [location.search]);

  if (loading) {
    return <div>Loading stars...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ display: "flex" }}>
      {ra !== 0 && dec !== 0 && dist !== 0 && (
        <ExoSky ra={ra} dec={dec} dist={dist} stars={stars} />
      )}
      <div style={{ maxHeight: "100vh" }}>
        <ExoplanetCard />
      </div>
    </div>
  );
}

export default SkyView;
