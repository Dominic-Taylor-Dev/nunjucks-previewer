const path = require("path");

const SHELL_SCRIPTS_ROOT = path.join(__dirname, "utils");

const SHELL_SCRIPTS = {
  CLONE_FRONTEND_REPO_SCRIPT: SHELL_SCRIPTS_ROOT + "/clone-di-auth-frontend.sh",
  CLONE_FRONTEND_REPO_DESTINATION_PARENT_FOLDER: __dirname,
  CLONE_FRONTEND_REPO_DESTINATION_FOLDER_NAME:
    "di-authentication-frontend-clone",
};

module.exports = {
  SHELL_SCRIPTS,
};
