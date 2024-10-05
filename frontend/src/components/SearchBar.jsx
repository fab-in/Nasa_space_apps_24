import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import {  Autocomplete,  AutocompleteSection,  AutocompleteItem} from "@nextui-org/autocomplete";
import { Button, Input } from "@nextui-org/react";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./SearchBar.module.css"; // Import css modules stylesheet as styles

const SearchBar = ({exoplanets}) => {
  return (
    <div className={styles.searchBar}>
      <Input className="dark" type="text" label="Search for an Exoplanet by name" />
      <Autocomplete 
        label="Search for an Exoplanet by name" 
        className="max-w-xs" 
      >
        {exoplanets?.map((animal) => (
          <AutocompleteItem key={animal.value} value={animal.value}>
            {exoplanet.label}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Button className="dark"  color="primary" endContent={<SearchIcon />}></Button>
    </div>
  );
};

export default SearchBar;
