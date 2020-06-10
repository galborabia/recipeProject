require("dotenv").config();
var express = require("express");
var path = require("path");
const session = require("client-sessions");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const DButils = require("./modules/DB");
const profile = require("./routing/profile");
const recipes = require("./routing/recipes");
const authentication = require("./routing/authentication");
const cors = require("cors");

var app = express();

app.use(cors());
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files
app.use(morgan(":method :url :status  :response-time ms"));

app.use(
  session({
    cookieName: "session", // the cookie key name
    secret: process.env.COOKIE_SECRET, // the encryption key
    duration: 200 * 60 * 1000, // expired after 20 sec
    activeDuration: 0 // if expiresIn < activeDuration,
    //the session will be extended by activeDuration milliseconds
  })
);


var port = process.env.PORT || "3000";
app.use("/recipes", recipes);
app.use("/profile", profile);
app.use("",authentication);



// error middleware- with 4 params
app.use(function (err, req, res, next) 
{
    console.error(err);
    res.status(err.status || 500).send({ message: err.message, success: false });
});
  
  const server = app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
  });
  