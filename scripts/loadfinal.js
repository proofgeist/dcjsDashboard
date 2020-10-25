const fmw = {
  file: "STP Dashboard.fmp12",
  server: "$",
  uploadScript: "UploadHTML",
  user: "admin",
  pass: "admin",
};

const open = require("open");
const path = require("path");

const fileUrl = `fmp://${fmw.server}/${fmw.file}?script=${fmw.uploadScript}&param=`;

const thePath = path.join(__dirname, "../", "dist", "index.html");
const url = fileUrl + encodeURIComponent(thePath);

open(url);
