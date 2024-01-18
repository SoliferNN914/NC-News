const { getTopics, getInfo, getByArticleId, getArticles, getAllComments, postCommentForArticle, partchArticle, deleteComment } = require("./controllers/test-data-controllers")
const { handleInternalServerErrors, handleSqlErrors, handleCustomErrors } = require("./errors/index")
const express = require("express")
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics)
app.get("/api", getInfo)
app.get("/api/articles/:article_id", getByArticleId)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getAllComments)

app.post("/api/articles/:article_id/comments", postCommentForArticle)

app.patch("/api/articles/:article_id", partchArticle)

app.delete("/api/comments/:comment_id", deleteComment)

app.use((err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502") {
      res.status(400).send({ msg: "Bad request" });
    }
    else if (err.status && err.msg) {
      res.status(err.status).send(err.msg);
    }
    else {
      res.status(404).send({ msg: "Not Found" });
    }
  });

app.use(handleCustomErrors);
app.use(handleSqlErrors);
app.use(handleInternalServerErrors);

module.exports = app;