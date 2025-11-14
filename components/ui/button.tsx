import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/spinner";

export function ButtonPrimary({
  type,
  className,
  danger,
  children,
}: {
  type: "submit" | "reset" | "button" | undefined;
  className?: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  const status = useFormStatus();
  return (
    <button
      className={`${className}  text-zinc-100 rounded-full py-2 flex justify-center ${
        status.pending
          ? `hover:cursor-not-allowed ${danger ? `bg-rose-600` : "bg-sky-600"}`
          : `hover:cursor-pointer  ${
              danger
                ? `bg-rose-500 hover:bg-rose-600 active:bg-rose-700`
                : "bg-sky-500 hover:bg-sky-600 active:bg-sky-700"
            }`
      }`}
      type={type}
      disabled={status.pending}
    >
      {status.pending ? <Spinner className="size-6" /> : children}
    </button>
  );
}
