import {z} from 'zod'

const passwordSchema = z.string()
  .min(6, { message: "Password must be at least 6 characters long." })
  .refine(value => /[0-9]/.test(value), {
    message: "Password must contain at least one numerical digit.",
  })
  .refine(value => /[!@#$%^&*]/.test(value), {
    message: "Password must contain at least one special character.",
  });
  
export const userSchema = z.object({
    username:z.string().min(1),
    password:passwordSchema,
    email:z.string().email({message:"Invalid email address"}),
    fullName:z.string().min(1),

})

export const loginSchema = z.object({
    username:z.string().min(1).optional(),
    email:z.string().email().optional(),
    password:passwordSchema
}).refine(data=>data.username || data.email,{
    message:"Either username or email must be provided."
})

