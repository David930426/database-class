"use client";
import { Back } from "@/components/ui/back";
import { ButtonPrimary } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Title } from "@/components/ui/title";
import { initialState } from "@/lib/initialState";
import { useActionState, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GetSection } from "@/lib/definitions";
import { LoadingPage } from "@/components/loading";
import { editSection, oneSection } from "@/action/section";

export default function EditBranch() {
  const params = useParams();
  const sectionIdParams = Array.isArray(params.sectionId)
    ? params.sectionId[0]
    : params.sectionId;
  const [data, setData] = useState<GetSection | null>(null);
  const [state, editSectionAction] = useActionState(editSection, initialState);

  useEffect(() => {
    const getData = async () => {
      const dataSection = await oneSection(Number(sectionIdParams));
      setData(dataSection);
    };
    getData();
  }, [sectionIdParams]);
  if (!data) {
    return <LoadingPage />;
  }
  return (
    <div className="p-10">
      <Back href="/product-branch" />
      <Title>Edit Section</Title>
      <form action={editSectionAction} className="mx-3 text-xl">
        <input
          type="number"
          name="sectionId"
          defaultValue={data.SectionId}
          hidden
        />
        <h1 className="ml-2 mt-5">Section ID: {data.SectionId}</h1>
        <Input
          type="text"
          id="sectionName"
          label="Section Name"
          placeholder="Section Name"
          defaultValue={data.SectionName}
        />
        <p className="ml-3 text-sm text-rose-500">{state.message}</p>
        <div className="flex justify-end mr-5 mt-10">
          <ButtonPrimary type="submit" className="w-35">
            Edit Section
          </ButtonPrimary>
        </div>
      </form>
    </div>
  );
}
