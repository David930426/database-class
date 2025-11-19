"use client";
import { editInventory, searchInventory } from "@/action/editInventory";
import { getBranch, getProduct } from "@/action/inventoryData";
import { LoadingPage } from "@/components/loading";
import { ButtonPrimary } from "@/components/ui/button";
import { GetBranches, GetInventory, GetProducts } from "@/lib/definitions";
import { initialState } from "@/lib/initialState";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

export default function EditInventoryPage() {
  const params = useParams();
  const InventoryIdParams = Array.isArray(params.inventoryId)
    ? params.inventoryId[0]
    : params.inventoryId;
  const [product, setProduct] = useState<GetProducts[] | null>(null);
  const [branch, setBranch] = useState<GetBranches[] | null>(null);
  const [inventory, setInventory] = useState<GetInventory | null>(null);

  const [state, editInvAction] = useActionState(editInventory, initialState);

  useEffect(() => {
    const getData = async () => {
      const dataProduct = await getProduct();
      setProduct(dataProduct as GetProducts[]);
      const dataBranch = await getBranch();
      setBranch(dataBranch as GetBranches[]);
      const dataInventory = await searchInventory(Number(InventoryIdParams));
      setInventory(dataInventory);
    };
    getData();
  }, [InventoryIdParams]);

  const branchNumber = "B" + inventory?.BranchId.toString();
  const productNumber = "P" + inventory?.ProductId.toString();

  if (!product || !branch || !inventory) {
    return <LoadingPage />;
  }

  return (
    <div className="px-10 pt-5">
      <p className="text-zinc-500 text-3xl mb-10">
        <Link
          href="/"
          className="hover:bg-zinc-300 active:bg-zinc-400 rounded-full px-3 pb-1"
        >
          {"<"}
        </Link>
      </p>
      <div className="bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 p-7 pr-10 items-center rounded-xl mb-10">
        <h1 className="text-3xl text-zinc-100 font-bold">Edit Inventory</h1>
      </div>
      <form action={editInvAction} className="px-2 text-xl">
        <input
          type="number"
          name="inventoryId"
          id="inventoryId"
          defaultValue={inventory.InventoryId}
          hidden
        />
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="product" className="mr-15 font-semibold">
                  Product
                </label>
              </td>
              <td>
                <select
                  name="product"
                  id="product"
                  className="w-full border py-2 px-3 rounded-full mb-3"
                  defaultValue={productNumber}
                >
                  {product?.map((item) => (
                    <option value={item.ProductId} key={item.ProductId}>
                      {item.ProductName}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="branch" className="mr-15 font-semibold">
                  Branch
                </label>
              </td>
              <td>
                <select
                  name="branch"
                  id="branch"
                  className="w-full border py-2 px-3 rounded-full mb-3"
                  defaultValue={branchNumber}
                >
                  {branch?.map((item) => (
                    <option value={item.BranchId} key={item.BranchId}>
                      {item.BranchName}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="quantity" className="mr-15 font-semibold">
                  Quantity{" "}
                </label>
              </td>
              <td>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className="border rounded-full py-2 px-3"
                  defaultValue={inventory?.Quantity}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <p className="text-rose-500 text-sm mt-5">{state.message}</p>
        <ButtonPrimary type="submit" className="w-full mt-10 mb-5">
          Edit Inventory
        </ButtonPrimary>
      </form>
    </div>
  );
}
