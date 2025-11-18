"use client";

import { getDataItem } from "@/action/getData";
import { GetItem } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { LoadingPage } from "@/components/loading";

export function Table() {
  const [data, setData] = useState<GetItem[] | null>(null);
  const nowDate = new Date();
  nowDate.setHours(0, 0, 0, 0);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  thirtyDaysFromNow.setHours(0, 0, 0, 0);
  useEffect(() => {
    const searchData = async () => {
      const getData = await getDataItem();
      setData(getData);
    };
    searchData();
  }, []);
  if (!data) {
    return <LoadingPage />;
  }
  return (
    <table className="w-8/9 mx-auto">
      <thead className="bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 text-zinc-100">
        <tr>
          <th className="h-15 w-[20%] rounded-l-xl">Product</th>
          <th className="h-15 w-[28%]">Expired</th>
          <th className="h-15 w-[5%]">Quantity</th>
          <th className="h-15 w-[20%]">Branch</th>
          <th className="h-15 w-[15%]">Location</th>
          <th className="h-15 w-[12%] rounded-r-xl px-2">Section</th>
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
                  className={`text-zinc-100  font-bold px-2 py-1 rounded-full ${
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
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
