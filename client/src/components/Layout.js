import React, { useState, useEffect, createContext } from "react";
import { Grid } from "@material-ui/core";
import Header from "./Header";
import Sidebar from "./Sidebar";

export const SelectedLinkContext = createContext();

const Layout = ({ children }) => {
  const [selectedNjkViewObject, setSelectedNjkViewObject] = useState(null);
  const [availableNjkViews, setAvailableNjkViews] = useState([]);

  const handleLinkClick = (selectedNjkViewObject) => {
    setSelectedNjkViewObject(selectedNjkViewObject);
  };

  useEffect(() => {
    fetch("http://localhost:5000/views")
      .then((res) => res.json())
      .then((json) => setAvailableNjkViews(json));
  }, []);

  return (
    <Grid container direction="row" spacing={3}>
      <Grid item xs={12}>
        <Header />
      </Grid>
      <SelectedLinkContext.Provider
        value={{ selectedNjkViewObject, handleLinkClick, availableNjkViews }}
      >
        <Grid item xs={3}>
          <Sidebar />
        </Grid>
        <Grid container item xs={9} spacing={3}>
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </SelectedLinkContext.Provider>
    </Grid>
  );
};
export default Layout;
