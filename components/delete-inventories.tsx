"Use client";
import { deleteInventory } from "@/action/editInventory";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export function DeleteInventories({
  inventoryId,
  setRefreshData,
}: {
  inventoryId: number;
  setRefreshData: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [closeDialog, setCloseDialog] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await deleteInventory(inventoryId);
      setCloseDialog(false);
      setRefreshData();
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog
      open={closeDialog}
      onOpenChange={() => {
        setCloseDialog(!closeDialog);
      }}
    >
      <AlertDialogTrigger asChild>
        <button className="bg-rose-500 py-3 px-5 rounded-full text-zinc-100 hover:bg-rose-600 active:bg-rose-700 hover:cursor-pointer">
          Delete
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Inventory</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure want to delete your inventory?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={
              isDeleting
                ? "bg-rose-400 hover:cursor-wait"
                : "bg-rose-500 hover:bg-rose-600 active:bg-rose-700 hover:cursor-pointer"
            }
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner className="size-5" /> : "Sure"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
