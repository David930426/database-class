import Link from "next/link";
import { SearchPagination } from "./search-pagination";

export function TitleTable({
  link,
  children,
  setSearchInput,
}: {
  link: string;
  children: React.ReactNode;
  setSearchInput: (input: string) => void;
}) {
  return (
    <div className="flex justify-between mx-5 mt-10 mb-5">
      <h1 className="text-2xl text-zinc-400 font-semibold md:text-4xl">
        {children}
      </h1>
      <div className="flex gap-2 md:gap-5">
        <Link
          href={link}
          className="bg-linear-to-r from-sky-400 to-sky-500 flex justify-center items-center text-4xl px-2.5 pb-1 rounded-xl text-zinc-100 hover:from-sky-500 hover:to-sky-600 active:from-sky-600 active:to-sky-700 md:text-4xl md:pb-2 md:px-3.5"
        >
          +
        </Link>{" "}
        <SearchPagination setSearchInput={setSearchInput} />
      </div>
    </div>
  );
}
