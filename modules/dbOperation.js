const DButils = require("./DB");
const bcrypt = require("bcrypt");

exports.createUser =async function createUser(user)
{
    let hashPassword=bcrypt.hashSync(user.password,parseInt(process.env.bcrypt_saltRounds)) ;
    await DButils.execQuery(
        `INSERT INTO Users VALUES (default, '${user.username}', '${user.first_name}','${user.last_name}','${user.country}','${hashPassword}','${user.email}','${user.profile_picture}')`
      );
};

exports.checkIfUserExists = async function checkIfUserExists (username,email,next)
{
  try{
    const users = await DButils.execQuery(`SELECT username FROM Users where username= '${username}' or email='${email}'`);
    if(users && users.length>0)
    {
      return false;
    }
    return true;
  }
  catch(err)
  {
      next(err);
  }
 
}
function checkIfExists(recipes, recipe_id)
{
  for (i = 0; i < recipes.length; i++)
  {
    if(parseInt(recipes[i].recipe_id) ===recipe_id) 
    {
      return true;
    }
  }
  return false;
}

exports.addRecipeToLastRecipes =async function addRecipeToLastRecipes(user_id, recipe_id,next)
{
  try
  {
      let lastRecipes = await DButils.execQuery(
        `Select * FROM UserLastRecipes where user_id='${user_id}' ORDER BY counter ASC `
      );
      if(checkIfExists(lastRecipes,recipe_id) === true)
      {
         let recipes = changeOrder(lastRecipes, recipe_id);
         recipes.forEach(updateLastRecipes);
      }
      else
      {
        if(lastRecipes.length==3)
        {
          await DButils.execQuery(
            `Delete FROM UserLastRecipes where user_id='${user_id}' AND counter='3'`
          );
        }
        await DButils.execQuery(
          `INSERT INTO UserLastRecipes VALUES ('${user_id}', '${recipe_id}','0') `
        );
        await DButils.execQuery(
          `Update UserLastRecipes SET counter= counter+1 where user_id='${user_id}'`
        );
      }
  }
    catch (err) {
      console.error("SQL error", err);
      throw err;
  }
};

async function updateLastRecipes(recipe)
{
  await DButils.execQuery(
    `Update UserLastRecipes SET counter= '${recipe.counter}' where user_id='${recipe.user_id}' AND recipe_id='${recipe.recipe_id}' `
     );
}
function changeOrder(lastRecipes, recipe_id)
{
  let recipes = new Array();
  for (let index = 0; index < lastRecipes.length; index++)
  {
    if(parseInt(lastRecipes[index].recipe_id)===recipe_id)
    {
      lastRecipes[index].counter=1;
      recipes.push(lastRecipes[index]);
    }
  }
  let counter =2;
  for (let index = 0; index < lastRecipes.length; index++)
  {
    if(parseInt(lastRecipes[index].recipe_id)!==recipe_id)
    {
      lastRecipes[index].counter=counter;
      counter++;
      recipes.push(lastRecipes[index]);
    }
  }
  return recipes;
}



exports.watchUpdate =async function watchUpdate(user_id, recipe_id,next)
{
  try{
      let recipe =await DButils.execQuery(
        `SELECT * FROM UserswatchedRecipes where user_id='${user_id}' AND recipe_id='${recipe_id}'`
      );
      if(recipe.length === 0)
      {
        await DButils.execQuery(
          `INSERT INTO UserswatchedRecipes VALUES ('${user_id}', '${recipe_id}')`
        );
      }
  }
    catch (err) {
      console.error("SQL error", err);
      throw err;
  }
};

exports.addRecipeToFavorit =async function addRecipeToFavorit(user_id, recipe_id,next)
{
  try{
      await DButils.execQuery(
        `INSERT INTO UsersFavoriteRecipes VALUES ('${user_id}', '${recipe_id}')`
      );
    }
    catch (err) {
    console.error("SQL error", err);
    throw err;
  }
};

exports.getFavorite =async function getFavorite(user_id, next)
{
  try{
      return await DButils.execQuery(
        `SELECT * FROM UsersFavoriteRecipes WHERE user_id = '${user_id}'`
      );
    }
    catch (err) {
    console.error("SQL error", err);
    throw err;
  }
};

exports.getWatchs =async function getWatchs(user_id, next)
{
  try{
      return await DButils.execQuery(
        `SELECT * FROM UserswatchedRecipes WHERE user_id = '${user_id}'`
      );
    }
    catch (err) {
    console.error("SQL error", err);
    throw err;
  }
};

exports.getLastRecipes =async function getLastRecipes(user_id, next)
{
  try{
      return await DButils.execQuery(
        `SELECT * FROM UsersLastRecipes WHERE user_id = '${user_id}'`
      );
    }
    catch (err) {
    console.error("SQL error", err);
    throw err;
  }
};
