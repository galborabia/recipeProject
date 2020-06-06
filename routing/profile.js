var express = require("express");
var router = express.Router();
const authentic= require("./utils/authentic");
const DBOperation = require("../modules/dbOperation");
var profileHandler=require("./utils/profileHandler");

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


router.get("/getPersonalRecipes/:id",authentic, async function (req, res, next) {
  const { id } = req.params;
  const fullRecipe= await profileHandler.getPersonalFullRecipe(req.session.user_id,id, next).catch(err=>next(err));
  res.status(200).send({ fullRecipe: fullRecipe });

});

router.get("/getPersonalRecipes", authentic,async function (req, res,next) {
  const personalRecipes = await profileHandler.getPersonalPreviewRecipeWithWatchFave(req.session.user_id, next)
  .catch(err=>next(err));
  
  res.status(200).send({ personalRecipes: personalRecipes });
});

router.get("/getFamilyRecipes/:id", async function (req, res, next) {
  const { id } = req.params;
  const fullRecipe= await profileHandler.getFamilyFullRecipe(req.session.user_id,id, next).catch(err=>next(err));
  res.status(200).send({ fullRecipe: fullRecipe });
});

router.get("/getFamilyRecipes",async function (req, res, next) {
  const familyRecipes = await profileHandler.getFamilyPreviewRecipeWithWatchFavorite(req.session.user_id, next)
  .catch(err=>next(err));
  
  res.status(200).send({ familyRecipes: familyRecipes });
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
