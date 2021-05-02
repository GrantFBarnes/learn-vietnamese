const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "tu",
  password: process.env.MYSQL_TU_PASSWORD,
  database: "learn_vietnamese",
});

function getTable(table) {
  return new Promise((resolve, reject) => {
    if (!table) {
      reject("table not provided");
      return;
    }

    connection.query("SELECT * FROM " + table, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
}

module.exports.getTable = getTable;
