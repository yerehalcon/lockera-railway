const express = require("express");
const router = express.Router();
const link = require("../config/link");

router.get("/index", function(req, res,){
    if(req.session.login){
        res.render("index", {datos: req.session, link});
    }
}); 

module.exports = router;