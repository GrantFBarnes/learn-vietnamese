const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "tu",
  password: process.env.MYSQL_TU_PASSWORD,
  database: "learn_vietnamese",
});

function run(command) {
  return new Promise((resolve, reject) => {
    connection.query(command, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
}

function select(columns, table, field, value) {
  return new Promise((resolve, reject) => {
    if (!columns) {
      reject("columns not provided");
      return;
    }

    if (!table) {
      reject("table not provided");
      return;
    }

    let command = "SELECT " + columns + " FROM " + table;
    if (field && value) {
      command += " WHERE " + field + " = " + value;
    }

    run(command)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

function update(table, data) {
  return new Promise((resolve, reject) => {
    if (!table) {
      reject("table not provided");
      return;
    }

    if (!data) {
      reject("data not provided");
      return;
    }

    if (!data.id) {
      reject("data not valid");
      return;
    }

    let command = "UPDATE " + table + " SET ";
    let otherField = false;
    for (let f in data) {
      if (f === "id") continue;
      command += f + ' = "' + data[f] + '", ';
      otherField = true;
    }

    if (!otherField) {
      reject("no updates provided");
      return;
    }

    command = command.slice(0, -2);
    command += " WHERE id = " + data.id;

    run(command)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

function create(table, data) {
  return new Promise((resolve, reject) => {
    if (!table) {
      reject("table not provided");
      return;
    }

    if (!data) {
      reject("data not provided");
      return;
    }

    let fields = [];
    let values = [];
    for (let f in data) {
      if (f === "id") continue;
      fields.push(f);
      if (typeof data[f] === "string") {
        values.push(JSON.stringify(data[f]));
      } else {
        values.push(data[f]);
      }
    }

    run("INSERT INTO " + table + " (" + fields + ") VALUES (" + values + ")")
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

function deleteById(table, id) {
  return new Promise((resolve, reject) => {
    if (!table) {
      reject("table not provided");
      return;
    }

    if (!id) {
      reject("id not provided");
      return;
    }

    run("DELETE FROM " + table + " WHERE id = " + id)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

module.exports.select = select;
module.exports.update = update;
module.exports.create = create;
module.exports.deleteById = deleteById;
