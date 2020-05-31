const express       = require("express"),
      app           = express(),
      bodyParser    = require("body-parser"),
      port          = process.env.PORT || 3000,
      expressSanitizer = require("express-sanitizer"),
      mongoose      = require("mongoose"),
      flash         = require("connect-flash"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      methodOverride = require("method-override"),
      Campground    = require("./models/campground"),
      Comment       = require("./models/comment"),
      User          = require("./models/user"),
      seedDB        = require("./seeds")

// requiring routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index")

console.log(process.env.DATABASEURL);



mongoose.connect(process.env.DATABASEURL,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});



//this is a line we will see all the time
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// +++++++++++seed the DB
// seedDB();

//==================
// PASSPORT CONFIG
//==================
app.use(require("express-session")({
    secret: "Haydn is next on the roster for the Cottrells!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//User.authenticate below comes with passport-local-mongoose...without it, we'd have to write that method ourselves
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==================
// END PASSPORT CONFIG
//==================

// pass currentUser and flash message to every single template
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
// having the "/campgrounds" here lets us delete that in the campgrounds.js file
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id", commentRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(port, ()=> console.log(`YelpCamp yelping on port ${port}`))


