var recipesHandler=require("./recipesHandler");
const DBOperation = require("../../modules/dbOperation");

exports.getPreviewRecipes = async function getPreviewRecipes (recipes)
{
    let recipesData = await Promise.all(
        recipes.map(recipesHandler.getRecipeInfo)
      );
    let previewRecipes=recipesHandler.getPreviewRecipes(recipesData);
    return previewRecipes;
}

exports.checkPassword = function checkPassword(password)
{
   if(password.length <11 && password.length>4)
   {
      var hasNumber = /\d/;
      if(hasNumber.test(password) && isValid(password))
      {
          return true;
      }
   }
   return false;
}

function isValid(str){
    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/); 
    return pattern.test(str) ;
}


 async function getWatchAndFavorite(user_id,recipe_id){
    let WatchAndFavorite= new Object();
    const watch=  await DBOperation.getWatchs(user_id);
    const favorite=  await DBOperation.getFavorite(user_id);

    if(watch.find((x) => x.recipe_id===recipe_id))
        WatchAndFavorite.watch= true;
    else
        WatchAndFavorite.watch= false;
    if(favorite.find((x) => x.recipe_id===recipe_id))
        WatchAndFavorite.favorite= true;
    else
        WatchAndFavorite.favorite= false;
    
    return WatchAndFavorite;
}


exports.getPersonalFullRecipe= async function getPersonalFullRecipe(user_id,recipe_id,next){
    let fullRecipe = new Object();
    const ingredients=  await DBOperation.getIngredientsRecipe(recipe_id);
    const instructions=  await DBOperation.getInstructionsRecipe(recipe_id);
    const personalRecipe = await DBOperation.getPersonalPreviousRecipe(user_id,recipe_id);
    const watchAndFavorite= await getWatchAndFavorite(user_id, recipe_id);

    personalRecipe.watch= watchAndFavorite.watch;
    personalRecipe.favorite= watchAndFavorite.favorite;
    fullRecipe.previewRecipe=personalRecipe;
    fullRecipe.ingredients=ingredients;
    fullRecipe.instructions=instructions;

    return fullRecipe;
}


exports.getFamilyFullRecipe= async function getFamilyFullRecipe(user_id,recipe_id,next){
    let fullRecipe = new Object();
    const ingredients=  await DBOperation.getIngredientsRecipe(recipe_id);
    const instructions=  await DBOperation.getInstructionsRecipe(recipe_id);
    const FamilyFullRecipe = await DBOperation.getFamilyFullRecipe(user_id,recipe_id);
    const watchAndFavorite= await getWatchAndFavorite(user_id, recipe_id);

    FamilyFullRecipe[0].watch= watchAndFavorite.watch;
    FamilyFullRecipe[0].favorite= watchAndFavorite.favorite;
    fullRecipe.previewRecipe=FamilyFullRecipe;
    fullRecipe.ingredients=ingredients;
    fullRecipe.instructions=instructions;

    return fullRecipe;
}

async function getPersonalPreviewRecipeWithWatchFavorite(user_id,next){

    const personalRecipes = await DBOperation.getPersonalPreviousRecipes(user_id, next);
    for (i = 0; i < personalRecipes.length; i++)
    {
        let recipe_id= personalRecipes[i].id;
        const watchAndFavorite= await getWatchAndFavorite(user_id, recipe_id);
        personalRecipes[i].watch= watchAndFavorite.watch;
        personalRecipes[i].favorite= watchAndFavorite.favorite;
    }
    return personalRecipes;
}


async function getFamilyPreviewRecipeWithWatchFavorite(user_id,next){

    const personalRecipes = await DBOperation.getFamilyPreviousRecipes(user_id, next);
    for (i = 0; i < personalRecipes.length; i++)
    {
        let recipe_id= personalRecipes[i].id;
        const watchAndFavorite= await getWatchAndFavorite(user_id, recipe_id);
        personalRecipes[i].watch= watchAndFavorite.watch;
        personalRecipes[i].favorite= watchAndFavorite.favorite;
    }
    return personalRecipes;
}

exports.getPersonalPreviewRecipeWithWatchFave=getPersonalPreviewRecipeWithWatchFavorite; 
exports.getFamilyPreviewRecipeWithWatchFavorite= getFamilyPreviewRecipeWithWatchFavorite;
