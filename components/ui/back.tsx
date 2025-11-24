import Link from "next/link";

export function Back({ href }: { href: string }) {
  return (
    <p className="text-zinc-500 text-3xl mb-10 md:text-4xl">
      <Link
        href={href}
        className="hover:bg-zinc-300 active:bg-zinc-400 rounded-full px-3 pb-1 md:px-5 md:pb-3 md:pt-1"
      >
        {"<"}
      </Link>
    </p>
  );
}
