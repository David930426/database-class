"use client";
import { getSection } from "@/action/getData";
import { addProduct } from "@/action/product";
import { LoadingPage } from "@/components/loading";
import { Back } from "@/components/ui/back";
import { ButtonPrimary } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Title } from "@/components/ui/title";
import { GetSection } from "@/lib/definitions";
import { initialState } from "@/lib/initialState";
import { useActionState, useEffect, useState } from "react";

export default function AddProduct() {
  const [section, setSection] = useState<GetSection[] | null>(null);
  const [state, addProductAction] = useActionState(addProduct, initialState);

  useEffect(() => {
    const getData = async () => {
      const dataSection = await getSection();
      setSection(dataSection);
    };
    getData();
  }, []);

  if (!section) {
    return <LoadingPage />;
  }

  return (
    <div className="p-10">
      <Back href="/product-branch" />
      <Title>Add Products</Title>
      <form action={addProductAction} className="mx-3 text-xl">
        <Input
          type="text"
          id="productName"
          label="Product Name "
          placeholder="Product Name"
        />
        <Input type="date" id="expiredAt" label="Expired Date" />
        <div className="mt-7 flex flex-col gap-2">
          <label className="ml-2 mr-3" id="sectionId">
            Section Name:
          </label>
          <select
            className="border w-full rounded-full py-2 px-5"
            name="sectionId"
            id="sectionId"
          >
            {section?.map((item) => (
              <option key={item.SectionId} value={item.SectionId}>
                {item.SectionName}
              </option>
            ))}
          </select>
        </div>
        <p>{state.message}</p>
        <div className="flex justify-end mr-5 mt-10">
          <ButtonPrimary type="submit" className="w-35">
            Add Product
          </ButtonPrimary>
        </div>
      </form>
    </div>
  );
}
