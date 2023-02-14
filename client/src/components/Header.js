import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const Header = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h5">
        Authentication Front End: Nunjucks Previewer
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
