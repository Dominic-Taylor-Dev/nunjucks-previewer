import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const Header = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6">
        Nunjucks previewer: Authentication Front End
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
