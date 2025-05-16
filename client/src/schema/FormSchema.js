// src/schema/FormSchema.js
import { z } from "zod";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

// turn blank strings into undefined so .min() only runs when there’s actual content
const blankToUndefined = (val) =>
  typeof val === "string" && val.trim() === "" ? undefined : val;

// common fields for both forms
const baseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 chars"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{10}$/.test(v), "Phone number must be exactly 10 digits"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  avatar: z
    .instanceof(File)
    .refine((f) => ALLOWED_IMAGE_TYPES.includes(f.type), {
      message: "Invalid file type. Only JPEG and PNG are allowed.",
    })
    .refine((f) => f.size <= MAX_IMAGE_SIZE, {
      message: `File size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024} MB.`,
    }),
  country: z.string().optional(),
  county: z.string().optional(),
  road: z.string().optional(),
  state: z.string().optional(),
  village: z.string().optional(),
});

// volunteer schema: only skill fields
export const volunteerSchema = baseSchema
  .extend({
    skillName: z.preprocess(blankToUndefined, z.string().min(1, "Skill name is required")),
    skillDescription: z.preprocess(
      blankToUndefined,
      z.string().min(5, "Skill description is required")
    ),
  })
  .refine(
    (data) => data.skillName && data.skillDescription,
    {
      message: "Both skill name and description are required",
      path: ["skillDescription"],
    }
  );

// organization schema: only category fields
export const organizationSchema = baseSchema
  .extend({
    categoryName: z.preprocess(blankToUndefined, z.string().min(1, "Category name is required")),
    categoryDescription: z.preprocess(
      blankToUndefined,
      z.string().min(5, "Category description is required")
    ),
  })
  .refine(
    (data) => data.categoryName && data.categoryDescription,
    {
      message: "Both category name and description are required",
      path: ["categoryDescription"],
    }
  );
