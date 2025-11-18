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

export const EditPasswordSchema = z
  .object({
    oldPassword: z.string().min(8, "Password must be at least 8 characters."),
    newPassword: z.string().min(8, "Password must be at least 8 characters."),
    retypeNewPassword: z
      .string()
      .min(8, "Password must be at least 8 characters."),
  })
  .refine((data) => data.newPassword === data.retypeNewPassword, {
    message: "New password is not match",
    path: ["retypeNewPassword"],
  });

export const AddInventorySchema = z.object({
  product: z.string("Product must be a string"),
  branch: z.string("Branch must be a string"),
  quantity: z
    .string()
    .pipe(z.coerce.number())
    .pipe(z.number().min(0, "Quantity cannot be negative")),
});
