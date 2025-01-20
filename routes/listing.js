const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}= require("../schema.js");
const ExpressError = require("../utils/ExpressError.js"); 
const Listing = require("../models/listing.js");


router.get("/",wrapAsync(async(req,res,next)=>{
 
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});

}));
router.get("/new",wrapAsync(async(req,res)=>{
res.render("listings/new.ejs");
})); 
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError ( 400 , error);
    }
    else{
        next();
    }
}
//Create Route 
router.post("/", validateListing,wrapAsync(async (req, res , next) => {
    
   
    const { title, description, image, price, country, location } = req.body.listing;

    // Create a new Listing object
    const newListing = new Listing({
        title,
        description,
        image,
        price,
        country,
        location
    });

    // Save the new listing to the database
    await newListing.save();
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings }); // Redirect to the listings page after successful creation
})
);

// Show route 
router.get("/:id",wrapAsync(async (req,res)=>{

    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});

}));

router.get("/:id/edit",wrapAsync(async (req,res)=>{

    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

}));

//update route
router.put("/:id", validateListing , wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(404,"Send valid data for listing ");
    };
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);

}));

//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");

}));

module.exports = router ;