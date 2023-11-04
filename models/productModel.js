import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      type: Boolean,
    },
    ratings:{
      type: Number,
      default: 0,
    },
    numofReviews:{
      type: Number,
      default: 0
    },
    reviews: [
      {
        user:{
          type: mongoose.Schema.ObjectId,
          ref: 'users',
          required:true
          
        },
        name:{
          type:String,
          required:true
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        }
      }
    ],
    user: {
      type:mongoose.Schema.ObjectId,
      ref: 'users',
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);