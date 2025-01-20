const mongoose = require("mongoose");
const review = require("./review");
const Review = require("./review.js");
const Schema =  mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type : String ,
        required : true 
    },
    description : String,
    image : {
        type : String,
        default:"https://envato-shoebox-0.imgix.net/cf8d/1d97-9036-4ff1-83c9-7353df6acd91/toronto-IMG_2512.jpg?auto=compress%2Cformat&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark2.png&w=1000&fit=max&markalign=center%2Cmiddle&markalpha=18&s=07e179fe3a69aa2a4e4a4ad31ca89817",
        set: function(v) {
            // Check if the value is an object
            if (typeof v === 'object' && v !== null) {
              // Convert the object to a JSON string
              return JSON.stringify(v);
            }
            // Return the original value if not an object
            return v;
          }
        
    },
    price : Number,
    location : String ,
    country : String,
    reviews:[{
      type : Schema.Types.ObjectId,
      ref : "Review"
    }]
});

// Mongoose Middleware
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in : listing.reviews}});
  };
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;