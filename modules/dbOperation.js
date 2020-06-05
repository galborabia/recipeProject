const DButils = require("./DB");
const bcrypt = require("bcrypt");

exports.createUser =async function createUser(user)
{
    let hashPassword=bcrypt.hashSync(user.password,parseInt(process.env.bcrypt_saltRounds)) ;
    await DButils.execQuery(
        `INSERT INTO Users VALUES (default, '${user.username}', '${user.first_name}','${user.last_name}','${user.country}','${hashPassword}','${user.email}','${user.profile_picture}')`
      );
};

exports.watchUpdate =async function watchUpdate(user_id, recipe_id,next)
{
  try{
      await DButils.execQuery(
        `INSERT INTO UserswatchedRecipes VALUES ('${user_id}', '${recipe_id}')`
      );
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
