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

const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long." })
  .max(20, {
    message: "Password must not exceed 128 characters.",
  })
  .refine((value) => /[0-9]/.test(value), {
    message: "Password must contain at least one numerical digit.",
  })
  .refine((value) => /[!@#$%^&*]/.test(value), {
    message: "Password must contain at least one special character.",
  });

export const userSchema = z.object({
  username: z
    .string()
    .min(1,{message:"Username can't be empty"})
    .max(30, { message: "Username must not exceed 15 characters" }),
  password: passwordSchema,
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(254, { message: "Email must not exceed 254 characters" }),
  fullName: z
    .string()
    .min(1, { message: "Full name is required" })
    .max(30, { message: "Username must not exceed 30 characters" })
    .refine((value) => /^[A-Za-z\s]+$/.test(value), {
      message: "Full name must contain only alphabets and spaces",
    }),
  avatar: imageValidation,
});

export const loginSchema = z.object({
  identifier: z.string().min(1,{message:"Identifier can't be empty"}).max(50, {
    message: "Identifier must not exceed 128 characters",
  }),
  password: passwordSchema,
});

