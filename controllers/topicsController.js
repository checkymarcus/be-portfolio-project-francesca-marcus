const { selectTopics, selectAPI } = require("../models/topicsModel");

const getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

const getAPI = (req, res, next) => {
  selectAPI()
    .then((api) => {
      console.log(api, "hello from the controller");
      res.status(200).send({ api });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics, getAPI };
