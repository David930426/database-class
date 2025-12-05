"use server";
import { DbConnect } from "@/lib/db";
import { FormState } from "@/lib/definitions";
import { createSession } from "@/lib/session";
import { LogInSchema } from "@/lib/zod";
import bcrypt from "bcryptjs";
import sql from "mssql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

export async function login(
  prevState: FormState | undefined,
  formData: FormData
) {
  const rawData = Object.fromEntries(formData.entries());
  try {
    const parsedData = LogInSchema.parse(rawData);
    const pool = await DbConnect();

    const result = await pool
      .request()
      .input("Username", sql.NVarChar, parsedData.username) // QUERY FOR LOGIN
      .query(`SELECT * FROM Users
            WHERE Username = @Username`);

    if (result.recordset.length === 0) {
      return {
        success: false,
        message: "Invalid username or password",
      };
    }

    // Catch the password and set password to bycrypt mode for compare
    const userRecord = result.recordset[0];
    const storedHash = userRecord.Password;
    const storedHashToString = storedHash.toString("utf8");

    const isMatch = await bcrypt.compare(parsedData.password, storedHashToString);

    if (!isMatch) {
      return {
        success: false,
        message: "Invalid username or password",
      };
    }
    await createSession(userRecord.UserID);

  } catch (err) {
    if (err instanceof ZodError) {
      const zodError = err as ZodError;

      const fieldErrors: Record<string, string> = {};
      for (const issue of zodError.issues) {
        const fieldName = issue.path[0] as string;

        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
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
  revalidatePath("/");
  redirect("/");
}
