const db = require("../db/connection");


exports.selectTopics = () => {
  const query = "SELECT * FROM topics";
  return db.query(query).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
  .then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    } else {
      return rows;
    }
  });
};

exports.selectArticles = () => {
  const query = `SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.article_id) AS comment_count 
  FROM articles LEFT JOIN comments 
  ON articles.article_id = comments.article_id 
  GROUP BY
  articles.title,
  articles.topic,
  articles.author,
  articles.created_at,
  articles.votes,
  articles.article_id
  ORDER BY
  created_at DESC;`;
  return db.query(query).then(({rows}) => {
    return rows
  })
}