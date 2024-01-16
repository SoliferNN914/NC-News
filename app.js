const { getTopics, getInfo, getByArticleId, getArticles } = require("./controllers/test-data-controllers")
const {
    handleInternalServerErrors,
    handleSqlErrors,
    handleCustomErrors,
} = require("./errors/index")
const express = require("express")
const app = express();

app.get("/api/topics", getTopics)
app.get("/api", getInfo)
app.get("/api/articles/:article_id", getByArticleId)
app.get("/api/articles", getArticles)

app.use(handleCustomErrors);
app.use(handleSqlErrors);
app.use(handleInternalServerErrors);

module.exports = app;