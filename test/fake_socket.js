var fs = require("fs");

exports.createConnection = function() {
  return fs.createReadStream("./test/command");
};
