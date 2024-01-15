const { TestWatcher } = require("jest");
const app = require("../app.js");
const allTestData = require("../db/data/test-data");
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const request = require("supertest");

beforeEach(() => seed(allTestData));
afterAll(() => db.end());

describe("/api/topics", ()=>{
    test("receives status 200", ()=>{
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response)=>{
            expect(response.status).toBe(200)
        });
    });
    test("Responds with an array of topic objects", ()=>{
        return request(app)
        .get("/api/topics")
        .then((response) => {
            const {
              body: { topics },
            } = response;
            topics.forEach((treasure) => {
              expect(treasure).toHaveProperty("slug");
              expect(treasure).toHaveProperty("description");
            });
          });
    })
});