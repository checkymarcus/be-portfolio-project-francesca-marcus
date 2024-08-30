const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const app = require("../app");
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
  it("should return 404 - not found - when passed an ID that does not exist in the database", () => {
    return request(app)
      .get("/api/articles/4000")
      .expect(404)
      .then((response) => {
        const errorMsg = response.body.msg;
        expect(errorMsg).toBe("Not found");
      });
  });
  it("should return 400 - bad request - when passed an invalid ID", () => {
    return request(app)
      .get("/api/articles/invalid-id")
      .expect(400)
      .then((response) => {
        const errorMsg = response.body.msg;
        expect(errorMsg).toBe("Bad request");
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
  it("should return a 400 error for an invalid sort_by column", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_column")
      .expect(400)
      .then((response) => {
        const errMsg = response.body.msg;
        expect(errMsg).toBe("Bad Request - Invalid sort_by column");
      });
  });
  it("should return a 400 error for an invalid order value", () => {
    return request(app)
      .get("/api/articles?order=invalid_order")
      .expect(400)
      .then((response) => {
        const errMsg = response.body.msg;
        expect(errMsg).toBe("Bad Request - Invalid order query");
      });
  });
});
describe("200 - GET /api/articles/:article_id/comments", () => {
  it("should get all comments from a specifed article with the following properties: comment_id, votes, created_at, author, body, article_id", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((response) => {
        const articleComments = response.body.articleComments;
        articleComments.forEach((comment) => {
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
        const articleComments = response.body.articleComments;
        expect(articleComments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("should return 404 - not found - when passed a valid id that doesn't exist within the database", () => {
    return request(app)
      .get("/api/articles/4000/comments")
      .expect(404)
      .then((response) => {
        const errorMsg = response.body.msg;
        expect(errorMsg).toBe("Not Found");
      });
  });
  it("should return 400 - bad request - when passed an invalid id", () => {
    return request(app)
      .get("/api/articles/invalid-id/comments")
      .expect(400)
      .then((response) => {
        const errorMsg = response.body.msg;
        expect(errorMsg).toBe("Bad Request");
      });
  });
});

describe("201 - POST - /api/articles/:article_id/comments", () => {
  it("should respond with a 201 response and add a comment to an article with the following properties: username, body. And should respond with the posted comment", () => {
    const newCommentObj = {
      username: "rogersop",
      body: "do you like my body?",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newCommentObj)
      .expect(201)
      .then((response) => {
        const postedComment = response.body.newComment;
        expect(postedComment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: expect.any(Number),
            body: expect.any(String),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
});
it("should respond with a 404 'not found' error if the username trying to be posted does not currently exist within the users database", () => {
  const newCommentObj = {
    username: "checkymarcus",
    body: "do you like my body?",
  };
  return request(app)
    .post("/api/articles/2/comments")
    .send(newCommentObj)
    .expect(404)
    .then((response) => {
      const errorMsg = response.body.msg;
      expect(errorMsg).toBe("Username not found in database");
    });
});
it("should respond with a 400 Bad Request if the article_id is invalid", () => {
  return request(app)
    .post("/api/articles/invalid-id/comments")
    .expect(400)
    .then((response) => {
      const errorMsg = response.body.msg;
      expect(errorMsg).toBe("Bad Request - Invalid ID");
    });
});
it("should respond with a 404 'not found' error if the ID is a valid number but doesn't exist within the database yet", () => {
  return request(app)
    .post("/api/articles/4000/comments")
    .expect(404)
    .then((response) => {
      const errorMsg = response.body.msg;
      const status = response.status;
      expect(status).toBe(404);
      expect(errorMsg).toBe("Not Found");
    });
});
describe("200 - PATCH - /api/articles/:article_id", () => {
  it("should update the articles vote count by the amount sent", () => {
    const originalArticle = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    const updateVotes = { incVotes: 5 };
    return request(app)
      .patch("/api/articles/1")
      .expect(200)
      .send(updateVotes)
      .then((response) => {
        const updatedByVotes = response.body.updatedArticle;
        expect(updatedByVotes.votes).toBe(105);
        expect(originalArticle.votes).toBe(100);
      });
  });
  it("should respond with a 400 Bad Request if the article_id is invalid", () => {
    return request(app)
      .patch("/api/articles/invalid-id/")
      .expect(400)
      .then((response) => {
        const errorMsg = response.body.msg;
        expect(errorMsg).toBe("Bad Request - Invalid ID");
      });
  });
  it("should respond with a 404 'not found' error if article_id does not exist", () => {
    return request(app)
      .post("/api/articles/40000")
      .expect(404)
      .then((response) => {
        const errorMsg = response.body.msg;
        expect(errorMsg).toBe("Route not found!");
      });
  });
});
describe("204 - DELETE - /api/comments/:comment_id", () => {
  it("should delete the comment at the comment_id and return 204 no content", () => {
    return request(app)
      .delete("/api/comments/8")
      .expect(204)
      .then((response) => {
        const comment = response.body;
        expect(comment).toEqual({});
      });
  });
  it("should respond with a 404 if the comment_id is not found in the comments database", () => {
    return request(app)
      .delete("/api/comments/83485347")
      .expect(404)
      .then((response) => {
        const errorMsg = response.body.msg;
        expect(errorMsg).toBe("Comment not found");
      });
  });
  it("should respond with a 400 if the comment_id is invalid", () => {
    return request(app)
      .delete("/api/comments/i-am-not-a-number")
      .expect(400)
      .then((response) => {
        const errorMsg = response.body.msg;
        expect(errorMsg).toBe("Bad Request - Invalid ID");
      });
  });
});
describe("200 - GET -/api/users", () => {
  it("should respond with an array of objects with the following properties: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body.users;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});
