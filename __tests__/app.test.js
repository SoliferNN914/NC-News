const { TestWatcher } = require("jest");
const app = require("../app.js");
const allTestData = require("../db/data/test-data");
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
  test("responds with status 200 and accurate endpoint documentation", () => {
    return request(app)
    .get("/api")
    .expect(200)
    .then((response)=>{
        expect(response.body).toEqual(endpointsInfo)
    })
  });
});