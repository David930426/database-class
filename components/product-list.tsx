"use client";
import { Products } from "@/lib/definitions";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { TitleTable } from "@/components/ui/title-table";
import { DeleteAlert } from "@/components/ui/alert-dialog-delete";
import { deleteProduct } from "@/action/product";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

export function ProductList({
  data,
  setRefresh,
  setOrder,
  setProduct,
  setProductSearch,
}: {
  data: Products[];
  setRefresh: () => void;
  setOrder: () => void;
  setProduct: () => void;
  setProductSearch: (input: string) => void;
}) {
  const [expProduct, setExpProduct] = useState(false);
  const [productOrder, setProductOrder] = useState(true);

  const nowDate = new Date();
  nowDate.setHours(0, 0, 0, 0);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  thirtyDaysFromNow.setHours(0, 0, 0, 0);

  return (
    <>
      <TitleTable
        link="/product-branch/add-product"
        setSearchInput={setProductSearch}
      >
        Products
      </TitleTable>
      <table className="w-full">
        <thead className="bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 text-zinc-100 md:text-2xl">
          <tr>
            <th className="rounded-l-xl h-15 w-15 md:h-20">
              Id
              <button
                onClick={() => {
                  setProductOrder(!productOrder);
                  setProduct();
                }}
                className={`size-4 ml-0.5 hover:cursor-pointer md:size-5`}
              >
                {!productOrder ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </button>
            </th>
            <th className="h-15 w-20 md:h-20">Name</th>
            <th className="h-15 w-30 md:h-20">
              Expired{" "}
              <button
                onClick={() => {
                  setExpProduct(!expProduct);
                  setOrder();
                }}
                className={`size-4 hover:cursor-pointer md:size-5`}
              >
                {expProduct ? <EyeIcon /> : <EyeSlashIcon />}
              </button>
            </th>
            <th className="h-15 w-25 md:h-20">Section Name</th>
            <th className="rounded-r-xl w-20"></th>
          </tr>
        </thead>
        <tbody className="capitalize divide-y divide-zinc-200 text-center md:text-xl">
          {data.map((item) => {
            return (
              <tr key={item.ProductId}>
                <td className="h-20">{item.ProductId}</td>
                <td>{item.ProductName}</td>
                <td
                  className={
                    item.ExpiredAt < thirtyDaysFromNow
                      ? item.ExpiredAt < nowDate
                        ? "text-rose-500 font-semibold"
                        : "text-amber-500 font-semibold"
                      : ""
                  }
                >
                  {item.ExpiredAt.toLocaleDateString()}
                </td>
                <td>{item.SectionName}</td>
                <td className="flex gap-2 justify-items-center-safe">
                  <Link href={`/product-branch/${item.IndexProductId}`}>
                    <PencilSquareIcon className="size-6 my-6 hover:text-amber-400 active:text-amber-500 md:size-8" />
                  </Link>
                  <DeleteAlert
                    indexId={item.IndexProductId}
                    setRefresh={setRefresh}
                    name={item.ProductName}
                    deleteAction={deleteProduct}
                    tableName="Product"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
