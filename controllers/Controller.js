const {
  selectTopics,
  selectAPI,
  selectArticle,
  selectArticles,
  selectArticleComments,
} = require("../models/Model");

const getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

const getAPI = (req, res, next) => {
  selectAPI()
    .then((data) => {
      const api = JSON.parse(data);
      res.status(200).send({ api });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

const getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleComments(article_id)
    .then((articleComments) => {
      res.status(200).send({ articleComments });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
const postComment = (req, res, next) => {
  const responseBody = req.body;
  const { article_id } = req.params;
  postTheCommentTo(responseBody, article_id)
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getTopics,
  getAPI,
  getArticleById,
  getArticles,
  getArticleComments,
  postComment,
};
