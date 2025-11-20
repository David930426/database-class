import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export function BranchList() {
  return (
    <>
      <h1 className="text-2xl text-zinc-400 font-semibold mt-10 ml-3 mb-5">
        Branches
      </h1>
      <table>
        <thead className="bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 text-zinc-100">
          <tr>
            <th className="rounded-l-xl h-15 w-15">Id</th>
            <th className="h-15 w-20">Name</th>
            <th className="h-15 w-30">Expired</th>
            <th className="h-15 w-25">Section Name</th>
            <th className="rounded-r-xl w-20"></th>
          </tr>
        </thead>
        <tbody className="capitalize divide-y divide-zinc-200 text-center">
          <tr>
            <td>test</td>
            <td>test</td>
            <td>test</td>
            <td>tset</td>
            <td className="flex gap-2 justify-center">
              <PencilSquareIcon className="size-6" />
              <TrashIcon className="size-6" />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
