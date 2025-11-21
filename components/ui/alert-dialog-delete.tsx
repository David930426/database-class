import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export function DeleteAlert({
  indexId,
  setRefresh,
  name,
  deleteAction,
  tableName,
}: {
  indexId: number;
  setRefresh: () => void;
  name: string;
  deleteAction: (indexId: number) => void;
  tableName?: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [closeDialog, setCloseDialog] = useState(false);

  const clickDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAction(indexId);
      setRefresh();
      setCloseDialog(false);
    } catch (err) {
      console.error("An unexpected error occurred:", err);
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
      <AlertDialogTrigger>
        <TrashIcon className="size-6 my-6 hover:text-rose-500 active:text-rose-600 hover:cursor-pointer" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {tableName ? tableName : "Item"}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure want to delete {name ? name : "the item"}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-rose-500 hover:bg-rose-600 active:bg-rose-700 hover:cursor-pointer"
            onClick={clickDelete}
          >
            {isDeleting ? <Spinner className="size-5" /> : "Sure"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
