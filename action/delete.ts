"use server";
import { DbConnect } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import sql from "mssql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteUser() {
  try {
    const cookieStore = await cookies()
    const cookie = cookieStore.get("session")?.value;
    const session = await decrypt(cookie);

    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("userId", sql.Int, session?.userId)
      .query(`DELETE FROM Users WHERE UserID = @userId`);   // DELETE USER
    if (result.rowsAffected[0] === 0) {
      console.log("Can not delete User");
    }
    cookieStore.delete("session");
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
  }

  revalidatePath("/login");
  redirect("/login");
}
