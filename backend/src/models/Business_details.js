import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  businessName: {
    type: String,
    required: true,
    trim: true
  },
  businessAddress: {
    type: String,
    required: true,
    trim: true
  },
  businessImage: {
    type: String,                //ye cloudinary wla rahega 
    required: true

  },
  businessDescription: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  businessCategory: {
    type: String,
    required: true,
    trim: true
  },
  businessType: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    required: true,
    trim: true
  },
  openTime: {
    type: String,
    required: true
  },
  closeTime: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],   // [ longitude, latitude ]
      required: true
    }
  }
}, { timestamps: true });

// Geospatial index for “near me” queries
businessSchema.index({ location: "2dsphere" });

// Text index for smart fuzzy‐search on category/type/name/description
businessSchema.index({
  businessCategory: "text",
  businessType: "text",
  businessName: "text",
  businessDescription: "text"
}, {
  weights: {
    businessName: 2,
    businessCategory: 5,
    businessType: 4,
    businessDescription: 1
  },
  default_language: "english"
});

export const BusinessDetail = mongoose.model("BusinessDetail", businessSchema);

