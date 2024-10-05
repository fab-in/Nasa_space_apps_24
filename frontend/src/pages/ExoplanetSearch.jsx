import React, { useEffect } from "react";
import SearchBar from "../components/SearchBar";
import ExoplanetCard from "../components/ExoplanetCard";
import { useExoplanetContext } from "../hooks/useExoplanetContext";

const API_URL = import.meta.env.VITE_API_URL;

const ExoplanetSearch = () => {
  const { exoplanets, dispatch } = useExoplanetContext();

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

  return (
    <div>
      <ExoplanetCard />
      <SearchBar exoplanets={exoplanets} />
    </div>
  );
};

export default ExoplanetSearch;
