"use client";
import { addInventory } from "@/action/inventoryData";
import { getBranch, getProduct } from "@/action/getData";
import { LoadingPage } from "@/components/loading";
import { Back } from "@/components/ui/back";
import { ButtonPrimary } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { GetBranches, GetProducts } from "@/lib/definitions";
import { initialState } from "@/lib/initialState";
import { useActionState, useEffect, useState } from "react";

export default function Page() {
  const [product, setProduct] = useState<GetProducts[] | null>(null);
  const [branch, setBranch] = useState<GetBranches[] | null>(null);
  const [state, addInvAction] = useActionState(addInventory, initialState);
  useEffect(() => {
    const getData = async () => {
      const dataProduct = await getProduct();
      setProduct(dataProduct as GetProducts[]);
      const dataBranch = await getBranch();
      setBranch(dataBranch as GetBranches[]);
    };
    getData();
  }, []);
  if (!product || !branch) {
    return <LoadingPage />;
  }
  return (
    <div className="px-10 pt-5">
      <Back href="/" />
      <Title>Add Iventory</Title>
      <form
        action={addInvAction}
        className="px-2 mt-5 text-xl md:text-2xl md:mt-10"
      >
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
                  defaultValue={0}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <p className="text-rose-500 text-sm mt-5">{state.message}</p>
        <div className="md:flex md:justify-end">
          <ButtonPrimary type="submit" className="w-full mt-10 mb-5 md:w-50">
            Add Inventory
          </ButtonPrimary>
        </div>
      </form>
    </div>
  );
}
