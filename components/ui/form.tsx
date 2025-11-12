
export function Input({
  type,
  id,
  label,
  placeholder,
  className,
  labelClass,
  error,
}: {
  type: string;
  id: string;
  label?: string;
  placeholder?: string;
  className?: string;
  labelClass?: string;
  error?: string;
}) {
  return (
    <div className="mt-5">
      <label htmlFor={id} className={`capitalize ml-2 ${labelClass}`}>
        {label ? label : id}:
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className={`w-full border  rounded-full py-2 px-5 mt-1  focus:outline-hidden ${className} ${error ? "border-red-400 border-2 focus:border-red-500" : "border-zinc-300 focus:border-zinc-400"}`}
      />
    </div>
  );
}
