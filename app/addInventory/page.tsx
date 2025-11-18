"use client";
import { getBranch, getProduct, getSection } from "@/action/inventoryData";
import { LoadingPage } from "@/components/loading";
import { ButtonPrimary } from "@/components/ui/button";
import { GetBranches, GetProducts, GetSection } from "@/lib/definitions";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [product, setProduct] = useState<GetProducts[] | null>(null);
  const [branch, setBranch] = useState<GetBranches[] | null>(null);
  const [section, setSection] = useState<GetSection[] | null>(null);
  useEffect(() => {
    const getData = async () => {
      const dataProduct = await getProduct();
      setProduct(dataProduct as GetProducts[]);
      const dataBranch = await getBranch();
      setBranch(dataBranch as GetBranches[]);
      const dataSection = await getSection();
      setSection(dataSection as GetSection[]);
    };
    getData();
  }, []);
  if (!product || !branch || !section) {
    return <LoadingPage />
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
      <div className="bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 p-7 pr-10 items-center rounded-xl">
        <h1 className="text-3xl text-zinc-100 font-bold">Add Inventory</h1>
      </div>
      <form action={""} className="px-2">

        <label htmlFor="product">Product</label>
        <select name="product" id="product">
          {product?.map((item) => (
            <option value={item.ProductId} key={item.ProductId}>
              {item.ProductName}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="branch">Branch</label>
        <select name="branch" id="branch">
          {branch?.map((item) => (
            <option value={item.BranchId} key={item.BranchId}>
              {item.BranchName}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="section">Section</label>
        <select name="section" id="section">
          {section?.map((item) => (
            <option value={item.SectionId} key={item.SectionId}>
              {item.SectionName}
            </option>
          ))}
        </select>

        <ButtonPrimary type="submit" className="w-full mt-10 mb-5">
          Add Inventory
        </ButtonPrimary>
      </form>
    </div>
  );
}
