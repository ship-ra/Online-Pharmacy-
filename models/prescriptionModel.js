import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    id:{
      type: mongoose.Schema.ObjectId,
      ref: 'users',
      required:true
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Prescriptions", photoSchema);