import { Input } from "@/components/ui/form";
import Link from "next/link";

export default function Page() {
  return (
    <div className="px-10 pt-5">
      <p className="text-zinc-500 text-3xl mb-10">
        <Link
          href="/"
          className="hover:bg-zinc-300 active:bg-zinc-400 rounded-full px-3 pb-1"
        >
          {"<"}
        </Link>
      </p>
      <h1 className="bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 p-7 rounded-xl text-3xl text-zinc-100 font-bold">
        Edit Profile
      </h1>
      <form action="" className="px-2">
        <Input type="text" id="Username" labelClass="text-xl" />
        <Input type="text" id="Email" labelClass="text-xl" />
        <Input type="password" id="Password" labelClass="text-xl" />
        <Input type="password" id="Password" labelClass="text-xl" />
      </form>
    </div>
  );
}
