import z from "zod";

export const loginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(200, {
      message: "Email must be at most 200 characters long",
    }),

  password: z
    .string()
    .trim()
    .min(6, {
      message: "Password must be at least 6 characters long",
    })
    .max(100, { message: "Password must be at most 100 characters long" }),
});

export const registerUserSchema = loginUserSchema.extend({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(20, { message: "Name must be at most 20 characters long" }),
});
