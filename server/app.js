const express = require("express");
const app = express();
const {
  getTopics,
  getAPI,
  getArticleById,
  getArticles,
  getArticleComments,
} = require("../controllers/Controller");
const { psqlErrorHandler, customErrorHandler } = require("../error-handling");

app.get("/api/topics", getTopics);
app.get("/api", getAPI);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found!" });
});

app.use(psqlErrorHandler);

app.use(customErrorHandler);

module.exports = app;
