const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");
const i18nextMiddleware = require("i18next-http-middleware");
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const { getAllViewNamesWithPath } = require("./utils/nunjucks-handling-utils");
const { executeShellScript } = require("./utils/execute-shell-script");
const { SHELL_SCRIPTS } = require("./constants");



// some of the server init e.g. translation assumes it will find files that are only cloned with this function, hence it must happen first
executeShellScript(
  SHELL_SCRIPTS.CLONE_FRONTEND_REPO_SCRIPT, [
    SHELL_SCRIPTS.CLONE_FRONTEND_REPO_DESTINATION_PARENT_FOLDER,
    SHELL_SCRIPTS.CLONE_FRONTEND_REPO_DESTINATION_FOLDER_NAME
  ]
).then((fulfilled) => {
  if (!fulfilled) process.exit(1);

  // TODO: tighten this up - only needs React app to be able to talk to it
  app.use(
    cors({
      origin: "*",
    })
  );

  // support parsing of application/json type post data
  app.use(bodyParser.json());

  //support parsing of application/x-www-form-urlencoded post data
  app.use(bodyParser.urlencoded({ extended: true }));

  // BEGIN SETUP MIRRORING (of app.js in the git submodule i.e. the original frontend repo)
  const APP_VIEWS = [
    path.join(
      __dirname,
      SHELL_SCRIPTS.CLONE_FRONTEND_REPO_DESTINATION_FOLDER_NAME,
      "/src/components"
    ),
    path.resolve(
      `${SHELL_SCRIPTS.CLONE_FRONTEND_REPO_DESTINATION_FOLDER_NAME}/node_modules/govuk-frontend/`
    ),
  ];

  app.use(
    "/assets",
    express.static(
      path.resolve(
        `${SHELL_SCRIPTS.CLONE_FRONTEND_REPO_DESTINATION_FOLDER_NAME}/node_modules/govuk-frontend/govuk/assets`
      )
    )
  );

  app.use(
    "/public",
    express.static(
      path.join(
        __dirname,
        SHELL_SCRIPTS.CLONE_FRONTEND_REPO_DESTINATION_FOLDER_NAME,
        "/dist/public"
      )
    )
  );

  const nunjucksEnv = nunjucks.configure(APP_VIEWS, {
    autoescape: true,
    express: app,
    noCache: true,
  });

  nunjucksEnv.addFilter("translate", function (key, options) {
    const translate = i18next.getFixedT(this.ctx.i18n.language);
    return translate(key, options);
  });

  nunjucksEnv.addFilter("translateEnOnly", function (key, options) {
    const translate = i18next.getFixedT("en");
    return translate(key, options);
  });

  i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
      debug: false,
      fallbackLng: ["en"],
      preload: ["en"],
      supportedLngs: ["en", "cy"],
      backend: {
        loadPath: path.join(
          __dirname,
          SHELL_SCRIPTS.CLONE_FRONTEND_REPO_DESTINATION_FOLDER_NAME,
          "/src/locales/{{lng}}/{{ns}}.json"
        ),
        allowMultiLoading: true,
      },
      detection: {
        lookupCookie: "lng",
        order: ["querystring", "cookie"],
        ignoreCase: true,
      },
    });
  app.use(i18nextMiddleware.handle(i18next));
  // END SETUP MIRRORING

  app.get("/views", (req, res) => {
    getAllViewNamesWithPath(
      path.join(
        __dirname,
        SHELL_SCRIPTS.CLONE_FRONTEND_REPO_DESTINATION_FOLDER_NAME,
        "/src/components"
      )
    ).then((results) => {
      res.send(results);
    });
  });

  app.get("/update-git", async (req, res) => {
    const success = await executeShellScript(
      SHELL_SCRIPTS.CLONE_FRONTEND_REPO_SCRIPT,
      SHELL_SCRIPTS.CLONE_FRONTEND_REPO_DESTINATION_PARENT_FOLDER,
      SHELL_SCRIPTS.CLONE_FRONTEND_REPO_DESTINATION_FOLDER_NAME
    );

    if (!success) {
      res.status(500);
    }

    res.send({
      status: success ? "Git update succeeded" : "Git update failed",
    });
  });

  app.post("/:viewFolder(*)", (req, res) => {
    let customVariables = req.body;
    for (const key in customVariables) {
      // form input body will always be strings, but njk tamplate sometimes expects boolean
      if (customVariables[key] === "true") customVariables[key] = true;
      if (customVariables[key] === "false") customVariables[key] = false;
      if (customVariables[key] === "undefined") delete customVariables[key];
    }
    res.render(`${req.params.viewFolder}.njk`, customVariables);
  });

  app.listen(5000, async () => {
    console.log("Server is running on http://localhost:5000");
  });
});


