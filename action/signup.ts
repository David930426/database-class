"use server";
import { SignUpSchema } from "@/lib/zod";
import { z } from "zod";
import bcrypt from "bcryptjs";
import sql from "mssql";
import { DbConnect } from "@/lib/db";
import { FormState } from "@/lib/types";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function singingUp(
  prevState: FormState | undefined,
  formData: FormData
) {
  const rawData = Object.fromEntries(formData.entries());
  try {
    const parsedData = SignUpSchema.parse(rawData);

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPasswordString = await bcrypt.hash(parsedData.password, salt);

    // insertUser(parsedData.username, parsedData.email, hashedPasswordString);
    // Set password to VARBINARY
    const hashBuffer = Buffer.from(hashedPasswordString, "utf8");
    const pool = await DbConnect();

    // EXECUTE SECURE INSERT QUERY
    await pool
      .request()
      .input("Username", sql.NVarChar, parsedData.username)
      .input("Email", sql.NVarChar, parsedData.email)
      .input("Password", sql.VarBinary, hashBuffer)
      .query(`INSERT INTO Users (Username, Email, Password)
              VALUES (@Username, @Email, @Password);
            `);
    console.log("\x1b[38;5;46mUser successfully inserted.\x1b[37m");

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
        errors: fieldErrors,
      };
    }

    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }
  revalidatePath("/login");
  redirect("/login");
}
