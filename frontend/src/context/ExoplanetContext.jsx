import { createContext, useReducer } from "react";

export const ExoplanetContext = createContext();

export const exoplanetReducer = (state, action) => {
  switch (action.type) {
    case "SET_EXOPLANETS":
      return {
        exoplanets: action.payload,
      };
    case "ADD_EXOPLANET":
      return {
        exoplanets: [action.payload, ...state.exoplanets],
      };
    case "DELETE_EXOPLANET":
      return {
        exoplanets: state.exoplanets?.filter(
          (exoplanet) => exoplanet._id !== action.payload._id
        ),
      };
    case "UPDATE_EXOPLANET":
      return {
        exoplanets: state.exoplanets?.map((exoplanet) =>
          exoplanet._id === action.payload._id ? action.payload : exoplanet
        ),
      };
    default:
      return state;
  }
};

export const ExoplanetContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(exoplanetReducer, {
    exoplanets: null,
  });

  return (
    <ExoplanetContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ExoplanetContext.Provider>
  );
};
