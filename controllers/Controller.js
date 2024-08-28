const {
  selectTopics,
  selectAPI,
  selectArticle,
  selectArticles,
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

module.exports = { getTopics, getAPI, getArticleById, getArticles };
