var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require ("../models/user");


// root route
router.get("/", (req, res) => res.render("landing"))

//show register form
router.get("/register", (req, res)=>{
    res.render("register");
});

//handle signup logic
router.post("/register", (req, res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            req.flash("error", err.message);
            console.log(err);
            res.redirect("register");
            // for some reason when leaving the return statement here instead of a redirect, the flash message did not displiay
            // return res.render("register");
        }
        passport.authenticate("local")(req, res, ()=>{
            req.flash("success", "Welcome to YelpCamp " + newUser.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", (req, res)=>{
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res)=>{//callback here doesn't do anything and we could get rid of but he's leaving it to highlight the passport authenticate middleware
});

//logout route
router.get("/logout", (req, res)=>{
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;