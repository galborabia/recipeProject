var express = require("express");
var router = express.Router();

router.use((req, res, next) =>{
    if(req.session && req.session.id){
        const id= req.session.id;
        const user= checkExist(id);

        if(user){
            req.user= user;
            next();
        }
    }
    else
    res.sendStatus(401);
});


module.exports = router;