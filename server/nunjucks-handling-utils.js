const fs = require("fs");
const path = require("path");

const allViewNamesWithPathCache = [];
const viewNamesExcludeList = ["layout", "footer"];

function extractVariablesFromNjKText(njkAsString) {
  const variables = [];
  const stringsToIdentifyVariablesWhichDontNeedSubstituting = [
    "extends",
    "pages.", // TODO: read these dynamically from translation.json
    "general.",
    "error.",
    "abTestPages.",
    "csrfToken",
    "govukButton", // TODO: imported components dynamically from frontend node module
    "govukInsetText",
    "govukNotificationBanner",
    "| safe",
    "import",
  ];

  // template/interpolation type variables
  njkAsString.split("{{").forEach((variableBeginning) => {
    if (
      !stringsToIdentifyVariablesWhichDontNeedSubstituting.some((string) =>
        variableBeginning.includes(string)
      )
    ) {
      variables.push(variableBeginning.split("}}")[0].trim());
    }
  });

  // logic controlling variables
  njkAsString.split("{% if").forEach((ifStatementBeginning) => {
    const statementWithoutNot = ifStatementBeginning.replace(" not ", "");

    if (
      !stringsToIdentifyVariablesWhichDontNeedSubstituting.some((string) =>
        statementWithoutNot.includes(string)
      )
    ) {
      variables.push(statementWithoutNot.split(" ")[1]);
    }
  });

  // deduplicate as some variables may be used multiple times in a single template
  return Array.from(new Set(variables));
}

exports.getAllViewNamesWithPath = async function (root) {
  if (allViewNamesWithPathCache.length) return allViewNamesWithPathCache;

  const queue = [root];

  while (queue.length > 0) {
    const currentPath = queue.shift();
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stats = fs.lstatSync(filePath);

      if (stats.isDirectory()) {
        queue.push(filePath);
      } else if (
        path.extname(filePath) === ".njk" &&
        path.basename(filePath).charAt() !== "_" &&
        !viewNamesExcludeList.includes(path.basename(currentPath))
      ) {
        const fileAsText = fs.readFileSync(filePath).toString();
        const fileVariables = extractVariablesFromNjKText(fileAsText);
        allViewNamesWithPathCache.push({
          directory: path.basename(currentPath),
          fileName: path.parse(filePath).name,
          filePath: filePath.split("/src/components/").pop().split(".")[0],
          fileAsText: fileAsText,
          fileVariables,
        });
      }
    }
  }

  return allViewNamesWithPathCache;
};
