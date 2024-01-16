const db = require("../db/connection");


exports.selectTopics = () => {
  const query = "SELECT * FROM topics";
  return db.query(query).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
    let query = ("SELECT * FROM articles WHERE article_id = $1", [article_id])
//     .then(({ rows }) =>{
//         if(rows.length === 0) {
//             return Promise.reject({msg: "Not Found"});
//         }
//         console.log(rows);
//         return rows[0]
//     });
return db.query(query).then((res) => {
    console.log(res.rows);
    return res.rows
  });
}