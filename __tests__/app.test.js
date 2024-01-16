const { TestWatcher } = require("jest");
const app = require("../app.js");
const allTestData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const endpointsInfo = require("../endpoints.json")

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
          console.log(article);
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
        console.log(body);
        expect(body.error).toBe("Article Not Found");
      });
  });
})