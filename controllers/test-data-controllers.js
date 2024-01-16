const { selectTopics, selectArticleById } = require("../models/test-data-models");
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
    const { article_id } = req.query
    console.log(req.query);
    selectArticleById(article_id)
    .then((article)=>{
        res.status(200).send({ article })
    })
    .catch((err)=>{
        next(err)
    })
}