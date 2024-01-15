const { getTopics, getInfo } = require("./controllers/test-data-controllers")
const {
    handleInternalServerErrors,
    handleSqlErrors,
    handleCustomErrors,
} = require("./errors/index")
const express = require("express")
const app = express();

app.get("/api/topics", getTopics)
app.get("/api", getInfo)

app.use(handleCustomErrors);
app.use(handleSqlErrors);
app.use(handleInternalServerErrors);

module.exports = app;