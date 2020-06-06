const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

exports.createRandomRecipes = function createRandomRecipes(randomRecipes)
{
    let randomPreview =[];
    let counter=0;
    for (i = 0; i < randomRecipes.length; i++)
    {
        if(randomRecipes[i].analyzedInstructions.length>0)
        {
            let previewRecipe =createPreviewRecipe(randomRecipes[i]); 
            randomPreview.push(previewRecipe);
            counter++;
        }
        if(counter===3)
        {
            return randomPreview;
        }  
    }
    return searchRandomRecipesAgain();
}


function searchRandomRecipesAgain()
{
    let recipes = getRandomRecipes();
    return createRandomRecipes(recipes);
}

exports.getFullRecipe =function getFullRecipe(recipe)
{
    let fullRecipe = new Object();
    fullRecipe.previewRecipe=createPreviewRecipe(recipe.data);
    fullRecipe.servinges=recipe.data.servings;
    fullRecipe.ingredients=getRecipeIngredients(recipe);
    fullRecipe.instructions=getRecipeInstructions(recipe);
    return fullRecipe;
}

function getRecipeIngredients(recipe)
{
    let recipeIngredients=recipe.data.extendedIngredients.map(createIngredients);
    return recipeIngredients;
}

function createIngredients(ingredients)
{
    let recipeIngredients = new Object();
    recipeIngredients.name=ingredients.name;
    recipeIngredients.amount=ingredients.amount;
    recipeIngredients.unit=ingredients.unit;
    return recipeIngredients;
}

function getRecipeInstructions(recipe)
{
    let instructions=recipe.data.analyzedInstructions.map(createInstruction);
    return instructions;
}

function createInstruction (instructions)
{
    return instructions.steps.map(getInstructionSteps);
}
function getInstructionSteps (instructions)
{
    let recipeInstruction = new Object();
    recipeInstruction.number=instructions.number;
    recipeInstruction.description=instructions.step;
    recipeInstruction.equipment=instructions.equipment.map(equipment => equipment.name);
    recipeInstruction.ingredients=instructions.ingredients.map(ingredient => ingredient.name);
    return recipeInstruction;
}

exports.getPreviewRecipes = function getPreviewRecipes(recipes)
{
    let previreRecipes=new Array();
    for (i = 0; i < recipes.length; i++)
    {
        let previewRecipe=createPreviewRecipe(recipes[i].data);
        previreRecipes.push(previewRecipe);
    }
    return previreRecipes;
} 

function createPreviewRecipe(value)
{
    let previewRecipe = new Object();
    previewRecipe.title=value.title;
    previewRecipe.readyInMinutes=value.readyInMinutes;
    previewRecipe.urlPicture=value.image;
    previewRecipe.likes=value.aggregateLikes;
    previewRecipe.vegan=value.vegan;
    previewRecipe.vegetarian=value.vegetarian;
    previewRecipe.glutenFree=value.glutenFree;
    previewRecipe.recipe_id=value.id;
    return previewRecipe;
}

exports. getRandomRecipes = function getRandomRecipes() {
  return axios.get(`${api_domain}/random`, {
    params: {
        limitLicense: true,
        number:6,
        apiKey: process.env.spooncular_apiKey
    }
  });
}

exports.searchRecipe = function searchRecipe(queryParams)
{
    if(!queryParams.query || queryParams.query ==="" )
    {
        throw { status: 400, message: "Invalid recipe name" };
    }
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

  exports.getRecipeInfo = function getRecipeInfo(id) {
    return axios.get(`${api_domain}/${id}/information`, {
      params: {
        includeNutrition: false,
        apiKey: process.env.spooncular_apiKey
      }
    });
  }

