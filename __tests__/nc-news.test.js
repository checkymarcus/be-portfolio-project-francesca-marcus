const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const app = require("../server/app");
const endpointJSON = require("../endpoints.json");
const sorted = require("jest-sorted");

const { string } = require("pg-format");

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
});
describe("GET - /api", () => {
  it("should serve up a json representation of all the available endpoints of the api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.api).toEqual(endpointJSON);
      });
  });
});

describe("GET - /api/articles/:articleId", () => {
  it("200 - GET /api/articles/1 - should return with the article identified by the article id and a response of author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        article.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles", () => {
  it("200 - GET /api/articles - should return an array of all articles with the properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  it("should add a property called comment_count which looks through the comments table and and adds a count to each article count for every comment associated with the relevant ID", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        if (articles.article_id === 1) {
          expect(articles.comment_count).toBe(11);
        } else if (articles.article_id === 9) {
          expect(articles.comment_count).toBe(2);
        } else if (articles.article_id === 5) {
          expect(articles.comment_count).toBe(5);
        } else if (articles.article_id === 6) {
          expect(articles.comment_count).toBe(1);
        } else if (articles.article_id === 3) {
          expect(articles.comment_count).toBe(2);
        }
      });
  });
  it("should order the articles by the date they were created in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("200 - GET /api/articles/article_id/comments", () => {
  it("should get all comments from a specifed article with the following properties: comment_id, votes, created_at, author, body, article_id", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((response) => {
        const articles = response.body.articleComments;
        articles.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: expect.any(Number),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
      });
  });
  it("should order the comments by most recent", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then((response) => {
        const articles = response.body.articleComments;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
