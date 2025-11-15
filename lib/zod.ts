import * as z from "zod";

export const SignUpSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(50, "Username con not more than 50 characters"),
    email: z.email("Invalid email address format.").max(100, "Email too long"),
    password: z.string().min(8, "Password must be at least 8 characters."),
    retypePassword: z
      .string()
      .min(8, "Password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.retypePassword, {
    // This message will be returned if the refinement fails
    message: "Passwords do not match.",
    // This tells Zod which field to attach the error to
    path: ["retypePassword"],
  });

export const LogInSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(50, "Username con not more than 50 characters"),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const EditProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(50, "Username con not more than 50 characters"),
  email: z.email("Invalid email address format.").max(100, "Email too long"),
});
