import React, { useState } from "react";
import { useExoplanetContext } from "../hooks/useExoplanetContext"; // Import the custom context hook
import { Button, Input } from "@nextui-org/react";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./SearchBar.module.css"; // Import css modules stylesheet as styles

const SearchBar = () => {
  const [inputValue, setInputValue] = useState(""); // Local state for input value
  const { dispatch } = useExoplanetContext(); // Access dispatch from context

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission

    if (inputValue.trim()) {
      dispatch({ type: "SET_SELECTED_PLANET", payload: inputValue }); // Dispatch action to set the selected planet
      setInputValue(""); // Clear the input after setting the selected planet
    }
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSearch}>
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
        type="submit"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
