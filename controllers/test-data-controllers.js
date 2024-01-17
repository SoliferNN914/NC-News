const { selectTopics, selectArticleById, selectArticles, selectAllComments } = require("../models/test-data-models");
const jsonFile = require("../endpoints.json")
const fs = require("fs/promises");

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


exports.getAllComments = async (req, res, next) => {
  try{
    const article_id = req.params.article_id

    const comments = await selectAllComments(article_id)

    res.status(200).send({ comments })
  } catch (err) {
    next(err)
  }
}