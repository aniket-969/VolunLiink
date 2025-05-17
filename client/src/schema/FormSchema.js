import { z } from "zod";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const blankToUndefined = (val: any) =>
  typeof val === "string" && val.trim() === "" ? undefined : val;

// common fields
const baseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 chars"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{10}$/.test(v), "Phone must be 10 digits"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  avatar: z
    .instanceof(File)
    .refine((f) => ALLOWED_IMAGE_TYPES.includes(f.type), "Only JPEG/PNG")
    .refine(
      (f) => f.size <= MAX_IMAGE_SIZE,
      `< ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
    ),
  country: z.string().optional(),
  county: z.string().optional(),
  road: z.string().optional(),
  state: z.string().optional(),
  village: z.string().optional(),
});

const skillObject = z.object({
  skillName: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .nonempty("Pick at least one skill"),
  description: z.string().min(5, "Skill description is required"),
});

const categoryObject = z.object({
  categoryName: z
    .array(z.string().min(1, "Category cannot be empty"))
    .nonempty("Pick at least one category"),
  description: z.string().min(5, "Category description is required"),
});

export const volunteerSchema = baseSchema
  .extend({
    skills: skillObject.optional(),
  })
  .refine((data) => !!data.skills, {
    message: "You must provide skills",
    path: ["skills"],
  });

export const organizationSchema = baseSchema
  .extend({
    category: categoryObject.optional(),
  })
  .refine((data) => !!data.category, {
    message: "You must provide a category",
    path: ["category"],
  });
