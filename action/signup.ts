"use server"
import { SignUpSchema } from "@/lib/zod";
import { z } from "zod";
import { insertUser } from "./insertUser";
import bcrypt from "bcryptjs";

// Define the structure of the object returned by the server action
export interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export async function singingUp(prevState: FormState, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  try {
    const parsedData = SignUpSchema.parse(rawData);

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPasswordString = await bcrypt.hash(parsedData.password, salt);

    insertUser(parsedData.username, parsedData.email, hashedPasswordString);

  } catch (err) {
    if (err instanceof z.ZodError) {
      const zodError = err as z.ZodError;

      const fieldErrors: Record<string, string> = {};

      for (const issue of zodError.issues) {
        const fieldName = issue.path[0] as string;

        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }

      // Return the field errors object
      return {
        success: false,
        message: "Validation failed. Check fields.",
        errors: fieldErrors,
      };
    }

    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }
  return {
    success: true,
    message: "an account has been added",
  };
}
