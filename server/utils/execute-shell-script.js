const util = require("util");
const exec = util.promisify(require("child_process").exec);

const executeShellScript = async (scriptName, arguments) => {
  try {
    const { stdout, stderr } = await exec(
      `sh ${scriptName} ${arguments.join(" ")}`
    );
    console.log("stdout:", stdout);
    console.log("stderr:", stderr);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

module.exports = {
  executeShellScript,
};
