"use client";
import { branch } from "@/action/branch";
import { Product } from "@/action/product";
import { BranchList } from "@/components/branch-list";
import { LoadingPage } from "@/components/loading";
import { ProductList } from "@/components/product-list";
import { SectionList } from "@/components/section-list";
import { Back } from "@/components/ui/back";
import { Title } from "@/components/ui/title";
import { Branches, Products } from "@/lib/definitions";
import { useEffect, useState } from "react";

export default function ProductBranch() {
  const [refresh, setRefresh] = useState(0);
  const setRefreshPage = () => {
    setRefresh(refresh === 0 ? refresh + 1 : refresh - 1);
  };
  const [dataProduct, setDataProduct] = useState<Products[] | null>(null);
  const [dataBranch, setDataBranch] = useState<Branches[] | null>(null);
  useEffect(() => {
    const getData = async () => {
      const theData = await Product();
      const theBranch = await branch();
      setDataProduct(theData);
      setDataBranch(theBranch);
    };
    getData();
  }, [refresh]);
  if (!dataProduct || !dataBranch) {
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
      <BranchList
        data={dataBranch}
        setRefresh={() => {
          setRefreshPage();
        }}
      />
      <SectionList />
    </div>
  );
}
