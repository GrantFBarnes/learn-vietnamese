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

    const tables = new Set([
      "cards",
      "examples",
      "categories",
      "cards_categories",
      "connections",
    ]);
    if (!tables.has(table)) {
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

function getCard(id) {
  return new Promise((resolve) => {
    if (!id) {
      resolve({ statusCode: 500, data: "id not provided" });
      return;
    }

    const fail = { statusCode: 400, data: "failed to get card: " + id };
    database
      .select("*", "cards", "id", [id])
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

function getCardIdsByCategory(category_id) {
  return new Promise((resolve) => {
    database
      .innerJoin(
        ["id"],
        ["card_id"],
        "cards",
        "id",
        ["category"],
        ["category_id"],
        "cards_categories",
        "card"
      )
      .then((result) => {
        category_id = parseInt(category_id);
        let ids = new Set();
        for (let i in result) {
          const row = result[i];
          if (category_id && category_id !== row.category_id) continue;
          ids.add(row.card_id);
        }
        resolve({ statusCode: 200, data: [...ids] });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to get card ids" });
        return;
      });
  });
}

function getCardsInBulk(ids) {
  return new Promise((resolve) => {
    if (!ids) {
      resolve({ statusCode: 500, data: "ids not provided" });
      return;
    }

    const fail = { statusCode: 400, data: "failed to get cards" };
    database
      .select("*", "cards", "id", ids)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
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
      .select("*", "examples", "card", [id])
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
// Categories

function getCategories() {
  return new Promise((resolve) => {
    database
      .select("*", "categories", null, null)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to get categories" });
        return;
      });
  });
}

function getCategory(id) {
  return new Promise((resolve) => {
    if (!id) {
      resolve({ statusCode: 500, data: "id not provided" });
      return;
    }

    const fail = { statusCode: 400, data: "failed to get category: " + id };
    database
      .select("*", "categories", "id", [id])
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

function updateCategory(data) {
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
      .update("categories", data)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to update category" });
        return;
      });
  });
}

function createCategory(data) {
  return new Promise((resolve) => {
    if (!data) {
      resolve({ statusCode: 500, data: "data not provided" });
      return;
    }

    database
      .create("categories", data)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to create category" });
        return;
      });
  });
}

function deleteCategory(id) {
  return new Promise((resolve) => {
    if (!id) {
      resolve({ statusCode: 500, data: "id not provided" });
      return;
    }

    database
      .deleteById("categories", id)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to delete category" });
        return;
      });
  });
}

////////////////////////////////////////////////////////////////////////////////
// Flash Card Categories

function createCardCategory(data) {
  return new Promise((resolve) => {
    if (!data) {
      resolve({ statusCode: 500, data: "data not provided" });
      return;
    }

    database
      .create("cards_categories", data)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to create card category" });
        return;
      });
  });
}

function deleteCardCategory(id) {
  return new Promise((resolve) => {
    if (!id) {
      resolve({ statusCode: 500, data: "id not provided" });
      return;
    }

    database
      .deleteById("cards_categories", id)
      .then((result) => {
        resolve({ statusCode: 200, data: result });
        return;
      })
      .catch(() => {
        resolve({ statusCode: 400, data: "failed to delete card category" });
        return;
      });
  });
}

////////////////////////////////////////////////////////////////////////////////

module.exports.getDataDump = getDataDump;

module.exports.getCard = getCard;
module.exports.getCardIdsByCategory = getCardIdsByCategory;
module.exports.getCardsInBulk = getCardsInBulk;
module.exports.updateCard = updateCard;
module.exports.createCard = createCard;
module.exports.deleteCard = deleteCard;

module.exports.getCardExamples = getCardExamples;
module.exports.updateExample = updateExample;
module.exports.createExample = createExample;
module.exports.deleteExample = deleteExample;

module.exports.getCategories = getCategories;
module.exports.getCategory = getCategory;
module.exports.updateCategory = updateCategory;
module.exports.createCategory = createCategory;
module.exports.deleteCategory = deleteCategory;

module.exports.createCardCategory = createCardCategory;
module.exports.deleteCardCategory = deleteCardCategory;
