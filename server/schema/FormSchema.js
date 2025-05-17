import { z } from "zod";

// Latitude and Longitude validation
const latitudeValidation = z
  .preprocess((val) => Number(val), z
    .number()
    .min(-90, { message: "Latitude must be ≥ -90" })
    .max( 90, { message: "Latitude must be ≤  90" })
  );

const longitudeValidation = z
  .preprocess((val) => Number(val), z
    .number()
    .min(-180, { message: "Longitude must be ≥ -180" })
    .max( 180, { message: "Longitude must be ≤  180" })
  );

const skillValidation = z.object({
  skillName: z
    .array(z.string().min(1, "Skill name cannot be empty"))
    .nonempty("At least one skill name is required"),
  description: z.string().min(5, "Skill description is required"),
});

const categoryValidation = z.object({
  categoryName: z
    .array(z.string().min(1, "Category name cannot be empty"))
    .nonempty("At least one category name is required"),
  description: z.string().min(5, "Category description is required"),
});

const commonSchema = z.object({
  title:        z.string().min(1),
  description:  z.string().min(10),
  contactEmail: z.string().email({ message: "Invalid email address" }),
  contactPhone: z.string().optional(),
  startDate:    z
    .string()
    .transform((val) => (val === "" ? undefined : new Date(val)))
    .optional(),
  endDate:      z
    .string()
    .transform((val) => (val === "" ? undefined : new Date(val)))
    .optional(),
  role:         z.enum(["Volunteer", "Organization"]),
  latitude:     latitudeValidation,
  longitude:    longitudeValidation,
  country:      z.string().optional(),
  county:       z.string().optional(),
  road:         z.string().optional(),
  state:        z.string().optional(),
  village:      z.string().optional(),
});

export const formSchema = commonSchema
  .extend({
    skills:   skillValidation.optional(),
    category: categoryValidation.optional(),
  })
  .refine(
    (data) => !!data.skills || !!data.category,
    { message: "Either skills or category must be provided", path: ["skills"] }
  )
  .refine(
    (data) => !(data.skills && data.category),
    { message: "You cannot provide both skills and category", path: ["category"] }
  );