var express = require("express");
var router = express.Router();
const DButils = require("../modules/DB");
const DBOperation = require("../modules/dbOperation");
const bcrypt = require("bcrypt");

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

router.post("/register",async function (req, res)
 {
    const users =await DButils.execQuery("SELECT username FROM Users").catch((err) => {
        if (err.code) console.log("error message:", err.code);
        else console.log("error message:", err);
      });
    if(users.find((x) => x.username===req.body.username))
    {
        res.status(409).send("username already exists, please try diffrent one");
    }
    else
    {
        DBOperation.createUser(req.body)
        .catch(error => res.send(error));
        res.status(201).send("user created successfully");
    }
 });


 module.exports = router;