import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";

const postSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      country: String,
      county: String,
      road: String,
      state: String,
      village: String,
    },
    skills: [
      {
        skillName: String,
        description: String,
      },
    ],
    category: {
      categoryName: String,
      description: String,
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["Volunteer", "Organization"],
      required: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.path("skills").validate(function (value) {
  return this.skills || this.category;
}, "Either skills or category is required");
postSchema.index({ location: "2dsphere" });

postSchema.index({ role: 1 });

postSchema.index({ startDate: 1 });

export const Post = mongoose.model(
  "Post",
  postSchema
);
