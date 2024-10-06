import { createContext, useReducer } from "react";

// Create the context
export const ExoplanetContext = createContext();

// Define the reducer
export const exoplanetReducer = (state, action) => {
  switch (action.type) {
    case "SET_EXOPLANETS":
      return {
        ...state, // Keep other state properties
        exoplanets: action.payload,
      };
    case "ADD_EXOPLANET":
      return {
        ...state,
        exoplanets: [action.payload, ...state.exoplanets],
      };
    case "DELETE_EXOPLANET":
      return {
        ...state,
        exoplanets: state.exoplanets?.filter(
          (exoplanet) => exoplanet._id !== action.payload._id
        ),
      };
    case "UPDATE_EXOPLANET":
      return {
        ...state,
        exoplanets: state.exoplanets?.map((exoplanet) =>
          exoplanet._id === action.payload._id ? action.payload : exoplanet
        ),
      };
    case "SET_SELECTED_PLANET":
      return {
        ...state,
        selectedPlanet: action.payload,
      };
    default:
      return state;
  }
};

// Context provider component
export const ExoplanetContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(exoplanetReducer, {
    exoplanets: null,
    selectedPlanet: null, // Initial state for selected planet
  });

  return (
    <ExoplanetContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ExoplanetContext.Provider>
  );
};
