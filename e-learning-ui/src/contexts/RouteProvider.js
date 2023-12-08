import React, { createContext, useContext, useReducer } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RouteContext = createContext();

export const useRoute = () => useContext(RouteContext);

export const RouteProvider = ({ children }) => {
  const initialState = {
    location: null,
  };
  const location = useLocation();
  const { isAuthenticated, isAdmin, isStudent, isInstructor } = useAuth();

  const routeReducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_LOCATION":
        return { ...state, location: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(routeReducer, initialState);

  const updateLocation = (location) => {
    dispatch({ type: "UPDATE_LOCATION", payload: location });
  };

  if (
    isAuthenticated() &&
    location.pathname.includes(
      "/login" || location.pathname.includes("/register")
    )
  ) {
    const url = isAdmin()
      ? "/admin/dashboard"
      : isInstructor()
      ? "/instructor/dashboard"
      : "/student/dashboard";
    return <Navigate to={url} />;
  }

  return (
    <RouteContext.Provider value={{ location: state.location, updateLocation }}>
      {children}
    </RouteContext.Provider>
  );
};
