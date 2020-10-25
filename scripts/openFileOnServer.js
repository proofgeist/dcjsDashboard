const open = require("open");
const fmw = {
  file: "STP Dashboard.fmp12",
  server: "$",
  uploadScript: "UploadHTML",
  user: "admin",
  pass: "admin",
};

const fileUrl = `fmp://${fmw.user}:${fmw.pass}@${fmw.server}/${fmw.file}`;

open(fileUrl);
