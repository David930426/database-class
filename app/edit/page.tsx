"use client";
import { editProfile } from "@/action/edit";
import { getData } from "@/action/getData";
import { LoadingPage } from "@/components/loading";
import { ButtonPrimary } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { GetData } from "@/lib/definitions";
import { initialState } from "@/lib/initialState";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<GetData | null>(null);
  const [state, editProfileAction] = useActionState(editProfile, initialState);
  useEffect(() => {
    const dataGet = async () => {
      const dataFromDb = await getData();
      setData(dataFromDb);
    };
    dataGet();
  }, []);
  if (!data) {
    return <LoadingPage />;
  }
  return (
    <div className="px-10 pt-5">
      <p className="text-zinc-500 text-3xl mb-10">
        <Link
          href="/"
          className="hover:bg-zinc-300 active:bg-zinc-400 rounded-full px-3 pb-1"
        >
          {"<"}
        </Link>
      </p>
      <h1 className="bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 p-7 rounded-xl text-3xl text-zinc-100 font-bold">
        Edit Profile
      </h1>
      <form action={editProfileAction} className="px-2">
        <Input
          type="text"
          id="username"
          labelClass="text-xl"
          defaultValue={data?.Username}
          error={state.errors?.username}
        />
        <p className="text-red-500 text-sm ml-2 mt-1">
          {state.errors?.username}
        </p>
        <Input
          type="text"
          id="email"
          labelClass="text-xl"
          defaultValue={data?.Email}
          error={state.errors?.email}
        />
        <p className="text-red-500 text-sm ml-2 mt-1">{state.errors?.email}</p>
        {/* <Input type="password" id="oldPassword" label="Old Password" labelClass="text-xl" />
        <Input type="password" id="newPassword"  label="New Password" labelClass="text-xl" />
        <Input type="password" id="retypeNewPassword" label="Retype New Password" labelClass="text-xl" /> */}
        <p className="text-red-500 ml-3 mt-5">
          {!state.success && state?.message}
        </p>
        <ButtonPrimary type="submit" className="w-full my-10">
          Edit
        </ButtonPrimary>
      </form>
    </div>
  );
}
