const DButils = require("../tables/DButils");
const bcrypt = require("bcrypt");

exports.createUser =async function createUser(user)
{
    let hashPassword=bcrypt.hashSync(user.password,parseInt(process.env.bcrypt_saltRounds)) ;
    await DButils.execQuery(
        `INSERT INTO Users VALUES (default, '${user.username}', '${user.first_name}','${user.last_name}','${user.country}','${hashPassword}','${user.email}','${user.profile_picture}')`
      );
};

