"use server";
import { DbConnect } from "@/lib/db";
import { FormState } from "@/lib/definitions";
import { decrypt } from "@/lib/session";
import { EditProfileSchema } from "@/lib/zod";
import { cookies } from "next/headers";
import sql from "mssql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

export async function editProfile(
  prevState: FormState | undefined,
  formData: FormData
) {
  const rawData = Object.fromEntries(formData.entries());
  try {
    const parsedData = EditProfileSchema.parse(rawData);
    const pool = await DbConnect();

    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session) {
      redirect("/login");
    }

    const result = await pool
      .request()
      .input("Username", sql.NVarChar, parsedData.username)
      .input("Email", sql.NVarChar, parsedData.email)
      .input("UserId", sql.Int, session?.userId).query(`
        UPDATE Users
        SET Username = @Username, Email = @Email
        WHERE UserID = @UserId
        `);
    if (result.rowsAffected[0] === 0) {
      return {
        success: false,
        message: "User ID not found, profile not updated",
      };
    }
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
  revalidatePath("/");
  redirect("/");
}
