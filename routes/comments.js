var express = require("express");
var router = express.Router({mergeParams:true});
// make sure to require the two models below
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// ============
// Comments New
// ============
router.get("/comments/new", middleware.isLoggedIn, (req, res)=>{
    // find campground by id
    Campground.findById(req.params.id,(err, campground)=>{
        if(err || !campground){
            req.flash("error", "Campground not found");
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// ===============
// Comments Create
// ===============
router.post("/comments", middleware.isLoggedIn, (req, res)=>{
    // lookup campground using ID
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comment
            Comment.create(req.body.comment, (err, comment)=>{
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    console.log(comment);
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
            // connect new comment to campground
            // redirect back to campground show page
        }
    })
});

// ======================
// Comments EDIT Route
// ======================
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "No campground found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else{
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        })
    })
});

// ======================
// Comments UPDATE Route
// ======================
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// ======================
// Comments DESTROY Route
// ======================
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// ============================================
//             END COMMENTS ROUTES
// ============================================

module.exports = router;