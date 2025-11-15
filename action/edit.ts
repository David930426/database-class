"use server";
import { DbConnect } from "@/lib/db";
import { FormState } from "@/lib/definitions";
import { decrypt } from "@/lib/session";
import { EditPasswordSchema, EditProfileSchema } from "@/lib/zod";
import { cookies } from "next/headers";
import sql from "mssql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import bcrypt from "bcryptjs";

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

export async function editPassword(
  prevState: FormState | undefined,
  formData: FormData
) {
  const rawData = Object.fromEntries(formData.entries());
  try {
    const parsedData = EditPasswordSchema.parse(rawData);
    const pool = await DbConnect();

    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    const result = await pool
      .request()
      .input("userId", sql.Int, session?.userId)
      .query(`SELECT Password FROM Users WHERE UserID = @userId`);

    const passwordToString = result.recordset[0].Password.toString("utf8");

    const isMatch = await bcrypt.compare(
      parsedData.oldPassword,
      passwordToString
    );

    if (!isMatch) {
      return {
        success: false,
        message: "Old password is incorrect!",
      };
    }

    const salt = await bcrypt.genSalt(10);
    const newPass = await bcrypt.hash(parsedData.newPassword, salt);

    const passInputDb = Buffer.from(newPass, "utf8");

    const inputDataResult = await pool
      .request()
      .input("UserId", sql.Int, session?.userId)
      .input("Password", sql.VarBinary, passInputDb)
      .query(`UPDATE Users SET Password = @Password WHERE UserID = @UserId`);

    if (inputDataResult.rowsAffected[0] === 0) {
      return {
        success: false,
        message: "New password is not updated",
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
  return {
    success: true,
  };
}
