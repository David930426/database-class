import Link from "next/link";

export default function Register() {
  return (
    <div className="w-screen h-screen bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 flex items-center">
      <div className="md:max-w-md max-w-3/4 mx-auto bg-zinc-100 rounded-xl px-7 py-10">
        <h1 className="text-center text-3xl font-bold mb-7">Sign Up</h1>
        <form action="">
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Your username"
            className="w-full border rounded-full py-2 px-5 mt-1 mb-5"
          />
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your email"
            className="w-full border rounded-full py-2 px-5 mt-1 mb-5"
          />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Your password"
            className="w-full border rounded-full py-2 px-5 mt-1 mb-5"
          />
          <label htmlFor="rePassword">Retype Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Retype your password"
            className="w-full border rounded-full py-2 px-5 mt-1 mb-5"
          />
          <Link href={"/login"}>
            <span className="text-sky-600 text-sm hover:text-sky-700 hover:underline">
              Already has an account
            </span>
          </Link>
          <button className="w-full bg-sky-500 text-zinc-100 rounded-full py-2 mt-7 hover:bg-sky-600 active:bg-sky-700 hover:cursor-pointer">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
