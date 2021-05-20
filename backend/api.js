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
router.get("/api/heartbeat", (request, response) => {
  returnSuccess(response);
});

// Get all data from table
router.get("/api/dump/:table", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.getDataDump(request.params.table));
});

////////////////////////////////////////////////////////////////////////////////
// Authorization

// Check if user is authenticated
router.get("/api/authenticated", (request, response) => {
  if (authentication.isAuthorized(request)) {
    returnSuccess(response);
  } else {
    rejectUnauthorized(response);
  }
});

// Get edit token if body is correct
router.post("/api/token", (request, response) => {
  if (authentication.requestToken(request.body)) {
    authentication.setTokenCookie(response);
    returnSuccess(response);
  } else {
    rejectUnauthorized(response);
  }
});

////////////////////////////////////////////////////////////////////////////////
// Flash Cards

// Get all flash card ids
router.get("/api/cards", (request, response) => {
  returnPromiseResponse(response, main.getCardIds());
});

// Get flash card by id
router.get("/api/card/:id", (request, response) => {
  returnPromiseResponse(response, main.getCard(request.params.id));
});

// Update flash card with new values
router.put("/api/card", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.updateCard(request.body));
});

// Create new flash card
router.post("/api/card", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.createCard(request.body));
});

// Delete flash card by id
router.delete("/api/card/:id", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.deleteCard(request.params.id));
});

////////////////////////////////////////////////////////////////////////////////
// Card Audio Files

// Get all card audio file ids
router.get("/api/cards/audio", (request, response) => {
  returnResponse(response, { statusCode: 200, data: audio.getCardIds() });
});

// Get audio recording by card id
router.get("/api/card/:id/audio", (request, response) => {
  const file = audio.getCard(request.params.id);
  if (file) {
    response.sendFile(file);
    return;
  }
  returnResponse(response, { statusCode: 404, data: { status: "not found" } });
});

// Save card audio recording blob as a file
router.post("/api/card/:id/audio", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  audio.saveCard(request, request.params.id);
  returnSuccess(response);
});

////////////////////////////////////////////////////////////////////////////////
// Flash Card Examples

// Get all examples by card id
router.get("/api/examples/:id", (request, response) => {
  returnPromiseResponse(response, main.getCardExamples(request.params.id));
});

// Update example with new values
router.put("/api/example", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.updateExample(request.body));
});

// Create new example
router.post("/api/example", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.createExample(request.body));
});

// Delete example by id
router.delete("/api/example/:id", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.deleteExample(request.params.id));
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = router;
