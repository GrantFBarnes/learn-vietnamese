const audio = require("./audio.js");
const database = require("./database.js");

////////////////////////////////////////////////////////////////////////////////
// Generic

function getDataDump(table) {
  return new Promise((resolve) => {
    if (!table) {
      resolve({ statusCode: 500, data: "table not provided" });
      return;
    }

    if (table !== "cards" && table !== "examples") {
      resolve({ statusCode: 500, data: "table not valid" });
      return;
    }

    database
      .select("*", table, null, null)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to get data" });
        return;
      });
  });
}

////////////////////////////////////////////////////////////////////////////////
// Cards

function getCardIds() {
  return new Promise((resolve) => {
    database
      .select("id", "cards", null, null)
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
      .select("*", "cards", "id", id)
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

function updateCard(data) {
  return new Promise((resolve) => {
    if (!data) {
      resolve({ statusCode: 500, data: "data not provided" });
      return;
    }

    if (!data.id) {
      resolve({ statusCode: 500, data: "data not valid" });
      return;
    }

    database
      .update("cards", data)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to update card" });
        return;
      });
  });
}

function createCard(data) {
  return new Promise((resolve) => {
    if (!data) {
      resolve({ statusCode: 500, data: "data not provided" });
      return;
    }

    database
      .create("cards", data)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to create card" });
        return;
      });
  });
}

function deleteCard(id) {
  return new Promise((resolve) => {
    if (!id) {
      resolve({ statusCode: 500, data: "id not provided" });
      return;
    }

    // Delete any audio file associated with the card
    audio.deleteAudio("cards", id);

    database
      .deleteById("cards", id)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to delete card" });
        return;
      });
  });
}

////////////////////////////////////////////////////////////////////////////////
// Card Examples

function getCardExamples(id) {
  return new Promise((resolve) => {
    if (!id) {
      resolve({ statusCode: 500, data: "id not provided" });
      return;
    }

    database
      .select("*", "examples", "card", id)
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

function updateExample(data) {
  return new Promise((resolve) => {
    if (!data) {
      resolve({ statusCode: 500, data: "data not provided" });
      return;
    }

    if (!data.id) {
      resolve({ statusCode: 500, data: "data not valid" });
      return;
    }

    database
      .update("examples", data)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to update example" });
        return;
      });
  });
}

function createExample(data) {
  return new Promise((resolve) => {
    if (!data) {
      resolve({ statusCode: 500, data: "data not provided" });
      return;
    }

    if (!data.card) {
      resolve({ statusCode: 500, data: "data not valid" });
      return;
    }

    database
      .create("examples", data)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to create example" });
        return;
      });
  });
}

function deleteExample(id) {
  return new Promise((resolve) => {
    if (!id) {
      resolve({ statusCode: 500, data: "id not provided" });
      return;
    }

    // Delete any audio file associated with the example
    audio.deleteAudio("examples", id);

    database
      .deleteById("examples", id)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to delete example" });
        return;
      });
  });
}

////////////////////////////////////////////////////////////////////////////////

module.exports.getDataDump = getDataDump;

module.exports.getCardIds = getCardIds;
module.exports.getCard = getCard;
module.exports.updateCard = updateCard;
module.exports.createCard = createCard;
module.exports.deleteCard = deleteCard;

module.exports.getCardExamples = getCardExamples;
module.exports.updateExample = updateExample;
module.exports.createExample = createExample;
module.exports.deleteExample = deleteExample;
