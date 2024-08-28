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

selectArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments. article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`
    )
    .then((articles) => {
      return articles.rows;
    });
};

module.exports = { selectTopics, selectAPI, selectArticle, selectArticles };
