"use client";
import { getProductAuditLog } from "@/action/productAudit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductAuditLog } from "@/lib/definitions";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export function HistoryList() {
  const [data, setData] = useState<ProductAuditLog[] | null>(null);
  useEffect(() => {
    const getData = async () => {
      const producAudit = await getProductAuditLog();
      setData(producAudit);
    };
    getData();
  }, []);
  return (
    <Dialog>
      <DialogTrigger>
        <ClockIcon className="size-9 hover:cursor-pointer mr-3 hover:bg-zinc-100 active:bg-zinc-200 rounded-lg p-1.5 hover:text-zinc-700 md:size-12" />
      </DialogTrigger>
      <DialogContent className="min-w-3/4 max-h-3/4 overflow-auto">
        <DialogHeader>
          <DialogTitle className="md:text-3xl">History List of Product</DialogTitle>
          <DialogDescription className="md:text-xl">List of modified product</DialogDescription>
          {data?.length === 0 ? (
            <h1 className="font-semibold text-3xl my-10 text-center">There is no data</h1>
          ) : (
            data?.map((item) => (
              <div key={item.AuditID} className="my-5">
                <h1 className="text-center font-semibold mb-3 md:text-xl">Modified for {"P" + item.IndexProductId}</h1>
                <table className="md:mx-15">
                  <tbody className="text-lg">
                    <tr>
                      <td>Old Product Name</td>
                      <td className="px-5 md:px-10">:</td>
                      <td>{item.OldProductName}</td>
                    </tr>
                    <tr>
                      <td>New Product Name</td>
                      <td className="px-5 md:px-10">:</td>
                      <td>{item.NewProductName}</td>
                    </tr>
                    <tr>
                      <td>Old Section Id</td>
                      <td className="px-5 md:px-10">:</td>
                      <td>{item.OldSectionId}</td>
                    </tr>
                    <tr>
                      <td>New Section Id</td>
                      <td className="px-5 md:px-10">:</td>
                      <td>{item.NewSectionId}</td>
                    </tr>
                    <tr>
                      <td>Update At</td>
                      <td className="px-5 md:px-10">:</td>
                      <td>{item.ChangeDate.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Changes</td>
                      <td className="px-5 md:px-10">:</td>
                      <td>{item.ActionType}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
