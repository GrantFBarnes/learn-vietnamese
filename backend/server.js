const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const http = require("http");
const parser = require("body-parser");
const session = require("express-session");

const appName = "learn-vietnamese";
const staticBuildFile = "./dist/" + appName;

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(express.static(staticBuildFile));

app.use(parser.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(require("./api"));

app.use(
  session({
    name: appName,
    secret: appName + "-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(parser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

////////////////////////////////////////////////////////////////////////////////
app.get("*", function (request, response) {
  response.sendFile("index.html", { root: staticBuildFile });
});

////////////////////////////////////////////////////////////////////////////////

function main() {
  const server = http.createServer(app);
  if (process.env.GFB_HOSTING_ENV === "prod") {
    server.listen(80);
  } else {
    server.listen(8080);
    console.log("Running local environment on http://localhost:8080");
  }
}

main();
