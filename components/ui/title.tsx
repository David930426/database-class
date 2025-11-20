export function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="bg-linear-to-r from-sky-400 via-sky-500 to-blue-500 p-7 text-zinc-100 text-3xl rounded-xl font-bold">
      {children}
    </h1>
  );
}
