"use client";
import { branch } from "@/action/branch";
import { product } from "@/action/product";
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

  const [expiredOrder, setExpiredOrder] = useState(false);
  const settingForExpiredOrder = () => setExpiredOrder(!expiredOrder);
  const [productOrder, setProductOrder] = useState(true);
  const settingForProductOrder = () => setProductOrder(!productOrder);

  const [branchOrder, setBranchOrder] = useState(true);
  const settingForBranchOrder = () => setBranchOrder(!branchOrder);

  useEffect(() => {
    const getData = async () => {
      const theData = await product(expiredOrder, productOrder);
      const theBranch = await branch(branchOrder);
      const theSection = await section();
      setDataProduct(theData);
      setDataBranch(theBranch);
      setDataSection(theSection);
    };
    getData();
  }, [refresh, expiredOrder, productOrder, branchOrder]);
  if (!dataProduct || !dataBranch || !dataSection) {
    return <LoadingPage />;
  }
  return (
    <div className="p-10 ">
      <Back href="/" />
      <Title>All list</Title>
      <ProductList
        data={dataProduct}
        setRefresh={() => setRefreshPage()}
        setOrder={() => settingForExpiredOrder()}
        setProduct={() => settingForProductOrder()}
      />
      <BranchList
        data={dataBranch}
        setRefresh={() => setRefreshPage()}
        branchOrder={() => settingForBranchOrder()}
      />
      <SectionList data={dataSection} refreshPage={() => setRefreshPage()} />
    </div>
  );
}
