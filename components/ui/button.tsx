
export function ButtonPrimary({ children }: {children: React.ReactNode}) {
  return (
    <button className="w-full bg-sky-500 text-zinc-100 rounded-full py-2 mt-7 hover:bg-sky-600 active:bg-sky-700 hover:cursor-pointer" type="submit">
      {children}
    </button>
  );
}
