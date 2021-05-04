const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "tu",
  password: process.env.MYSQL_TU_PASSWORD,
  database: "learn_vietnamese",
});

function runQuery(columns, table, field, value) {
  return new Promise((resolve, reject) => {
    if (!columns) {
      reject("columns not provided");
      return;
    }

    if (!table) {
      reject("table not provided");
      return;
    }

    let query = "SELECT " + columns + " FROM " + table;
    if (field && value) {
      query += " WHERE " + field + " = " + value;
    }

    connection.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
}

module.exports.runQuery = runQuery;
