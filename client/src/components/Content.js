import {
  Paper,
  Card,
  Button,
  TextField,
  Box,
  FormControlLabel,
  Grid,
  Link,
  Checkbox,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { SelectedLinkContext } from "./Layout";

const Content = () => {
  const { selectedNjkViewObject } = useContext(SelectedLinkContext);

  const [fileVariableOverrides, setFileVariableOverrides] = useState({});

  useEffect(() => {
    const defaultFileVariables = {};
    selectedNjkViewObject?.fileVariables.forEach((variable) => {
      defaultFileVariables[variable] = null;
    });
    setFileVariableOverrides(defaultFileVariables);
  }, [selectedNjkViewObject]);

  useEffect(() => {
    const englishLanguageIFrameForm = document.getElementById(
      "english-lang-preview-post-form"
    );

    if (englishLanguageIFrameForm) {
      englishLanguageIFrameForm.submit();
    }
  }, [selectedNjkViewObject, fileVariableOverrides]);

  const selectedLink = selectedNjkViewObject?.filePath;

  if (!selectedLink) {
    return (
      <div>
        This div is just a placeholder for some instructions on how to use the
        app
      </div>
    );
  }

  // TODO: fix styling more generally
  const iFrameStyle = {
    borderStyle: "solid",
    height: "90vh",
    width: "48%",
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!fileVariableOverrides) setFileVariableOverrides({});

    let newFileOverrides = { ...fileVariableOverrides };

    data.forEach((key, value) => {
      newFileOverrides = {
        ...newFileOverrides,
        [value]: key,
      };
    });

    setFileVariableOverrides(newFileOverrides);
  };

  return (
    <Grid container direction="row" spacing={3}>
      <Grid item xs={12}>
        <FileVariablesBox
          fileVariables={fileVariableOverrides}
          handleSubmit={handleSubmit}
        />
      </Grid>
      <Grid item xs={12}>
        <form
          id="english-lang-preview-post-form"
          target="english-lang-preview"
          action={`http://localhost:5000/${selectedLink}?lng=en`}
          method="post"
          style={{ display: "none" }}
        >
          {Object.entries(fileVariableOverrides).map((keyValuePair) => {
            console.log(keyValuePair);
            const [key, value] = keyValuePair;
            return (
              <input
                readOnly
                id={key}
                name={key}
                value={value || "undefined"}
              />
            );
          })}

          <input type="submit" />
        </form>

        <div className="side-by-side-en-cy" style={{ position: "relative" }}>
          <iframe
            src=""
            style={{ ...iFrameStyle, float: "left" }}
            title="english-lang-preview"
            name="english-lang-preview"
          />

          {/* TODO: make this use POST not GET */}
          <iframe
            src={`http://localhost:5000/${selectedLink}?lng=cy`}
            style={{ ...iFrameStyle, float: "right" }}
            title="welsh-lang-preview"
            name="welsh-lang-preview"
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default Content;

const FileVariablesBox = ({ fileVariables, handleSubmit }) => {
  const fileVariableKeys = Object.keys(fileVariables);
  return fileVariableKeys.length ? (
    <>
      <Card variant="outlined">
        The following fields represent possible variables that can be passed
        into the template. All are optional. Some may affect layout, whereas
        others are just strings which get interpolated:
      </Card>

      {/* TODO: fix bug where only one field works per page. */}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        {fileVariableKeys.map((variable) => {
          console.log(variable);
          return (
            <TextField
              key={`${variable}-text-field`}
              margin="normal"
              fullWidth
              id={variable}
              label={variable}
              name={variable}
              variant="outlined"
            />
          );
        })}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Re-render with selected variables
        </Button>
      </Box>
    </>
  ) : (
    <Paper>This file has no detected variables to change</Paper>
  );
};
