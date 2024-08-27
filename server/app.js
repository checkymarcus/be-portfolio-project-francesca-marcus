const express = require("express");
const app = express();
const { getTopics, getAPI } = require("../controllers/topicsController");
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
  postErrorHandler,
} = require("../error-handling");

app.get("/api/topics", getTopics);
app.get("/api", getAPI);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found!" });
});

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(postErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
