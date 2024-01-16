const { selectTopics, selectArticleById, selectArticles } = require("../models/test-data-models");
const jsonFile = require("../endpoints.json")

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getInfo = (req, res, next) => {
    res.status(200).send(jsonFile);
};

exports.getByArticleId = (req, res, next) => {
  const { article_id } = req.params
  selectArticleById(article_id)
    .then((article)=>{
      res.status(200).json({ article })
  })
    .catch((err)=>{
    if (err.msg === "Not Found") {
      res.status(404).json({ error: "Article Not Found" });
  } else {
      next(err);
  }
  })
};

exports.getArticles = (req, res, next) => {
  selectArticles()
  .then((articles) => {
    res.status(200).send({ articles });
  })
  .catch((err) => {
    next(err);
  });
};