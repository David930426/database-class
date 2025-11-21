"use client";
import { ButtonPrimary } from "@/components/ui/button";
import { logout } from "@/action/logout";
import { getDataUser } from "@/action/getData";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GetData } from "@/lib/definitions";
import { LoadingPage } from "@/components/loading";
import { Table } from "@/components/table";

export default function Home() {
  const [userData, setUserData] = useState<GetData | null>(null);
  useEffect(() => {
    const data = async () => {
      const dataGet = await getDataUser();
      setUserData(dataGet as GetData);
    };
    data();
  }, []);
  if (!userData) {
    return <LoadingPage />;
  }
  return (
    <>
      <div className="p-10">
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
      <div className="flex justify-between mx-10 mb-5 items-center">
        <h1 className="w-8/9 px-5 mb-3 text-2xl text-zinc-400 font-bold md:text-4xl md:mb-5">
          Inventories
        </h1>
        <Link
          href="/product-branch"
          className="w-45 text-md text-center bg-sky-400 hover:bg-sky-500 active:bg-sky-600 text-zinc-100 p-2 rounded-lg font-semibold"
        >
          See All Data
        </Link>
      </div>
      <Table />
      <div className="flex justify-end mb-15 mt-7 pr-10 md:mt-10 md:mr-15 md:text-xl">
        <Link
          href="/addInventory"
          className="bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-zinc-100 rounded-full p-3 md:p-4"
        >
          Add Inventory
        </Link>
      </div>
    </>
  );
}
