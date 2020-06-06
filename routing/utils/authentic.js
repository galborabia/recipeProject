
const DButils = require("../../modules/DB");
module.exports= async (req, res, next) => {
    if(req.session && req.session.user_id){
      const user=   await DButils.execQuery(`SELECT * FROM Users WHERE user_id = '${req.session.user_id}'`);
      if (!user.find((x) => x.user_id === req.session.user_id))
        throw { status: 401, message: "Username or Password incorrect" };
      else{
          req.user= user;
          next();
      }
    }
  };

 


