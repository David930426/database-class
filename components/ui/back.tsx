import Link from "next/link";

export function Back({ href }: { href: string }) {
  return (
    <p className="text-zinc-500 text-3xl mb-10">
      <Link
        href={href}
        className="hover:bg-zinc-300 active:bg-zinc-400 rounded-full px-3 pb-1"
      >
        {"<"}
      </Link>
    </p>
  );
}
