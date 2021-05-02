const database = require("./database.js");

////////////////////////////////////////////////////////////////////////////////

function getTable(table) {
  return new Promise((resolve) => {
    if (!table) {
      resolve({ statusCode: 500, data: "table not provided" });
      return;
    }

    database
      .getTable(table)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to get table" });
        return;
      });
  });
}

////////////////////////////////////////////////////////////////////////////////

module.exports.getTable = getTable;
