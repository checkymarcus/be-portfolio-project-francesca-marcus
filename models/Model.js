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
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON comments. article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`
    )
    .then((articles) => {
      return articles.rows;
    });
};

selectArticleComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = ${article_id} ORDER BY created_at DESC`
    )
    .then((articleComments) => {
      return articleComments.rows;
    });
};

postTheCommentTo = (responseBody, article_id) => {
  const { username, body } = responseBody;
  return fs
    .readFile(`${__dirname}/../db/data/test-data/users.js`, "utf-8")
    .then((data) => {
      if (!data.includes(username)) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else {
        return db
          .query(
            `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
            [username, body, article_id]
          )
          .then((postedComment) => {
            return postedComment.rows;
          });
      }
    });
};

module.exports = {
  selectTopics,
  selectAPI,
  selectArticle,
  selectArticles,
  selectArticleComments,
  postTheCommentTo,
};
