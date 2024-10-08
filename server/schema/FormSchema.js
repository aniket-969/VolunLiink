import { z } from 'zod';
import { isValidObjectId } from 'mongoose';

// Latitude and Longitude validation
const latitudeValidation = z.string().refine((value) => value >= -90 && value <= 90, {
  message: "Latitude must be between -90 and 90",
});

const longitudeValidation = z.string().refine((value) => value >= -180 && value <= 180, {
  message: "Longitude must be between -180 and 180",
});

// ObjectId validation
const objectIdValidation = z
  .string()
  .refine((value) => isValidObjectId(value), {
    message: "Invalid ObjectId format",
  });


const commonSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  contactEmail: z.string().email({ message: 'Invalid email address' }),
  contactPhone: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  role: z.enum(["Volunteer", "Organization"]),
  latitude: latitudeValidation,
  longitude: longitudeValidation,
  country:z.string().optional(),
  county:z.string().optional(),
  road:z.string().optional(),
  state:z.string().optional(),
  village:z.string().optional(),
});

export const formSchema = commonSchema.extend({
  skillId: objectIdValidation.optional(),  
  categoryId: objectIdValidation.optional(),  
}).refine((data) => data.skillId || data.categoryId, {
  message: 'Either skillId or categoryId must be provided',
}).refine((data) => !(data.skillId && data.categoryId), {
  message: 'You cannot provide both skillId and categoryId',
});

