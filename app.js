const {getTopics} = require("./controllers/test-data-controllers")
const {
    handleInternalServerErrors,
    handleSqlErrors,
    handleCustomErrors,
} = require("./errors/index")
const express = require("express")
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics)

app.use(handleCustomErrors);
app.use(handleSqlErrors);
app.use(handleInternalServerErrors);

module.exports = app;