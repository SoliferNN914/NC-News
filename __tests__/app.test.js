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
      return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body })=>{
          const {article} = body
          expect(article).toEqual([
          {
            article_id: 2,
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
            created_at: '2020-10-16T05:03:00.000Z',
            votes: 0,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            comment_count: '0'
          }
          ])
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
  test("200: responds with array of articles filtered by the topic mitch", ()=>{
    return request(app)
    .get("/api/articles?topic=mitch")
    .expect(200)
    .then(({ body })=>{
      expect(body.articles[0].topic).toBe("mitch");
      expect(Array.isArray(body.articles)).toBe(true);
    })
  })
  test("400: should return 400 status when given an invalid topic", () => {
    return request(app)
    .get("/api/articles?topic=1234")
    .expect(404);
  })
  test("404: should return 404 status when given a non existing topic", () => {
    return request(app)
    .get("/api/articles?topic=doesnotexist")
    .expect(404);
  })
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

describe("PATCH /api/articles/:article_id", () => {
  test("200: should respond with a 200 status when object is passed in", () => {
    const patch = { inc_votes: 1 }
    return request(app)
    .patch("/api/articles/1")
    .send(patch)
    .expect(200);
  });
  test("200: should respond with article votes incremented", () => {
    const patch = { inc_votes: 1 }
    return request(app)
    .patch("/api/articles/1")
    .send(patch)
    .expect(200)
    .then(({ body }) => {
      const { article } = body;
      expect(article).toHaveProperty("article_id", 1);
      expect(article).toHaveProperty("votes", 101);
    });
  })
  test("400: should respond with a 400 when given an incorrect data type value to to patch", () => {
    const patch = { inc_votes: "abc" };
    return request(app).patch("/api/articles/1").send(patch).expect(400);
  });
  test("404: should respond with a 404 when given a correct value to patch but wrong path was used", () => {
    const patch = { inc_votes: 1 }
    return request(app)
    .patch("/api/articles/96787687")
    .send(patch)
    .expect(404)
    .then(({ body }) => {
      expect(body.err).toBe("Article Not Found")
    })
  });
})

describe("DELETE /api/comments/:comment_id", ()=>{
  test("204: should respond with 204 successfuly deleted", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
  })
  test("404: should respond with 404 when given a valid but non existent comment_id", ()=>{
    return request(app)
    .delete("/api/comments/12345")
    .expect(404)
  })
  test("400: should respond with a 400 status on invalid comment_Id", () => {
    return request(app).delete("/api/comments/fakeId").expect(400);
  });
})

describe("GET /api/users", () => {
  test("Responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const {
          body: { users },
        } = response;
        users.forEach((user) => {
          expect(typeof user.username).toBe("string")
          expect(typeof user.name).toBe("string")
          expect(typeof user.avatar_url).toBe("string")
        });
      });
  });
});