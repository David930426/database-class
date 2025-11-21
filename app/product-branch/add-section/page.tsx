"use client";
import { addSection } from "@/action/section";
import { Back } from "@/components/ui/back";
import { ButtonPrimary } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Title } from "@/components/ui/title";
import { initialState } from "@/lib/initialState";
import { useActionState } from "react";

export default function AddSection() {
  const [state, addSectionAction] = useActionState(addSection, initialState);
  return (
    <div className="p-10">
      <Back href="/product-branch" />
      <Title>Add Section</Title>
      <form action={addSectionAction} className="mx-3 text-xl">
        <Input
          type="text"
          id="sectionName"
          label="Section Name"
          placeholder="Section Name"
        />
        <p className="ml-3 text-sm text-rose-500">{state.message}</p>
        <div className="flex justify-end mr-5 mt-10">
          <ButtonPrimary type="submit" className="w-35">
            Add Section
          </ButtonPrimary>
        </div>
      </form>
    </div>
  );
}
