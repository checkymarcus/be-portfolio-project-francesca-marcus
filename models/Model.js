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
  if (isNaN(Number(article_id))) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = ${article_id}`)
    .then((articles) => {
      if (articles.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
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
  if (isNaN(Number(article_id))) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = ${article_id} ORDER BY created_at DESC`
    )
    .then((articleComments) => {
      if (articleComments.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return articleComments.rows;
      }
    });
};

postTheCommentTo = (responseBody, article_id) => {
  const { username, body } = responseBody;
  if (isNaN(Number(article_id))) {
    return Promise.reject({ status: 400, msg: "Bad Request - Invalid ID" });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = ${article_id}`)
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    })
    .then(() => {
      return db
        .query(`SELECT * FROM users WHERE username = $1`, [username])
        .then((result) => {
          if (result.rows.length === 0) {
            return Promise.reject({
              status: 404,
              msg: "Username not found in database",
            });
          } else {
            return db
              .query(
                `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
                [username, body, article_id]
              )
              .then((postedComment) => {
                return postedComment.rows[0];
              });
          }
        });
    });
};

updateArticleSelect = (responseBody, article_id) => {
  const { incVotes } = responseBody;
  if (isNaN(Number(article_id))) {
    return Promise.reject({ status: 400, msg: "Bad Request - Invalid ID" });
  }

  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [incVotes, article_id]
    )
    .then((updatedArticle) => {
      return updatedArticle.rows;
    });
};

deleteCommentModel = (comment_id) => {
  if (isNaN(Number(comment_id))) {
    return Promise.reject({ status: 400, msg: "Bad Request - Invalid ID" });
  }
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
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
  updateArticleSelect,
  deleteCommentModel,
};
