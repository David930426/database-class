"use client";
import { branch } from "@/action/branch";
import { Product } from "@/action/product";
import { section } from "@/action/section";
import { BranchList } from "@/components/branch-list";
import { LoadingPage } from "@/components/loading";
import { ProductList } from "@/components/product-list";
import { SectionList } from "@/components/section-list";
import { Back } from "@/components/ui/back";
import { Title } from "@/components/ui/title";
import { Branches, GetSection, Products } from "@/lib/definitions";
import { useEffect, useState } from "react";

export default function ProductBranch() {
  const [refresh, setRefresh] = useState(0);
  const setRefreshPage = () => {
    setRefresh(refresh === 0 ? refresh + 1 : refresh - 1);
  };
  const [dataProduct, setDataProduct] = useState<Products[] | null>(null);
  const [dataBranch, setDataBranch] = useState<Branches[] | null>(null);
  const [dataSection, setDataSection] = useState<GetSection[] | null>(null);
  useEffect(() => {
    const getData = async () => {
      const theData = await Product();
      const theBranch = await branch();
      const theSection = await section();
      setDataProduct(theData);
      setDataBranch(theBranch);
      setDataSection(theSection);
    };
    getData();
  }, [refresh]);
  if (!dataProduct || !dataBranch || !dataSection) {
    return <LoadingPage />;
  }
  return (
    <div className="p-10 ">
      <Back href="/" />
      <Title>All list</Title>
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
      <SectionList
        data={dataSection}
        refreshPage={() => {
          setRefreshPage();
        }}
      />
    </div>
  );
}
