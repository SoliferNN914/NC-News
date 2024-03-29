exports.handleCustomErrors = (err, req, res, next)=>{
    if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg});
    }else{
        next(err);
    }
};

exports.handleSqlErrors = (err, req, res, next) => {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Bad request" });
    } else {
      next(err);
    }
  };

  exports.handleInternalServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
};
  