const express = require("express");

const audio = require("./audio.js");
const authentication = require("./authentication.js");
const main = require("./main.js");

const router = express.Router();

function returnSuccess(response) {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.write(JSON.stringify({ status: "ok" }));
  response.end();
}

function rejectUnauthorized(response) {
  authentication.removeTokenCookie(response);
  response.writeHead(401, { "Content-Type": "application/json" });
  response.write(JSON.stringify({ status: "unauthorized" }));
  response.end();
}

function returnResponse(response, result) {
  response.writeHead(result.statusCode, { "Content-Type": "application/json" });
  response.write(JSON.stringify(result.data));
  response.end();
}

function returnPromiseResponse(response, promise) {
  promise
    .then((result) => {
      response.writeHead(result.statusCode, {
        "Content-Type": "application/json",
      });
      response.write(JSON.stringify(result.data));
      response.end();
    })
    .catch(() => {
      response.writeHead(500, { "Content-Type": "application/json" });
      response.write("error");
      response.end();
    });
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// APIs defined here

////////////////////////////////////////////////////////////////////////////////
// Generic

// Heartbeat to make sure server is running
router.get("/api/vietnamese/heartbeat", (request, response) => {
  returnSuccess(response);
});

// Get all data from table
router.get("/api/vietnamese/dump/:table", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.getDataDump(request.params.table));
});

////////////////////////////////////////////////////////////////////////////////
// Authorization

// Check if user is authenticated
router.get("/api/vietnamese/authenticated", (request, response) => {
  if (authentication.isAuthorized(request)) {
    returnSuccess(response);
  } else {
    rejectUnauthorized(response);
  }
});

// Get edit token if body is correct
router.post("/api/vietnamese/token", (request, response) => {
  if (authentication.requestToken(request.body)) {
    authentication.setTokenCookie(response);
    returnSuccess(response);
  } else {
    rejectUnauthorized(response);
  }
});

////////////////////////////////////////////////////////////////////////////////
// Flash Cards

// Get flash card by id
router.get("/api/vietnamese/card/:id", (request, response) => {
  returnPromiseResponse(response, main.getCard(request.params.id));
});

// Get flash card ids by category
router.get("/api/vietnamese/cards/category/:id", (request, response) => {
  returnPromiseResponse(response, main.getCardIdsByCategory(request.params.id));
});

// Get flash cards in bulk
router.post("/api/vietnamese/cards/bulk", (request, response) => {
  returnPromiseResponse(response, main.getCardsInBulk(request.body));
});

// Update flash card with new values
router.put("/api/vietnamese/card", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.updateCard(request.body));
});

// Create new flash card
router.post("/api/vietnamese/card", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.createCard(request.body));
});

// Delete flash card by id
router.delete("/api/vietnamese/card/:id", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.deleteCard(request.params.id));
});

////////////////////////////////////////////////////////////////////////////////
// Card Audio Files

// Get all card audio file ids
router.get("/api/vietnamese/audio/cards", (request, response) => {
  returnResponse(response, {
    statusCode: 200,
    data: audio.getAudioIds("cards"),
  });
});

// Get audio recording by card id
router.get("/api/vietnamese/audio/card/:id", (request, response) => {
  const file = audio.getAudio("cards", request.params.id);
  if (file) {
    response.sendFile(file);
    return;
  }
  returnResponse(response, { statusCode: 404, data: { status: "not found" } });
});

// Save card audio recording blob as a file
router.post("/api/vietnamese/audio/card/:id", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  audio.saveAudio(request, "cards", request.params.id);
  returnSuccess(response);
});

////////////////////////////////////////////////////////////////////////////////
// Flash Card Examples

// Get all examples by card id
router.get("/api/vietnamese/examples/:id", (request, response) => {
  returnPromiseResponse(response, main.getCardExamples(request.params.id));
});

// Update example with new values
router.put("/api/vietnamese/example", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.updateExample(request.body));
});

// Create new example
router.post("/api/vietnamese/example", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.createExample(request.body));
});

// Delete example by id
router.delete("/api/vietnamese/example/:id", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.deleteExample(request.params.id));
});

////////////////////////////////////////////////////////////////////////////////
// Example Audio Files

// Get all example audio file ids
router.get("/api/vietnamese/audio/examples", (request, response) => {
  returnResponse(response, {
    statusCode: 200,
    data: audio.getAudioIds("examples"),
  });
});

// Get audio recording by example id
router.get("/api/vietnamese/audio/example/:id", (request, response) => {
  const file = audio.getAudio("examples", request.params.id);
  if (file) {
    response.sendFile(file);
    return;
  }
  returnResponse(response, { statusCode: 404, data: { status: "not found" } });
});

// Save example audio recording blob as a file
router.post("/api/vietnamese/audio/example/:id", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  audio.saveAudio(request, "examples", request.params.id);
  returnSuccess(response);
});

////////////////////////////////////////////////////////////////////////////////
// Categories

// Get all categories
router.get("/api/vietnamese/categories", (request, response) => {
  returnPromiseResponse(response, main.getCategories());
});

// Get category by id
router.get("/api/vietnamese/category/:id", (request, response) => {
  returnPromiseResponse(response, main.getCategory(request.params.id));
});

// Update category with new values
router.put("/api/vietnamese/category", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.updateCategory(request.body));
});

// Create new category
router.post("/api/vietnamese/category", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.createCategory(request.body));
});

// Delete category by id
router.delete("/api/vietnamese/category/:id", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.deleteCategory(request.params.id));
});

////////////////////////////////////////////////////////////////////////////////
// Flash Card Categories

// Create new flash card category relationship
router.post("/api/vietnamese/card-category", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.createCardCategory(request.body));
});

// Delete flash card category by id
router.delete("/api/vietnamese/card-category/:id", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.deleteCardCategory(request.params.id));
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = router;
