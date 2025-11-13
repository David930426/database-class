"use client";
import { ButtonPrimary } from "@/components/ui/button";
import { logout } from "@/action/logout";

export default function Home() {
  return (
    <>
      <h1>Main page</h1>
      <form action={logout}>
        <ButtonPrimary type="submit" className="min-w-23">
          Logout
        </ButtonPrimary>
      </form>
    </>
  );
}
