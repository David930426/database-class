"use client";
import Link from "next/link";
import { Input } from "@/components/ui/form";
import { ButtonPrimary } from "@/components/ui/button";
import { useActionState } from "react";
import { singingUp } from "@/action/signup";
import { FormState } from "@/lib/definitions";

export default function Register() {
  const initialState: FormState = {
    success: false,
    message: "",
    errors: undefined,
  };
  const [state, formAction, isPending] = useActionState(
    singingUp,
    initialState
  );
  return (
    <div className="w-screen h-screen bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 flex items-center">
      <div className="md:max-w-md max-w-3/4 mx-auto bg-zinc-100 rounded-xl px-7 py-10 shadow-2xl">
        <h1 className="text-center text-3xl font-bold mb-7">Sign Up</h1>
        <form action={formAction}>
          <Input
            id="username"
            type="text"
            placeholder="Your Username"
            className={state?.errors?.username && "border-red-500 border-2"}
            error={state?.errors?.username}
          />
          {state?.errors?.username && (
            <p className="text-red-500 text-sm ml-2">{state.errors.username}</p>
          )}
          <Input
            id="email"
            type="text"
            placeholder="Your Email"
            error={state?.errors?.email}
          />
          {state?.errors?.email && (
            <p className="text-red-500 text-sm ml-2">{state.errors.email}</p>
          )}
          <Input
            id="password"
            type="password"
            placeholder="Your Password"
            error={state?.errors?.password}
          />
          {state?.errors?.password && (
            <p className="text-red-500 text-sm ml-2">{state.errors.password}</p>
          )}
          <Input
            id="retypePassword"
            label="Retype Password"
            type="password"
            placeholder="Retype Your Password"
            error={state?.errors?.retypePassword}
          />
          {state?.errors?.retypePassword && (
            <p className="text-red-500 text-sm ml-2">
              {state.errors.retypePassword}
            </p>
          )}
          <Link href={"/login"}>
            <p className="mt-10 ml-2 text-sky-600 text-sm hover:text-sky-700 hover:underline">
              Already has an account
            </p>
          </Link>
          <ButtonPrimary type="submit" disable={isPending}>
            {isPending ? "Loading" : "Sign Up"}
          </ButtonPrimary>
        </form>
        {!state?.success && (
          <p className="text-sm text-red-500 mt-5">{state?.message}</p>
        )}
      </div>
    </div>
  );
}
