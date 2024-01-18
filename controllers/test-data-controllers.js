const { selectTopics, selectArticleById, selectArticles, selectAllComments, insertComment, updateVote, removeComment } = require("../models/test-data-models");
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

exports.postCommentForArticle = (req, res, next) => {
  const { article_id } = req.params;
  insertComment(req.body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err)});
};

exports.partchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateVote(article_id, inc_votes)
  .then((article) => {
    if (!article) {
      return res.status(404).send({ err: 'Article Not Found' });
    }
    res.send({ article });
  })
  .catch((err) => {
    next(err)});
}

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params
  removeComment(comment_id)
  .then(() => {
    return res.status(204).send({ msg: 'No Contents' })
  })
  .catch((err) => {
    next(err)});
}