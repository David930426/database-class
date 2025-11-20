"use client";
import { Products } from "@/lib/definitions";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { deleteProduct } from "@/action/product";
import { Spinner } from "@/components/ui/spinner";

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

  const [isDeleting, setIsDeleting] = useState(false);
  const [closeDialog, setCloseDialog] = useState(false);

  let indexProductId: number;
  const clickDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await deleteProduct(indexProductId);
      setRefresh();
      setCloseDialog(false);
    } catch (err) {
      console.error("An unexpected error occurred:", err);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <>
      <div className="flex justify-between mx-5 mt-10 mb-5">
        <h1 className="text-2xl text-zinc-400 font-semibold ">Products</h1>
        <Link
          href="/product-branch/add-product"
          className="bg-linear-to-r from-sky-400 to-sky-500 flex justify-center items-center text-4xl px-2.5 pb-1 rounded-xl text-zinc-100 hover:from-sky-500 hover:to-sky-600 active:from-sky-600 active:to-sky-700"
        >
          +
        </Link>
      </div>
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
            indexProductId = item.IndexProductId;
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
                  <AlertDialog
                    open={closeDialog}
                    onOpenChange={() => {
                      setCloseDialog(!closeDialog);
                    }}
                  >
                    <AlertDialogTrigger>
                      <TrashIcon className="size-6 my-6 hover:text-rose-500 active:text-rose-600 hover:cursor-pointer" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete product</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure want to delete the {item.ProductName}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="hover:cursor-pointer">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-rose-500 hover:bg-rose-600 active:bg-rose-700 hover:cursor-pointer"
                          onClick={clickDelete}
                        >
                          {isDeleting ? <Spinner className="size-5" /> : "Sure"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
