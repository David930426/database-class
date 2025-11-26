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

  const [productSearch, setProductSearch] = useState("");
  const [branchSearch, setBranchSearch] = useState("");
  const [sectionSearch, setSectionSearch] = useState("");

  useEffect(() => {
    const getData = async () => {
      const theData = await product(expiredOrder, productOrder, productSearch);
      const theBranch = await branch(branchOrder, branchSearch);
      const theSection = await section(sectionSearch);
      setDataProduct(theData);
      setDataBranch(theBranch);
      setDataSection(theSection);
    };
    getData();
  }, [
    refresh,
    expiredOrder,
    productOrder,
    branchOrder,
    productSearch,
    branchSearch,
    sectionSearch,
  ]);
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
        setProductSearch={setProductSearch}
      />
      <BranchList
        data={dataBranch}
        setRefresh={() => setRefreshPage()}
        branchOrder={() => settingForBranchOrder()}
        setBranchSearch={setBranchSearch}
      />
      <SectionList
        data={dataSection}
        refreshPage={() => setRefreshPage()}
        setSectionSearch={setSectionSearch}
      />
    </div>
  );
}
