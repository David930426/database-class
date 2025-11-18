"use client";

import { getDataItem } from "@/action/getData";
import { GetItem } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { LoadingPage } from "@/components/loading";
import Link from "next/link";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export function Table() {
  const [data, setData] = useState<GetItem[] | null>(null);
  const [ordProduct, setOrdProduct] = useState(true);
  const [ordBranch, setOrdBranch] = useState(true);
  const [dangerQuantity, setDangerQuantity] = useState(false);
  const [dangerExp, setDangerExp] = useState(false);
  const nowDate = new Date();
  nowDate.setHours(0, 0, 0, 0);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  thirtyDaysFromNow.setHours(0, 0, 0, 0);
  useEffect(() => {
    const searchData = async () => {
      const getData = await getDataItem(
        ordProduct,
        ordBranch,
        dangerQuantity,
        dangerExp
      );
      setData(getData);
    };
    searchData();
  }, [ordProduct, ordBranch, dangerQuantity, dangerExp]);
  if (!data) {
    return <LoadingPage />;
  }
  return (
    <div className="overflow-x-auto mx-10">
      <table className="min-w-screen">
        <thead className="bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 text-zinc-100">
          <tr>
            <th className="h-15 min-w-30 rounded-l-xl">
              Product{" "}
              <button
                onClick={() => setOrdProduct(!ordProduct)}
                className={`size-4 hover:cursor-pointer ${
                  (dangerQuantity || dangerExp) && "hidden"
                }`}
              >
                {!ordProduct ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </button>
            </th>
            <th className="h-15 min-w-30">
              Expired{" "}
              <button
                onClick={() => {
                  setDangerExp(!dangerExp);
                }}
                className={`size-4 hover:cursor-pointer ${
                  dangerQuantity && "hidden"
                }`}
              >
                {dangerExp ? <EyeIcon /> : <EyeSlashIcon />}
              </button>
            </th>
            <th className="h-15 min-w-25">
              Quantity{" "}
              <button
                onClick={() => {
                  setDangerQuantity(!dangerQuantity);
                }}
                className={`size-4 hover:cursor-pointer ${
                  dangerExp && "hidden"
                }`}
              >
                {dangerQuantity ? <EyeIcon /> : <EyeSlashIcon />}
              </button>
            </th>
            <th className="h-15 min-w-25">
              Branch{" "}
              <button
                onClick={() => setOrdBranch(!ordBranch)}
                className={`size-4 hover:cursor-pointer ${
                  (dangerQuantity || dangerExp) && "hidden"
                }`}
              >
                {!ordBranch ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </button>
            </th>
            <th className="h-15 min-w-25">Location</th>
            <th className="h-15 min-w-20 px-2">Section</th>
            <th className="h-15 rounded-r-xl" />
          </tr>
        </thead>
        <tbody className="capitalize divide-y divide-zinc-200 text-center">
          {data.map((item, index) => {
            const expiredDate = new Date(item.ExpiredAt);
            expiredDate.setHours(0, 0, 0, 0);

            const thirtydays =
              expiredDate <= thirtyDaysFromNow && expiredDate > nowDate;

            const alreadyExp = expiredDate < nowDate;
            return (
              <tr key={index}>
                <td className="h-25">
                  <span className="block text-zinc-400 text-xs">
                    {item.ProductId}
                  </span>
                  {item.ProductName}
                </td>
                <td
                  className={`${
                    thirtydays
                      ? "text-yellow-400 font-semibold"
                      : alreadyExp
                      ? "text-rose-500 font-bold"
                      : ""
                  }`}
                >
                  {item.ExpiredAt.toDateString()}
                </td>
                <td>
                  <span
                    className={`text-zinc-100  font-bold px-3 py-1 rounded-full ${
                      item.Quantity < 12
                        ? "bg-rose-500"
                        : item.Quantity < 15
                        ? "bg-yellow-400"
                        : "bg-green-400"
                    }`}
                  >
                    {item.Quantity}
                  </span>
                </td>
                <td>
                  <span className="block text-zinc-400 text-xs">
                    {item.BranchId}
                  </span>
                  {item.BranchName}
                </td>
                <td>{item.Location}</td>
                <td>{item.SectionName}</td>
                <td className="pr-5">
                  <Link href="" className="bg-amber-400 py-3 px-5 mx-3 rounded-full text-zinc-100 hover:bg-amber-500 active:bg-amber-600">Edit</Link>
                  <Link href="" className="bg-rose-500 py-3 px-5 rounded-full text-zinc-100 hover:bg-rose-600 active:bg-rose-700">Delete</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
