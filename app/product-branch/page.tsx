"use client";
import { Product } from "@/action/product";
import { BranchList } from "@/components/branch-list";
import { LoadingPage } from "@/components/loading";
import { ProductList } from "@/components/product-list";
import { Back } from "@/components/ui/back";
import { Title } from "@/components/ui/title";
import { Products } from "@/lib/definitions";
import { useEffect, useState } from "react";

export default function ProductBranch() {
  const [refresh, setRefresh] = useState(0);
  const setRefreshPage = () => {
    setRefresh(refresh + 1);
  };
  const [dataProduct, setDataProduct] = useState<Products[] | null>(null);
  useEffect(() => {
    const getData = async () => {
      const theData = await Product();
      setDataProduct(theData);
    };
    getData();
  }, [refresh]);
  if (!dataProduct) {
    return <LoadingPage />;
  }
  return (
    <div className="p-10 ">
      <Back href="/" />
      <Title>Product and Branch List</Title>
      <ProductList
        data={dataProduct}
        setRefresh={() => {
          setRefreshPage();
        }}
      />
      <BranchList />
    </div>
  );
}
