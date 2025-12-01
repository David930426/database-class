export function TableFooter({
  data,
  numberOfItem,
  totalItem,
  classname,
}: {
  data?: boolean;
  numberOfItem: number;
  totalItem: number;
  classname?: string
}) {
  return (
    <p className={`${classname ? classname : "mr-5 mt-5"} ${data && "mt-10"} text-end mb-15 md:text-xl`}>
      <span className="font-bold">{numberOfItem}</span> of{" "}
      <span className="font-bold">{totalItem}</span> data
    </p>
  );
}
