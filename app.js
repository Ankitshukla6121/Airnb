const express=require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("./schema.js");
const Review = require("./models/review.js");
const { request } = require("http");
const listings = require("./routes/listing.js");
const review_route = require("./routes/review.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust"

main().then(()=>{
    console.log("Connected to Db ")
}).catch(err=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended :true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.listen(8080 ,()=>{
    console.log("Connection succesfull");
});

app.get("/", (req,res)=>{
    res.send("I am root ");
});   
app.use("/listings",listings);
app.use("/listings/:id/reviews",review_route);
app.get("/testlisting",wrapAsync(async (req,res)=>{
    const samplelisting = new Listing({
        title : "My new Villa",
        description : " By the beach",
        price : 1200,
        location : " Noida Up",
        country : "India"
    });

    await samplelisting.save();
    console.log("sample was saved");
    res.send("Successful testing");


})); 






app.all("*",(req,res,next)=>{
    next( new ExpressError(404,"Page Not Found ! "));
});
// Error Handler Middleware 
app.use((err,req,res,next)=>{
    let {statusCode=500 , message="Somethin Went Wrong !"} = err;
    res.status(statusCode).render("error.ejs" ,{message});
})
      