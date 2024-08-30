const {
  selectTopics,
  selectAPI,
  selectArticle,
  selectArticles,
  selectArticleComments,
  updateArticleSelect,
  deleteCommentModel,
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
  const queries = req.query;
  selectArticles(queries)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
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

const updateArticle = (req, res, next) => {
  const responseBody = req.body;
  const { article_id } = req.params;
  updateArticleSelect(responseBody, article_id)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentModel(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

const getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
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
  updateArticle,
  deleteComment,
  getUsers,
};
