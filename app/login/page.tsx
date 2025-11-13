"use client";
import Link from "next/link";
import { Input } from "@/components/ui/form";
import { ButtonPrimary } from "@/components/ui/button";
import { useActionState } from "react";
import { FormState } from "@/lib/types";
import { login } from "@/action/login";

export default function Login() {
  const initialState: FormState = {
    success: false,
    message: "",
    errors: undefined,
  };
  const [state, loginAction, isPending] = useActionState(login, initialState);
  return (
    <div className="w-screen h-screen bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 flex items-center">
      <div className="md:max-w-md max-w-3/4 mx-auto bg-zinc-100 rounded-xl px-7 py-10 shadow-2xl">
        <h1 className="text-center text-3xl font-bold mb-7">Login</h1>
        <form action={loginAction}>
          <Input
            id="username"
            type="text"
            placeholder="Your Username"
            error={!state.success && state.message}
          />
          <Input
            id="password"
            type="password"
            placeholder="Your Password"
            error={!state.success && state.message}
          />
          <Link href={"/register"}>
            <p className="mt-10 ml-2 text-sky-600 text-sm hover:text-sky-700 hover:underline">
              Doesn&apos;t have an account
            </p>
          </Link>
          <ButtonPrimary type="submit" disable={isPending}>
            {isPending ? "Loading" : "Login"}
          </ButtonPrimary>
          {!state?.success && (
            <p className="ml-2 text-sm mt-5 text-red-600">{state?.message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
