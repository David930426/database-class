"use client";
import { editBranch, oneBranch } from "@/action/branch";
import { Back } from "@/components/ui/back";
import { ButtonPrimary } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Title } from "@/components/ui/title";
import { initialState } from "@/lib/initialState";
import { useActionState, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Branches } from "@/lib/definitions";
import { LoadingPage } from "@/components/loading";

export default function EditBranch() {
  const params = useParams();
  const IndexBranchIdParams = Array.isArray(params.indexBranchId)
    ? params.indexBranchId[0]
    : params.indexBranchId;
  const [data, setData] = useState<Branches | null>(null);
  const [state, editBranchAction] = useActionState(editBranch, initialState);

  useEffect(() => {
    const getData = async () => {
      const dataBranch = await oneBranch(Number(IndexBranchIdParams));
      setData(dataBranch);
    };
    getData();
  }, [IndexBranchIdParams]);
  if (!data) {
    return <LoadingPage />;
  }
  return (
    <div className="p-10">
      <Back href="/product-branch" />
      <Title>Edit Branch</Title>
      <form action={editBranchAction} className="mx-3 text-xl">
        <input type="number" name="indexBranchId" defaultValue={data.IndexBranchId} hidden/>
        <h1 className="ml-2 mt-5">Branch ID: {data.BranchId}</h1>
        <Input
          type="text"
          id="branchName"
          label="Branch Name"
          placeholder="Branch Name"
          defaultValue={data.BranchName}
        />
        <Input
          type="text"
          id="branchLocation"
          label="Branch Location"
          placeholder="Branch Location"
          defaultValue={data.Location}
        />
        <p className="ml-3 text-sm text-rose-500">{state.message}</p>
        <div className="flex justify-end mr-5 mt-10">
          <ButtonPrimary type="submit" className="w-35">
            Edit Branch
          </ButtonPrimary>
        </div>
      </form>
    </div>
  );
}
