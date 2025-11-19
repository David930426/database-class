"use client";

import { getDataItem } from "@/action/getData";
import { GetItem } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { LoadingPage } from "@/components/loading";
import Link from "next/link";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { DeleteInventories } from "@/components/delete-inventories";

export function Table() {
  const [data, setData] = useState<GetItem[] | null>(null);
  const [ordProduct, setOrdProduct] = useState(true);
  const [ordBranch, setOrdBranch] = useState(true);
  const [dangerQuantity, setDangerQuantity] = useState(false);
  const [dangerExp, setDangerExp] = useState(false);
  const [refreshData, setRefreshData] = useState(0);

  const refresh = () => {
    setRefreshData(refreshData + 1);
  };

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
  }, [ordProduct, ordBranch, dangerQuantity, dangerExp, refreshData]);

  if (!data) {
    return <LoadingPage />;
  }

  return (
    <div className="overflow-x-auto mx-10">
      {data.length === 0 ? (
        <h1 className="text-3xl text-center mt-10 mb-10 md:text-5xl">
          There is no Inventory data
        </h1>
      ) : (
        <table className="max-md:min-w-screen md:w-full">
          <thead className="bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 text-zinc-100">
            <tr>
              <th className="h-15 min-w-30 rounded-l-xl md:w-[15%] md:h-20 md:text-xl">
                Product{" "}
                <button
                  onClick={() => setOrdProduct(!ordProduct)}
                  className={`size-4 hover:cursor-pointer md:size-5 ${
                    (dangerQuantity || dangerExp) && "hidden"
                  }`}
                >
                  {!ordProduct ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </button>
              </th>
              <th className="h-15 min-w-30 md:w-[20%] md:h-20 md:text-xl">
                Expired{" "}
                <button
                  onClick={() => {
                    setDangerExp(!dangerExp);
                  }}
                  className={`size-4 hover:cursor-pointer md:size-5 ${
                    dangerQuantity && "hidden"
                  }`}
                >
                  {dangerExp ? <EyeIcon /> : <EyeSlashIcon />}
                </button>
              </th>
              <th className="h-15 min-w-25 md:w-[10%] md:h-20 md:text-xl">
                Quantity{" "}
                <button
                  onClick={() => {
                    setDangerQuantity(!dangerQuantity);
                  }}
                  className={`size-4 hover:cursor-pointer md:size-5 ${
                    dangerExp && "hidden"
                  }`}
                >
                  {dangerQuantity ? <EyeIcon /> : <EyeSlashIcon />}
                </button>
              </th>
              <th className="h-15 min-w-25 md:w-[15%] md:h-20 md:text-xl">
                Branch{" "}
                <button
                  onClick={() => setOrdBranch(!ordBranch)}
                  className={`size-4 hover:cursor-pointer md:size-5 ${
                    (dangerQuantity || dangerExp) && "hidden"
                  }`}
                >
                  {!ordBranch ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </button>
              </th>
              <th className="h-15 min-w-25 md:w-[10%] md:h-20 md:text-xl">
                Location
              </th>
              <th className="h-15 min-w-20 md:w-[10%] md:h-20 md:text-xl">
                Section
              </th>
              <th className="h-15 md:w-[20%] rounded-r-xl md:h-20" />
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
                <tr key={index} className="md:text-xl">
                  <td className="h-25">
                    <span className="block text-zinc-400 text-xs md:text-base">
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
                    <span className="block text-zinc-400 text-xs md:text-base">
                      {item.BranchId}
                    </span>
                    {item.BranchName}
                  </td>
                  <td>{item.Location}</td>
                  <td>{item.SectionName}</td>
                  <td className="pr-5 flex pt-5 md:justify-center">
                    <Link
                      href={`/edit/${item.InventoryId}`}
                      className="bg-amber-400 py-3 px-5 mx-3 rounded-full text-zinc-100 hover:bg-amber-500 active:bg-amber-600"
                    >
                      Edit
                    </Link>
                    <DeleteInventories
                      inventoryId={Number(item.InventoryId)}
                      setRefreshData={() => {
                        refresh();
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
