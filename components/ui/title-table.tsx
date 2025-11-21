import Link from "next/link";

export function TitleTable({
  link,
  children,
}: {
  link: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between mx-5 mt-10 mb-5">
      <h1 className="text-2xl text-zinc-400 font-semibold ">{children}</h1>
      <Link
        href={link}
        className="bg-linear-to-r from-sky-400 to-sky-500 flex justify-center items-center text-4xl px-2.5 pb-1 rounded-xl text-zinc-100 hover:from-sky-500 hover:to-sky-600 active:from-sky-600 active:to-sky-700"
      >
        +
      </Link>
    </div>
  );
}
