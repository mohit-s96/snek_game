const fs = require("fs");
const ghpages = require("gh-pages");
const { exec } = require("child_process");

exec("yarn build", (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
  }
  console.log(`stdout: ${stdout}`);

  readWriteSync();

  ghpages.publish("dist", function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Success");
    }
  });
});
function readWriteSync() {
  try {
    let data = fs.readFileSync("dist/index.html", "utf-8");

    let newValue = data.replace(/="\//gm, '="');

    fs.writeFileSync("dist/index.html", newValue, "utf-8");

    console.log("Updated index.html");
  } catch (e) {
    console.log(e);
  }
}