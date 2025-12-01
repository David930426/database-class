"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export function SearchPagination({
  setSearchInput,
}: {
  setSearchInput: (input: string) => void;
}) {
  const [open, setOpen] = useState(false);
  if (open) {
    return (
      <div className="relative w-45 md:min-w-70">
        <MagnifyingGlassIcon
          className="size-6 absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 pointer-events-auto hover:cursor-pointer transition-all duration-300"
          onClick={() => setOpen(!open)}
        />
        <input
          type="text"
          className="max-w-full border rounded-xl py-2 pl-10 pr-4 md:pl-12 md:py-3 transition-all duration-300"
          placeholder="Search"
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
    );
  } else {
    return (
      <div className="bg-sky-500 rounded-2xl hover:cursor-pointer hover:bg-sky-600 active:bg-sky-700 transition-all duration-300" onClick={() => setOpen(!open)}>
        <MagnifyingGlassIcon className="size-6 text-zinc-100 m-2.5 md:size-7 md:m-3" />
      </div>
    );
  }
}
