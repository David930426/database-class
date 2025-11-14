"use client";
import { ButtonPrimary } from "@/components/ui/button";
import { logout } from "@/action/logout";
import { getData } from "@/action/getData";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GetData } from "@/lib/definitions";
import { LoadingPage } from "@/components/loading";

export default function Home() {
  const [userData, setUserData] = useState<GetData | null>(null);
  useEffect(() => {
    const data = async () => {
      const dataGet = await getData();
      setUserData(dataGet as GetData);
    };
    data();
  }, []);
  if (!userData) {
    return <LoadingPage />;
  }
  return (
    <div className="px-10 pt-10">
      <h1 className="text-3xl font-bold text-zinc-400">Homepage</h1>
      <div className="flex justify-between mt-5 bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 text-zinc-100 p-7 rounded-xl">
        <p className="text-2xl">
          Hello,{" "}
          <Link
            href={"/edit"}
            className="hover:underline active:bg-zinc-100 active:text-zinc-900"
          >
            {userData.Username}
          </Link>
        </p>
        <form action={logout}>
          <ButtonPrimary type="submit" className="min-w-20" danger={true}>
            Logout
          </ButtonPrimary>
        </form>
      </div>
    </div>
  );
}
