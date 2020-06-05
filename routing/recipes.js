var express = require("express");
var router = express.Router();
var recipesHandler=require("./utils/recipesHandler");


router.get("/Information", async function (req, res, next) {
  try
  {
    const recipe = await recipesHandler.getRecipeInfo(req.query.recipe_id);
    const fullRecipe=recipesHandler.getFullRecipe(recipe);
    req.session.fullRecipe=fullRecipe;
    if(req.session && req.session.user_id){
       res.redirect('/profile/getRecipeInfo');
    }
    else{
      res.status(200).send({ fullRecipe: fullRecipe });
    }
  } catch (error)
  {
    next(error);
  }
});




router.get("/exploreRecipes", async function (req, res, next) {
  try
   {
    let randomRecipes = await recipesHandler.getRandomRecipes();
    let randomPreviewRecipes = recipesHandler.createRandomRecipes(randomRecipes.data.recipes);
    res.status(200).send({previewRecipes: randomPreviewRecipes });
   }
    catch (error) {
    next(error);
  }
});


router.get("/search",async function(req, res, next)
{
  try {
    const search_response = await recipesHandler.searchRecipe(req.query);
    if(search_response.data.results.length === 0)
    {
        return res.sendStatus(404);
    }
    else 
    {
        let recipes = await Promise.all(
            search_response.data.results.map((recipe_raw) =>
            recipesHandler.getRecipeInfo(recipe_raw.id)
            )
          );
        let previewRecipes=recipesHandler.getPreviewRecipes(recipes);
        res.status(200).send({ previewRecipes: previewRecipes });   
    }

  
  } catch (error) {
    next(error);
  }
});
 
module.exports = router;