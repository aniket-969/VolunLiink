import { z } from "zod";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const imageValidation = z
  .instanceof(File)
  .refine(
    (file) => {
      return ALLOWED_IMAGE_TYPES.includes(file.type);
    },
    {
      message: "Invalid file type. Only JPEG and PNG are allowed.",
    }
  )
  .refine(
    (file) => {
      return file.size <= MAX_IMAGE_SIZE;
    },
    {
      message: `File size should be less than ${
        MAX_IMAGE_SIZE / 1024 / 1024
      } MB.`,
    }
  );

const phoneSchema = z
  .string()
  .optional()
  .refine(
    (value) => {
      if (!value) return true;

      return /^\d{10}$/.test(value);
    },
    {
      message: "Phone number must be exactly 10 digits.",
    }
  );

const commonSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  contactEmail: z.string().email({ message: "Invalid email address" }),
  contactPhone: phoneSchema.optional(),
 startDate: z
  .string() 
  .transform((val) => (val === "" ? undefined : new Date(val)))
  .optional(),

endDate: z
  .string()
  .transform((val) => (val === "" ? undefined : new Date(val)))
  .optional(),

  avatar: imageValidation,
  country: z.string().optional(),
  county: z.string().optional(),
  road: z.string().optional(),
  state: z.string().optional(),
  village: z.string().optional(),
});

export const formSchema = commonSchema
  .extend({
    skillName: z.string().min(1, "Skill name is required").optional(),
    skillDescription: z.string().min(5, "Skill description is required").optional(),
    categoryName: z.string().min(1, "Category name is required").optional(),
    categoryDescription: z.string().min(5, "Category description is required").optional(),
  })
  .refine((data) => data.skillName || data.categoryName, {
    message: "Either skill or category must be provided",
  })
  .refine((data) => !(data.skills && data.category), {
    message: "You cannot provide both skill and category",
  });
