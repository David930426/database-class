"use client";
import { editInventory, searchInventory } from "@/action/editInventory";
import { getBranch, getProduct } from "@/action/getData";
import { LoadingPage } from "@/components/loading";
import { Back } from "@/components/ui/back";
import { ButtonPrimary } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { GetBranches, GetInventory, GetProducts } from "@/lib/definitions";
import { initialState } from "@/lib/initialState";
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
      <Back href="/" />
      <Title>Edit Inventory</Title>
      <form
        action={editInvAction}
        className="px-2 mt-5 text-xl md:text-2xl md:mt-10"
      >
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
        <div className="md:flex md:justify-end">
          <ButtonPrimary type="submit" className="w-full mt-10 mb-5 md:w-60">
            Edit Inventory
          </ButtonPrimary>
        </div>
      </form>
    </div>
  );
}
