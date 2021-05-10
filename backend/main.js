const database = require("./database.js");

////////////////////////////////////////////////////////////////////////////////

function getCardIds() {
  return new Promise((resolve) => {
    database
      .runQuery("id", "cards", null, null)
      .then((result) => {
        let ids = [];
        for (let i in result) {
          if (!result[i].id) continue;
          ids.push(result[i].id);
        }
        resolve({ statusCode: 200, data: ids });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to get card ids" });
        return;
      });
  });
}

function getCard(id) {
  return new Promise((resolve) => {
    if (!id) {
      resolve({ statusCode: 500, data: "id not provided" });
      return;
    }

    const fail = { statusCode: 400, data: "failed to get card: " + id };
    database
      .runQuery("*", "cards", "id", id)
      .then((result) => {
        if (result.length !== 1) {
          resolve(fail);
          return;
        }
        resolve({ statusCode: 200, data: result[0] });
        return;
      })
      .catch(() => {
        resolve(fail);
        return;
      });
  });
}

function getCardExamples(id) {
  return new Promise((resolve) => {
    if (!id) {
      resolve({ statusCode: 500, data: "id not provided" });
      return;
    }

    database
      .runQuery("*", "card_examples", "card", id)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
        return;
      })
      .catch(() => {
        resolve({
          statusCode: 400,
          data: "failed to get examples for card: " + id,
        });
        return;
      });
  });
}

function getDataDump(table) {
  return new Promise((resolve) => {
    if (!table) {
      resolve({ statusCode: 500, data: "table not provided" });
      return;
    }

    if (table !== "cards" && table !== "card_examples") {
      resolve({ statusCode: 500, data: "table not valid" });
      return;
    }

    database
      .runQuery("*", table, null, null)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to data" });
        return;
      });
  });
}

////////////////////////////////////////////////////////////////////////////////

module.exports.getCardIds = getCardIds;
module.exports.getCard = getCard;
module.exports.getCardExamples = getCardExamples;
module.exports.getDataDump = getDataDump;
