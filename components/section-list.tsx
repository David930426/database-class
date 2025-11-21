import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { TitleTable } from "@/components/ui/title-table";
import Link from "next/link";
import { DeleteAlert } from "@/components/ui/alert-dialog-delete";

export function SectionList() {
  return (
    <>
      <TitleTable link="">Branches</TitleTable>
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
          <tr key={""}>
            <td className="h-20">{"test"}</td>
            <td>{"test"}</td>
            <td>{"test"}</td>
            <td>{"test"}</td>
            <td className="flex gap-2 justify-items-center-safe">
              <Link href={`/product-branch/${"item.IndexProductId"}`}>
                <PencilSquareIcon className="size-6 my-6 hover:text-amber-400 active:text-amber-500" />
              </Link>
              {/* <DeleteAlert /> */}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
