"use client";
import { editPassword } from "@/action/edit";
import { ButtonPrimary } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { initialState } from "@/lib/initialState";
import Link from "next/link";
import { useActionState } from "react";

export default function Page() {
  const [state, editPasswordAction] = useActionState(
    editPassword,
    initialState
  );
  return (
    <div className="px-10 pt-5">
      <p className="text-zinc-500 text-3xl mb-10">
        <Link
          href="/edit"
          className="hover:bg-zinc-300 active:bg-zinc-400 rounded-full px-3 pb-1"
        >
          {"<"}
        </Link>
      </p>
      <h1 className="bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 p-7 rounded-xl text-3xl text-zinc-100 font-bold">
        Change Password
      </h1>
      <form action={editPasswordAction} className="px-2">
        <Input
          type="password"
          id="oldPassword"
          label="Old Password"
          labelClass="text-xl"
          error={state.errors?.oldPassword}
        />
        <p className="text-red-500 text-sm ml-2 mt-1">
          {state.errors?.oldPassword}
        </p>
        <Input
          type="password"
          id="newPassword"
          label="New Password"
          labelClass="text-xl"
          error={state.errors?.newPassword}
        />
        <p className="text-red-500 text-sm ml-2 mt-1">
          {state.errors?.newPassword}
        </p>
        <Input
          type="password"
          id="retypeNewPassword"
          label="Retype New Password"
          labelClass="text-xl"
          error={state.errors?.retypeNewPassword}
        />
        <p className="text-red-500 text-sm ml-2 mt-1">
          {state.errors?.retypeNewPassword}
        </p>
        <p className="text-red-500 ml-3 mt-5">
          {!state.success && state?.message}
        </p>
        <ButtonPrimary type="submit" className="w-full my-10">
          Edit Password
        </ButtonPrimary>
        
      </form>
    </div>
  );
}
