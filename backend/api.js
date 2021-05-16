const express = require("express");
const fs = require("fs");
const path = require("path");

const authentication = require("./authentication.js");
const main = require("./main.js");

const audioDir = __dirname + "/../db/audio_files/";
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

// Get audio recording by card id
router.get("/api/audio/:id", (request, response) => {
  const file = path.join(audioDir + request.params.id + ".mp3");
  if (fs.existsSync(file)) {
    response.sendFile(file);
  } else {
    returnResponse(response, {
      statusCode: 404,
      data: { status: "not found" },
    });
  }
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

// Update flash card with new values
router.put("/api/card", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  returnPromiseResponse(response, main.updateCard(request.body));
});

// Save audio recording blob as a file
router.post("/api/audio/:id", (request, response) => {
  if (!authentication.isAuthorized(request)) {
    rejectUnauthorized(response);
    return;
  }
  request.pipe(fs.createWriteStream(audioDir + request.params.id + ".mp3"));
  returnSuccess(response);
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = router;
