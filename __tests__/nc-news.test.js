const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const { string } = require("pg-format");
const app = require("../server/app");

beforeEach(() => {
  return seed({ commentData, topicData, articleData, userData });
});

afterAll(() => {
  return db.end();
});

describe("GET - /api/topics", () => {
  it("200 - GET /api/topics - should respond with a 200 status code and an array of topic objects, each with a property of 'slug' and 'description;", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  it("404 - GET /api/wrongEndpoint - should respond with a 404 status code when the endpoint does not exist", () => {
    return request(app)
      .get("/api/wrongEndpoint")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Route not found!");
      });
  });
});
