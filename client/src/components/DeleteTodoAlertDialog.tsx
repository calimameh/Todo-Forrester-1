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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteTodo } from "@/hooks/use-todo";
import { Todo } from "@/schema/todo";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";

interface DeleteTodoAlertDialogProps {
  todo: Todo;
}

export function DeleteTodoAlertDialog({ todo }: DeleteTodoAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");
  const deleteTodoMutation = useDeleteTodo();

  const handleDelete = () => {
    deleteTodoMutation.mutate(
      { todoID: todo.todoID, deletionReason },
      {
        onSuccess: () => {
          setOpen(false);
          setDeletionReason("");
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your todo
            "<span className="font-semibold text-foreground">{todo.todoTitle}</span>".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="deletionReason">Reason for deletion (optional)</Label>
          <Input
            id="deletionReason"
            placeholder="e.g., Completed via another system"
            value={deletionReason}
            onChange={(e) => setDeletionReason(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteTodoMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteTodoMutation.isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {deleteTodoMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}