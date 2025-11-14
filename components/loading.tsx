import { Spinner } from "@/components/ui/spinner";

export function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-zinc-400">
      <Spinner className="size-20 mb-2" />
      <p className="text-2xl">Loading ...</p>
    </div>
  );
}
