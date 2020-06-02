var express = require("express");
var router = express.Router();
const axios = require("axios");

const api_domain = "https://api.spoonacular.com/recipes";

router.get("/exploreRecipes", async (req, res, next) => {
  try
   {
    const recipe = await getRandomRecipes();
    res.send({ data: recipe.data });
   }
    catch (error) {
    next(error);
  }
});

//#region example1 - make serach endpoint
router.get("/search", async function(req, res, next)
{
  try {
    
    const search_response = await searchRecipe(req.query);
    let recipes = await Promise.all(
        search_response.data.results.map((recipe_raw) =>
          getRecipeInfo(recipe_raw.id)
        )
      );
    let mapRecipes = recipes.map((recipe) => recipe.data);
    res.send({ data: mapRecipes });
  } catch (error) {
    next(error);
  }
});
//#endregion

function getRandomRecipes() {
  return axios.get(`${api_domain}/random`, {
    params: {
        limitLicense: true,
        number:3,
        apiKey: process.env.spooncular_apiKey
    }
  });
}

function searchRecipe(queryParams)
 {
    const name=queryParams.query;
    let cuisine="";
    let diet="";
    let amount=5;
    let intolerance="";
    if(queryParams.cuisine !== undefined) 
    {
        cuisine=queryParams.cuisine;
    }
    if(queryParams.diet !==undefined)
    {
        diet=queryParams.diet;
    }
    if(queryParams.amount !==undefined)
    {
        amount=queryParams.amount;
    }
    if(queryParams.intolerance !==undefined)
    {
        intolerance=queryParams.intolerance;
    }
    return axios.get(`${api_domain}/search`, {
      params: {
          query: name,
          cuisine: cuisine,
          diet: diet,
          intolerance: intolerance,
          number: amount,
          instructionsRequired: true,
          apiKey: process.env.spooncular_apiKey
      }
    });
  }
  function getRecipeInfo(id) {
    return axios.get(`${api_domain}/${id}/information`, {
      params: {
        includeNutrition: false,
        apiKey: process.env.spooncular_apiKey
      }
    });
  }


module.exports = router;