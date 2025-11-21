"use client";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { TitleTable } from "@/components/ui/title-table";
import Link from "next/link";
import { DeleteAlert } from "@/components/ui/alert-dialog-delete";
import { GetSection } from "@/lib/definitions";
import { deleteSection } from "@/action/section";

export function SectionList({
  data,
  refreshPage,
}: {
  data: GetSection[];
  refreshPage: () => void;
}) {
  return (
    <>
      <TitleTable link="/product-branch/add-section">Sections</TitleTable>
      <table className="w-full">
        <thead className="bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 text-zinc-100">
          <tr>
            <th className="rounded-l-xl h-15 w-75">Name</th>
            <th className="rounded-r-xl"></th>
          </tr>
        </thead>
        <tbody className="capitalize divide-y divide-zinc-200 text-center">
          {data.map((item) => (
            <tr key={item.SectionId}>
              <td>{item.SectionName}</td>
              <td className="flex gap-4 justify-items-center-safe">
                <Link href={`/product-branch/edit-section/${item.SectionId}`}>
                  <PencilSquareIcon className="size-6 my-6 hover:text-amber-400 active:text-amber-500" />
                </Link>
                <DeleteAlert
                  indexId={item.SectionId}
                  name={item.SectionName}
                  tableName="Section"
                  deleteAction={deleteSection}
                  setRefresh={refreshPage}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
