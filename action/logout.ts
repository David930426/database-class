"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookie = await cookies();
  cookie.delete("session");
  revalidatePath("/login");
  redirect("/login");
}
