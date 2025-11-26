import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function SearchPagination({
  setSearchInput,
}: {
  setSearchInput: (input: string) => void;
}) {
  return (
    <div className="relative w-45">
      <MagnifyingGlassIcon className="size-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 pointer-events-none" />
      <input
        type="text"
        className="max-w-full border rounded-xl py-2 pl-10 pr-4"
        placeholder="Search"
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
  );
}
