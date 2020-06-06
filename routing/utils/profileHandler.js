var recipesHandler=require("./recipesHandler");

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