
import mongoose, { Schema } from "mongoose";

// Sub-schema for the single skills object 
const SkillSubSchema = new Schema({
  skillName: {
    type: [String],
    required: true,
    validate: {
      validator: arr => Array.isArray(arr) && arr.length > 0,
      message: "At least one skill name is required",
    },
  },
  description: {
    type: String,
    required: true,
  },
}, { _id: false });

// Sub-schema for the single category object 
const CategorySubSchema = new Schema({
  categoryName: {
    type: [String],
    required: true,
    validate: {
      validator: arr => Array.isArray(arr) && arr.length > 0,
      message: "At least one category name is required",
    },
  },
  description: {
    type: String,
    required: true,
  },
}, { _id: false });

//  Main Post schema 
const postSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
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
    county:  String,
    road:    String,
    state:   String,
    village: String,
  },

  skills: {
    type: SkillSubSchema,
    required: false,
  },

  category: {
    type: CategorySubSchema,
    required: false,
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
}, {
  timestamps: true,
});

postSchema.pre("validate", function(next) {
  const hasSkills   = this.skills   && Array.isArray(this.skills.skillName)   && this.skills.skillName.length > 0;
  const hasCategory = this.category && Array.isArray(this.category.categoryName) && this.category.categoryName.length > 0;

  if (!hasSkills && !hasCategory) {
    this.invalidate("skills",   "Either skills or category must be provided");
    this.invalidate("category", "Either skills or category must be provided");
  }

  if (hasSkills && hasCategory) {
    this.invalidate("category", "You cannot provide both skills and category");
  }

  next();
});

postSchema.index({ location: "2dsphere" });
postSchema.index({ role: 1 });
postSchema.index({ startDate: 1 });

export const Post = mongoose.model("Post", postSchema);
