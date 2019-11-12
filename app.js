require('dotenv').config();
var express 			= require("express"),
	app 				= express(),
	bodyParser 			= require("body-parser"),
	mongoose 			= require("mongoose"),
	flash				= require("connect-flash"),
	passport			= require("passport"),
	LocalStrategy		= require("passport-local"),
	methodOverride 		= require("method-override"),
	Campground  		= require("./models/campground"),
	Comment 			= require("./models/comment"),
	User				= require("./models/user")//,
	//seedDB			= require("./seeds")

//Requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

//mongoose.connect("mongodb://localhost:27017/yelp_camp_v12", { useNewUrlParser: true, useUnifiedTopology: true  });
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/yelp_camp_v12", { 
	useNewUrlParser: true, 
	useUnifiedTopology: true  
}).then(() =>{
		console.log("Connected to the DB!");
}).catch(err => {
	console.log("ERROR: " + err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); //allows us to not have to use .ejs extensions
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.locals.moment 	= require("moment");

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Bella is the cutest dog",
	resave: false,
	saveUninitialized: false
}));
		
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user; //allows every route to have access to currentUser
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//=========
// ROUTES
//=========
app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The YelpCamp Server is running!");
});