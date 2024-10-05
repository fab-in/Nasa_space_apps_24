import React, { useState } from "react"; // Import useState
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/autocomplete";
import { Button, Input } from "@nextui-org/react";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./SearchBar.module.css"; // Import css modules stylesheet as styles

const SearchBar = ({ exoplanets, setSelectedPlanet }) => {
  const [inputValue, setInputValue] = useState(""); // Local state for input value

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    setSelectedPlanet(inputValue); // Call setSelectedPlanet with the input value
    setInputValue(""); // Clear the input after setting the selected planet
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSearch}> {/* Wrap in form */}
      <Input
        className="dark"
        type="text"
        label="Search for an Exoplanet by name"
        value={inputValue} // Bind input value to state
        onChange={(e) => setInputValue(e.target.value)} // Update state on input change
      />
      <Button
        className="dark"
        color="primary"
        endContent={<SearchIcon />}
        type="submit" // Set button type to submit
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
