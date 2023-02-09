import React, { useContext, useState } from "react";
import { List, ListItemText, MenuItem } from "@material-ui/core";
import { SelectedLinkContext } from "./Layout";

const Sidebar = () => {
  const { handleLinkClick, availableNjkViews } =
    useContext(SelectedLinkContext);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  return availableNjkViews.length ? (
    <List
      style={{
        maxHeight: "100vh",
        overflow: "auto",
        backgroundColor: "background.paper",
      }}
    >
      {availableNjkViews.map((viewObject, index) => (
        <MenuItem
          button
          onClick={() => {
            setSelectedIndex(index);
            handleLinkClick(viewObject);
          }}
          selected={selectedIndex === index}
          key={`menu-item-${index}`}
        >
          <ListItemText
            key={`list-item-text-${index}`}
            primary={viewObject.filePath}
          />
        </MenuItem>
      ))}
    </List>
  ) : (
    <div>Still loading available .njk files from frontend repository</div>
  );
};

export default Sidebar;
