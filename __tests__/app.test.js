const { TestWatcher } = require("jest");
const app = require("../app.js");
const allTestData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const endpointsInfo = require("../endpoints.json")
const sorted = require('jest-sorted');

beforeEach(() => seed(allTestData));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.topics.length).toBe(3);
        const {
          body: { topics },
        } = response;
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("/api", () => {
  test("200: responds with accurate endpoint documentation", () => {
    return request(app)
    .get("/api")
    .expect(200)
    .then((response)=>{
        expect(response.body).toEqual(endpointsInfo)
    })
  });
});

describe("api/articles/:article_id", ()=>{
  test("200: returns the article with the associated article_id", ()=>{
    //const articleId = 1
      return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body })=>{
          const {article} = body
          expect(article).toEqual([{
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          }])
      })
  });
  test("400: responds with Bad Request when given a string as article_id", () => {
    return request(app)
      .get("/api/articles/onetwothree")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: responds with Not Found when given an article_id that does not exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({body}) => {
        expect(body.error).toBe("Article Not Found");
      });
  });
})

describe("/api/articles", ()=>{
  test("200: responds with an array containing article data with comment_count but no body property", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles).toHaveLength(13);
      body.articles.forEach((article) => {
        expect(typeof article.title).toBe("string")
        expect(typeof article.topic).toBe("string")
        expect(typeof article.author).toBe("string")
        expect(typeof article.created_at).toBe("string")
        expect(typeof article.votes).toBe("number")
        expect(typeof article.article_img_url).toBe("string")
        expect(typeof article.comment_count).toBe("string")
      });
    });
  })
  test("200: responds with array of article objects sorted by created_at date property", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles).toBeSortedBy("created_at", { descending: true });
    });
  });
})

describe("/api/articles/:article_id/comments",() => {
  test("200: Successful request to an API", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  })
  test("200: responds with an array of correct length", () => {
    return request(app)
    .get("/api/articles/5/comments")
    .expect(200)
    .then(({ body }) => {
      expect(body.comments).toHaveLength(2);
    })
  })
  test("200: should respond with array of comment objects and correct properties", ()=>{
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({ body }) => {
      body.comments.forEach((comment) => {
        expect(typeof comment.comment_id).toBe("number")
        expect(typeof comment.body).toBe("string")
        expect(typeof comment.article_id).toBe("number")
        expect(typeof comment.author).toBe("string")
        expect(typeof comment.votes).toBe("number")
        expect(typeof comment.created_at).toBe("string")
      })
    })
  })
  test("200: responds with an array of comments with the most recent comments firts", ()=>{
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({ body })=>{
      expect(body.comments).toBeSortedBy("created_at", { descending: true });
    })
  })
  test("404: responds with an error message when passed in a non existing article_id", ()=>{
    return request(app)
    .get("/api/articles/900/comments")
    .expect(404)
    .then(({ body })=>{
      expect(body.msg).toBe("Not Found")})
  })
  test("400: responds with Bad Request when given a string as article_id", () => {
    return request(app)
      .get("/api/articles/threeandfour/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
})

describe("POST /api/articles/:article_id/comments", () => {
  test("should respond with a 201 status", () => {
    const testComment = {
      username: "butter_bridge",
      body: "oh no",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201);
  });
  test("201: should post the comment and respond with it's properties and values", () => {
    const testComment = {
      username: "butter_bridge",
      body: "oh no",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .expect(201)
      .send(testComment)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining([{
            comment_id: 19,
            body: "oh no",
            article_id: 1,
            author: "butter_bridge",
            votes: 0,
            created_at: expect.any(String),
          }]))
      });
  });
  test("400: should respond with a 400 status when given comment with no body", () => {
    const testComment = {
      username: "butter_bridge"
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400);
  });
  test("404: should respond with 404 when given a comment with non existing author", () => {
    const testComment = {
      username: "noname",
      body: "oh no",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(404);
  });
})