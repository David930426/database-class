"use client";
import { getSection } from "@/action/getData";
import { editProduct, OneProduct } from "@/action/product";
import { LoadingPage } from "@/components/loading";
import { Back } from "@/components/ui/back";
import { ButtonPrimary } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Title } from "@/components/ui/title";
import { EditProducts, GetSection } from "@/lib/definitions";
import { initialState } from "@/lib/initialState";
import { useActionState, useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AddProduct() {
  const params = useParams();
  const IndexProductIdParams = Array.isArray(params.indexProductId)
    ? params.indexProductId[0]
    : params.indexProductId;

  const [section, setSection] = useState<GetSection[] | null>(null);
  const [product, setProduct] = useState<EditProducts | null>(null);
  const [state, editProductAction] = useActionState(editProduct, initialState);

  useEffect(() => {
    const getData = async () => {
      const dataSection = await getSection();
      const dataProduct = await OneProduct(Number(IndexProductIdParams));
      setSection(dataSection);
      setProduct(dataProduct);
    };
    getData();
  }, [IndexProductIdParams]);

  if (!section || !product) {
    return <LoadingPage />;
  }

  return (
    <div className="p-10">
      <Back href="/product-branch" />
      <Title>Edit Product</Title>
      <form action={editProductAction} className="mx-3 text-xl">
        <input type="text" name="indexProductId" defaultValue={product.IndexProductId} hidden />
        <Input
          type="text"
          id="productName"
          label="Product Name "
          placeholder="Product Name"
          defaultValue={product?.ProductName}
        />
        <Input
          type="date"
          id="expiredAt"
          label="Expired Date"
          defaultValue={product.ExpiredAt.toISOString().substring(0, 10)}
        />
        <div className="mt-7 flex flex-col gap-2">
          <label className="ml-2 mr-3" id="sectionId">
            Section Name:
          </label>
          <select
            className="border w-full rounded-full py-2 px-5"
            name="sectionId"
            id="sectionId"
            defaultValue={product.SectionId}
          >
            {section?.map((item) => (
              <option key={item.SectionId} value={item.SectionId}>
                {item.SectionName}
              </option>
            ))}
          </select>
        </div>
        <p className="text-rose-500 text-sm mt-5">{state.message}</p>
        <div className="flex justify-end mr-5 mt-10">
          <ButtonPrimary type="submit" className="w-35">
            Edit Product
          </ButtonPrimary>
        </div>
      </form>
    </div>
  );
}
