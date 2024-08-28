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
const articles = require("../db/data/test-data/articles");

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
        const expectedArticles = [
          {
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: 1594329060000,
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
          {
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: 1602828180000,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
          {
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: 1604394720000,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
          {
            title: "Student SUES Mitch!",
            topic: "mitch",
            author: "rogersop",
            body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
            created_at: 1588731240000,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
          {
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: 1596464040000,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
          {
            title: "A",
            topic: "mitch",
            author: "icellusedkars",
            body: "Delicious tin of cat food",
            created_at: 1602986400000,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
          {
            title: "Z",
            topic: "mitch",
            author: "icellusedkars",
            body: "I was hungry.",
            created_at: 1578406080000,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
          {
            title: "Does Mitch predate civilisation?",
            topic: "mitch",
            author: "icellusedkars",
            body: "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
            created_at: 1587089280000,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
          {
            title: "They're not exactly dogs, are they?",
            topic: "mitch",
            author: "butter_bridge",
            body: "Well? Think about it.",
            created_at: 1591438200000,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
          {
            title: "Seven inspirational thought leaders from Manchester UK",
            topic: "mitch",
            author: "rogersop",
            body: "Who are we kidding, there is only one, and it's Mitch!",
            created_at: 1589433300000,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
          {
            title: "Am I a cat?",
            topic: "mitch",
            author: "icellusedkars",
            body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
            created_at: 1579126860000,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
          {
            title: "Moustache",
            topic: "mitch",
            author: "butter_bridge",
            body: "Have you seen the size of that thing?",
            created_at: 1602419040000,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
          {
            title: "Another article about Mitch",
            topic: "mitch",
            author: "butter_bridge",
            body: "There will never be enough articles about Mitch!",
            created_at: 1602419040000,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
        ];
        expect(articles).toMatchObject(expectedArticles);
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
        const expectedArticles = [
          {
            author: "icellusedkars",
            title: "Eight pug gifs that remind me of mitch",
            article_id: 3,
            topic: "mitch",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "2",
          },
          {
            author: "icellusedkars",
            title: "A",
            article_id: 6,
            topic: "mitch",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "1",
          },
          {
            author: "icellusedkars",
            title: "Sony Vaio; or, The Laptop",
            article_id: 2,
            topic: "mitch",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
          {
            author: "butter_bridge",
            title: "Moustache",
            article_id: 12,
            topic: "mitch",
            created_at: "2020-10-11T11:24:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
          {
            author: "butter_bridge",
            title: "Another article about Mitch",
            article_id: 13,
            topic: "mitch",
            created_at: "2020-10-11T11:24:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
          {
            author: "rogersop",
            title: "UNCOVERED: catspiracy to bring down democracy",
            article_id: 5,
            topic: "cats",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "2",
          },
          {
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            topic: "mitch",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "11",
          },
          {
            author: "butter_bridge",
            title: "They're not exactly dogs, are they?",
            article_id: 9,
            topic: "mitch",
            created_at: "2020-06-06T09:10:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "2",
          },
          {
            author: "rogersop",
            title: "Seven inspirational thought leaders from Manchester UK",
            article_id: 10,
            topic: "mitch",
            created_at: "2020-05-14T04:15:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
          {
            author: "rogersop",
            title: "Student SUES Mitch!",
            article_id: 4,
            topic: "mitch",
            created_at: "2020-05-06T01:14:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
          {
            author: "icellusedkars",
            title: "Does Mitch predate civilisation?",
            article_id: 8,
            topic: "mitch",
            created_at: "2020-04-17T01:08:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
          {
            author: "icellusedkars",
            title: "Am I a cat?",
            article_id: 11,
            topic: "mitch",
            created_at: "2020-01-15T22:21:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
          {
            author: "icellusedkars",
            title: "Z",
            article_id: 7,
            topic: "mitch",
            created_at: "2020-01-07T14:08:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
        ];
        expect(articles).toMatchObject(expectedArticles);
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
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
