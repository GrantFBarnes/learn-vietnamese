const express = require("express");
const router = express.Router();

const authentication = require("./authentication.js");
const main = require("./main.js");

function returnSuccess(response) {
  response.status(200).send("success");
  response.end();
}

function rejectUnauthorized(response) {
  authentication.removeTokenCookie(response);
  response.status(401).send("unauthorized");
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

// Heartbeat to make sure server is running
router.get("/api/heartbeat", (request, response) => {
  returnSuccess(response);
});

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

// Get all flash card ids
router.get("/api/cards", (request, response) => {
  returnPromiseResponse(response, main.getCardIds());
});

// Get single flash card by id
router.get("/api/card/:id", (request, response) => {
  returnPromiseResponse(response, main.getCard(request.params.id));
});

// Get all card examples by card id
router.get("/api/card-examples/:id", (request, response) => {
  returnPromiseResponse(response, main.getCardExamples(request.params.id));
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
////////////////////////////////////////////////////////////////////////////////

module.exports = router;
