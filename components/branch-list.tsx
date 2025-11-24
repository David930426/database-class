"use client";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { TitleTable } from "@/components/ui/title-table";
import Link from "next/link";
import { DeleteAlert } from "@/components/ui/alert-dialog-delete";
import { Branches } from "@/lib/definitions";
import { deleteBranch } from "@/action/branch";
import { useState } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

export function BranchList({
  data,
  setRefresh,
  branchOrder,
}: {
  data: Branches[];
  setRefresh: () => void;
  branchOrder: () => void;
}) {
  const [orderByBranch, setOrderByBranch] = useState(true);
  return (
    <>
      <TitleTable link="/product-branch/add-branch">Branches</TitleTable>
      <table className="w-full">
        <thead className="bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 text-zinc-100 md:text-2xl">
          <tr>
            <th className="rounded-l-xl h-15 w-20 md:h-20">
              Id
              <button
                onClick={() => {
                  setOrderByBranch(!orderByBranch);
                  branchOrder();
                }}
                className={`size-4 ml-0.5 hover:cursor-pointer md:size-5`}
              >
                {!orderByBranch ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </button>
            </th>
            <th className="h-15 w-20 md:h-20">Name</th>
            <th className="h-15 w-30 md:h-20">Location</th>
            <th className="rounded-r-xl w-20 md:h-20"></th>
          </tr>
        </thead>
        <tbody className="capitalize divide-y divide-zinc-200 text-center md:text-xl">
          {data.map((item) => (
            <tr key={item.BranchId}>
              <td className="h-20">{item.BranchId}</td>
              <td>{item.BranchName}</td>
              <td>{item.Location}</td>
              <td className="flex gap-3 justify-items-center-safe">
                <Link
                  href={`/product-branch/edit-branch/${item.IndexBranchId}`}
                >
                  <PencilSquareIcon className="size-6 my-6 hover:text-amber-400 active:text-amber-500 md:size-8" />
                </Link>
                <DeleteAlert
                  indexId={item.IndexBranchId}
                  setRefresh={setRefresh}
                  name={item.BranchName}
                  deleteAction={deleteBranch}
                  tableName="Branch"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
