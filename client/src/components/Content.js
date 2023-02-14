import {
  Paper,
  Card,
  Button,
  TextField,
  Box,
  Grid,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { SelectedLinkContext } from "./Layout";

const injectVarsAsFormInputs = (vars) => {
  return Object.entries(vars).map((keyValuePair, index) => {
    console.log(keyValuePair);
    const [key, value] = keyValuePair;
    return (
      <input
        readOnly
        key={index}
        id={key}
        name={key}
        value={value || "undefined"}
      />
    );
  });
};

const Content = () => {
  const { selectedNjkViewObject } = useContext(SelectedLinkContext);

  const [fileVariableOverrides, setFileVariableOverrides] = useState({});

  const displayEnglish = true;
  const displayWelsh = true;

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

    const welshLanguageIFrameForm = document.getElementById(
      "welsh-lang-preview-post-form"
    );

    if (englishLanguageIFrameForm && displayEnglish) {
      englishLanguageIFrameForm.submit();
    }

    if (welshLanguageIFrameForm && displayWelsh) {
      welshLanguageIFrameForm.submit();
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
      <Typography variant="h5" sx={{ fontSize: 16 }}>
        {selectedNjkViewObject.filePath}
      </Typography>
      <Grid item xs={12}>
        <FileVariablesBox
          fileVariables={fileVariableOverrides}
          handleSubmit={handleSubmit}
        />
      </Grid>
      <Grid item xs={12}>
        <form
          id="welsh-lang-preview-post-form"
          target="welsh-lang-preview"
          action={`http://localhost:5000/${selectedLink}?lng=cy`}
          method="post"
          style={{ display: "none" }}
        >
          {injectVarsAsFormInputs(fileVariableOverrides)}
        </form>
        <form
          id="english-lang-preview-post-form"
          target="english-lang-preview"
          action={`http://localhost:5000/${selectedLink}?lng=en`}
          method="post"
          style={{ display: "none" }}
        >
          {injectVarsAsFormInputs(fileVariableOverrides)}
        </form>

        {displayEnglish && (
          <iframe
            src=""
            style={{
              ...iFrameStyle,
              float: "left",
              width: displayWelsh ? "48%" : "100%",
            }}
            title="english-lang-preview"
            name="english-lang-preview"
          />
        )}

        {displayWelsh && (
          <iframe
            src=""
            style={{
              ...iFrameStyle,
              float: "right",
              width: displayEnglish ? "48%" : "100%",
            }}
            title="welsh-lang-preview"
            name="welsh-lang-preview"
          />
        )}
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
        <Typography variant="body1">
          The following fields represent possible variables that can be passed
          into the template. All are optional. Some may affect layout, whereas
          others are just strings which get interpolated:
        </Typography>
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
    <Card variant="outlined">
      <Typography variant="body1">
        This file has no detected variables to change
      </Typography>
    </Card>
  );
};
