"use client";
import { Products } from "@/lib/definitions";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { TitleTable } from "@/components/ui/title-table";
import { DeleteAlert } from "@/components/ui/alert-dialog-delete";
import { deleteProduct } from "@/action/product";

export function ProductList({
  data,
  setRefresh,
}: {
  data: Products[];
  setRefresh: () => void;
}) {
  const nowDate = new Date();
  nowDate.setHours(0, 0, 0, 0);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  thirtyDaysFromNow.setHours(0, 0, 0, 0);

  return (
    <>
      <TitleTable link="/product-branch/add-product">Products</TitleTable>
      <table className="w-full">
        <thead className="bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 text-zinc-100">
          <tr>
            <th className="rounded-l-xl h-15 w-10">Id</th>
            <th className="h-15 w-20">Name</th>
            <th className="h-15 w-30">Expired</th>
            <th className="h-15 w-25">Section Name</th>
            <th className="rounded-r-xl w-20"></th>
          </tr>
        </thead>
        <tbody className="capitalize divide-y divide-zinc-200 text-center">
          {data.map((item) => {
            return (
              <tr key={item.ProductId}>
                <td className="h-20">{item.ProductId}</td>
                <td>{item.ProductName}</td>
                <td>{item.ExpiredAt.toLocaleDateString()}</td>
                <td>{item.SectionName}</td>
                <td className="flex gap-2 justify-items-center-safe">
                  <Link href={`/product-branch/${item.IndexProductId}`}>
                    <PencilSquareIcon className="size-6 my-6 hover:text-amber-400 active:text-amber-500" />
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
