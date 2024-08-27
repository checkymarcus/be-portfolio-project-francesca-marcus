const db = require("../db/connection");
const fs = require("fs/promises");

selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then((topics) => {
    return topics.rows;
  });
};

const selectAPI = () => {
  return fs.readFile(__dirname + "/../endpoints.json", "utf-8").then((data) => {
    return JSON.parse(data);
  });
};

module.exports = { selectTopics, selectAPI };
