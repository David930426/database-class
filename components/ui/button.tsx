export function ButtonPrimary({ type, disable, children }: { type: "submit" | "reset" | "button" | undefined, disable?: boolean, children: React.ReactNode }) {
  return (
    <button
      className={`w-full  text-zinc-100 rounded-full py-2 mt-7   ${
        disable
          ? "hover:cursor-not-allowed bg-sky-600"
          : "hover:cursor-pointer bg-sky-500 hover:bg-sky-600 active:bg-sky-700"
      }`}
      type={type}
      disabled={disable}
    >
      {children}
    </button>
  );
}
