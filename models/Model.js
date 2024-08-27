const db = require("../db/connection");
const fs = require("fs/promises");

selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then((topics) => {
    return topics.rows;
  });
};

selectAPI = () => {
  return fs.readFile(__dirname + "/../endpoints.json", "utf-8").then((data) => {
    return data;
  });
};

selectArticle = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = ${article_id}`)
    .then((articles) => {
      return articles.rows;
    });
};

module.exports = { selectTopics, selectAPI, selectArticle };
