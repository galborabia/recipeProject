var express = require("express");
var router = express.Router();
const DButils = require("../modules/DB");
const authentic= require("./utils/authentic");
const DBOperation = require("../modules/dbOperation");



router.get("/getFavorites",authentic,async function (req, res, next) {
  let favorites_list=[];
  const favorites = await DBOperation.getFavorite(req.session.user_id, next).catch(err=>next(err));
  favorites.map((fave)=>favorites_list.push(fave.recipe_id));
  res.send( favorites_list );
});

router.get("/getWatchs",authentic,async function (req, res, next) {
  let watchs_list=[];
  const watchs = await DBOperation.getWatchs(req.session.user_id, next).catch(err=>next(err));
  watchs.map((watch)=>watchs_list.push(watch.recipe_id));
  res.send( watchs_list );
});


router.get("/getWatchsAndFavorite/",authentic,async function (req, res, next) {
  let watchs_list=[];
  const watchs = await DBOperation.getWatchs(req.session.user_id, next).catch(err=>next(err));
  watchs.map((watch)=>watchs_list.push(watch.recipe_id));
  res.send( watchs_list );
});

// {
//   "23":
//     "watched": true
//     "fave": false
// }


router.get("/getPersonalRecipes", function (req, res) {
  res.send(req.originalUrl);
});

router.get("/getPersonalRecipes/:id", function (req, res) {
  res.send(req.originalUrl);
});

router.get("/getFamilyRecipes", function (req, res) {
  res.send(req.originalUrl);
});

router.get("/getFamilyRecipes/:id", function (req, res) {
  res.send(req.originalUrl);
});



router.get("/getRecipeInfo", authentic, async function(req, res,next){
  let recipe_id =req.session.fullRecipe.previewRecipe.recipe_id;
  //DBOperation.ifExist


  DBOperation.watchUpdate(req.session.user_id, recipe_id,next)
  .catch(err=>next(err));
   res.status(200).send({ fullRecipe: req.session.fullRecipe });
});

router.get("/addRecipeToFavorit/:recipeID", authentic, async function(req, res,next){
  const { recipeID } = req.params;
   DBOperation.addRecipeToFavorit(req.session.user_id, recipeID,next).
   then(res.send({ message: "addRecipeToFavorit" ,success:true }))
   .catch(err=>next(err));
});

module.exports = router;
