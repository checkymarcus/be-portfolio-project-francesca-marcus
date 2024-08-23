const db = require("../db/connection");

selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then((topics) => {
    return topics.rows;
  });
};

module.exports = { selectTopics };
