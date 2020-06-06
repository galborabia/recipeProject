var express = require("express");
var router = express.Router();
const authentic= require("./utils/authentic");
const DBOperation = require("../modules/dbOperation");
var profileHandler=require("./utils/profileHandler");


router.post("/favorites/:id", authentic, async function(req, res,next){
  const { id } = req.params;
   DBOperation.addRecipeToFavorit(req.session.user_id, id,next).
   then(res.send({ message: "addRecipeToFavorit" ,success:true }))
   .catch(err=>next(err));
});

router.get("/favorites" ,authentic,async function (req, res, next)
 {
  let favorites_list=[];
  const favorites = await DBOperation.getFavorite(req.session.user_id, next).catch(err=>next(err));
  if(favorites.length === 0)
  {
    res.status(201).send({message: "no favorire recipes for user"});
  }
  else
  {
    favorites.map((fave)=>favorites_list.push(fave.recipe_id));
    let previewRecipes =await profileHandler.getPreviewRecipes(favorites_list);
    res.send({previewRecipes: previewRecipes});
  }
});

router.get("/watched",authentic,async function (req, res, next)
{
  let watchs_list=[];
  const watchs = await DBOperation.getWatchs(req.session.user_id, next).catch(err=>next(err));
  if(watchs.length===0)
  {
    res.status(201).send({message: "no watched recipes for user"});
  }
  else
  {
    watchs.map((watch)=>watchs_list.push(watch.recipe_id));
    let previewRecipes= await profileHandler.getPreviewRecipes(watchs_list)
    res.send({previewRecipes: previewRecipes});
  }
});


router.get("/lastRecipes",authentic,async function (req, res, next)
{
  let watchs_list=[];
  const watchs = await DBOperation.getLastRecipes(req.session.user_id, next).catch(err=>next(err));
  if(watchs.length===0)
  {
    res.status(201).send({message: "no watched recipes for user"});
  }
  else
  {
    watchs.map((watch)=>watchs_list.push(watch.recipe_id));
    let previewRecipes= await profileHandler.getPreviewRecipes(watchs_list)
    res.send({previewRecipes: previewRecipes} );
  } 
});

router.get("/personalRecipes", authentic,async function (req, res,next) {
  const personalRecipes = await profileHandler.getPersonalPreviewRecipeWithWatchFave(req.session.user_id, next)
  .catch(err=>next(err));
  if(personalRecipes.length===0)
  {
    res.status(201).send({message: "no personal recipes for user"});
  }
  else
  {
    res.status(200).send({ personalRecipes: personalRecipes });
  }
});

router.get("/familyRecipes/:id", authentic, async function (req, res, next) {
  const { id } = req.params;
  const fullRecipe= await profileHandler.getFamilyFullRecipe(req.session.user_id,id, next).catch(err=>next(err));
  res.status(200).send({ fullRecipe: fullRecipe });
});

router.get("/familyRecipes",authentic,async function (req, res, next)
 {
   try
  {
    const familyRecipes = await profileHandler.getFamilyPreviewRecipeWithWatchFavorite(req.session.user_id, next)
    .catch(err=>next(err));
    if(familyRecipes.previewRecipe=== undefined)
    {
      res.status(201).send({message: "no personal recipes for user"});
    }
    else
    {
      res.status(200).send({ familyRecipes: familyRecipes });
    }
  }
  catch(err)
  {
    next(err);
  }
});

router.get("/getRecipeInfo", authentic, async function(req, res,next)
{
  let recipe_id =req.session.fullRecipe.previewRecipe.recipe_id;
  await DBOperation.watchUpdate(req.session.user_id, recipe_id,next).catch(err=>next(err));
  await DBOperation.addRecipeToLastRecipes(req.session.user_id, recipe_id,next).catch(err=>next(err));
  res.status(200).send({ fullRecipe: req.session.fullRecipe });
});


module.exports = router;
