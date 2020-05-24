var express = require("express");

// replace "app." with "router.""
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ==============================
// INDEX - show all campgrounds
// ==============================

router.get("/", (req, res) => {
    //====get all campgrounds from DB=====
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// =================================
// CREATE - Add new campground to DB
// =================================

router.post("/", middleware.isLoggedIn, (req, res)=>{
    // get the form data from the new.ejs file
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground= {name: name, price: price, image: image, description: desc, author: author};
    console.log(req.user);
    // =====create a new campground and save to DB=====
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            console.log(newlyCreated);
            res.redirect("");
        }
    });
});

// ========================================
// NEW - show form to create new campground
// ========================================

router.get("/new", middleware.isLoggedIn, (req, res)=>{
    res.render("campgrounds/new");
});

// ============================================
// SHOW - show more info on specific campground
// ============================================

router.get("/:id", function(req, res){
    // find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found... ");
            res.redirect("/campgrounds");
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground})
        }
    });
});

// ============================================
// EDIT CAMPGROUND ROUTE
// ============================================
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});


// ============================================
// UPDATE CAMPGROUND ROUTE
// ============================================

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    // req.body.campground.body = req.sanitize(req.body.campground.body);
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds/");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //redirect somewhere (probably the show page)

});

// ============================================
// DESTROY CAMPGROUND ROUTE
// ============================================

    router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
        Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
            if (err) {
                console.log(err);
            }
            Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
                if (err) {
                    console.log(err);
                }
                res.redirect("/campgrounds");
            });
        })
    });


module.exports = router;