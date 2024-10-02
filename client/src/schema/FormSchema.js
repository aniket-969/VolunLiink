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
      // Allow empty value for optional
      if (!value) return true;
      // Check if the value is exactly 10 digits
      return /^\d{10}$/.test(value);
    },
    {
      message: "Phone number must be exactly 10 digits.",
    }
  );

export const skillFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  contactEmail: z.string().email({ message: "Invalid email address" }),
  contactPhone: phoneSchema,
  skillName: z.string().min(1),
  skillDescription: z.string().min(10),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  avatar: imageValidation,
});

export const opportunityCategoryFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  contactEmail: z.string().email({ message: "Invalid email address" }),
  contactPhone: phoneSchema,
  categoryName: z.string().min(1),
  categoryDescription: z.string().min(10),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  avatar: imageValidation,
});
