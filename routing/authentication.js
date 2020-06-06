var express = require("express");
var router = express.Router();
const DButils = require("../modules/DB");
const DBOperation = require("../modules/dbOperation");
const bcrypt = require("bcrypt");
var profileHandler=require("./utils/profileHandler");

router.post("/login", async function(req, res, next) {
    try
    {
      const user = await DButils.execQuery(`SELECT * FROM users WHERE username = '${req.body.username}'`);
      if (!user.find((x) => x.username === req.body.username))
        throw { status: 401, message: "Username or Password incorrect" };
      // check that the password is correct
      if (!bcrypt.compareSync(req.body.password, user[0].password))
        {
        throw { status: 401, message: "Username or Password incorrect" };
        }
      // Set cookie
      req.session.user_id = user[0].user_id;
      res.status(200).send({ message: "login succeeded", success: true });
    }
    catch (error)
    {
      next(error);
    }
  });

router.post("/register",async function (req, res,next)
 {
   try{
    if(req.body.username === undefined || req.body.username.length<3 || req.body.username>8)
    {
      throw {status: 400, message: "Invalid request username must be 3-8 chracter"};
    }  
    if(req.body.email !==undefined && await DBOperation.checkIfUserExists(req.body.username))
    {
      if(req.body.password && profileHandler.checkPassword(req.body.password))
      {
        await DBOperation.createUser(req.body);
        res.status(201).send("user created successfully");
      }
      else
      {
        throw {status: 400, message: "Invalid request password must be 5-10 chracter and contains digit and special chracter"};
      }
    }
    else
    {
      throw { status: 409, message: "Username or email taken, please try diffrent username or diffrent email" };
    }
   }
   catch(error)
   {
      next(error);
   }
 });


 module.exports = router;