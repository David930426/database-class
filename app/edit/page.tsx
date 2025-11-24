"use client";
import { deleteUser } from "@/action/delete";
import { editProfile } from "@/action/edit";
import { getDataUser } from "@/action/getData";
import { LoadingPage } from "@/components/loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Back } from "@/components/ui/back";
import { ButtonPrimary } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { GetData } from "@/lib/definitions";
import { initialState } from "@/lib/initialState";
import { TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

export default function Page() {
  const [data, setData] = useState<GetData | null>(null);
  const [state, editProfileAction] = useActionState(editProfile, initialState);
  const { pending } = useFormStatus();
  useEffect(() => {
    const dataGet = async () => {
      const dataFromDb = await getDataUser();
      setData(dataFromDb);
    };
    dataGet();
  }, []);
  if (!data) {
    return <LoadingPage />;
  }
  return (
    <div className="px-10 pt-5">
      <Back href="/" />
      <div className="bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 p-7 pr-10 items-center rounded-xl flex justify-between md:py-10">
        <h1 className="text-3xl text-zinc-100 font-bold md:text-4xl">
          Edit Profile
        </h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <TrashIcon className="size-11 p-2 text-rose-500 rounded-full hover:bg-zinc-100 hover:cursor-pointer hover:text-rose-600 active:text-rose-700 active:bg-zinc-200 md:size-14" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure want to delete your <span>{data.Username}</span>{" "}
                account?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={pending}
                className="hover:cursor-pointer"
              >
                Cancel
              </AlertDialogCancel>
              <form>
                <AlertDialogAction
                  className={`bg-rose-500 hover:bg-rose-600 active:bg-rose-700 w-full  ${
                    pending ? "cursor-wait" : "cursor-pointer"
                  }`}
                  formAction={deleteUser}
                  type="submit"
                  disabled={pending}
                >
                  {pending ? <Spinner className="size-6" /> : "Sure"}
                </AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <form action={editProfileAction} className="px-2">
        <Input
          type="text"
          id="username"
          labelClass="text-xl md:text-2xl"
          className="text-xl"
          defaultValue={data?.Username}
          error={state.errors?.username}
        />
        <p className="text-red-500 text-sm ml-2 mt-1 md:text-base">
          {state.errors?.username}
        </p>
        <Input
          type="text"
          id="email"
          labelClass="text-xl md:text-2xl"
          className="text-xl"
          defaultValue={data?.Email}
          error={state.errors?.email}
        />
        <p className="text-red-500 text-sm ml-2 mt-1 md:text-base">
          {state.errors?.email}
        </p>
        <p className="ml-2 mt-5 text-sky-500 hover:text-sky-600 hover:underline active:sky-700 md:text-lg">
          <Link href={"/edit/password"}>Change Password</Link>
        </p>
        <p className="text-red-500 ml-3 mt-5">
          {!state.success && state?.message}
        </p>
        <div className="md:flex md:justify-end-safe">
          <ButtonPrimary type="submit" className="w-full mt-10 mb-5 md:text-xl md:w-50">
            Edit Profile
          </ButtonPrimary>
        </div>
      </form>
    </div>
  );
}
