"use client";
import { addBranch } from "@/action/branch";
import { Back } from "@/components/ui/back";
import { ButtonPrimary } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Title } from "@/components/ui/title";
import { initialState } from "@/lib/initialState";
import { useActionState } from "react";

export default function AddBranch() {
  const [state, addBranchAction] = useActionState(addBranch, initialState);
  return (
    <div className="p-10">
      <Back href="/product-branch" />
      <Title>Add Branch</Title>
      <form action={addBranchAction} className="mx-3 text-xl">
        <Input
          type="text"
          id="branchName"
          label="Branch Name"
          placeholder="Branch Name"
        />
        <Input
          type="text"
          id="branchLocation"
          label="Branch Location"
          placeholder="Branch Location"
        />
        <p className="ml-3 text-sm text-rose-500">{state.message}</p>
        <div className="flex justify-end mr-5 mt-10">
          <ButtonPrimary type="submit" className="w-35">
            Add Branch
          </ButtonPrimary>
        </div>
      </form>
    </div>
  );
}
