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
};

exports.selectAllComments = async (article_id) => {
  const { rows } = await db.query (`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [article_id]);
  if (rows.length === 0){
    throw new Error('Not Found')
  }
  return rows;
};

exports.insertComment = (comment, article_id) => {
  const { username, body } = comment;
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows
    });
};

exports.updateVote = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0]
    });
};

exports.removeComment = (comment_id) => {
  return db
  .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id])
  .then(({ rows }) => {
    if (rows.length === 0){
      return Promise.reject({ status: 404})
    }
  })
}