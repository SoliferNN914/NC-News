const { selectTopics } = require("../models/test-data-models");
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