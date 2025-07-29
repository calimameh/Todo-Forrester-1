import React, { useState } from "react";
import { useFetchUserTodos, useCompleteTodo } from "@/hooks/use-todo";
import { Todo } from "@/schema/todo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateTodoDialog } from "@/components/CreateTodoDialog";
import { UpdateTodoDialog } from "@/components/UpdateTodoDialog";
import { DeleteTodoAlertDialog } from "@/components/DeleteTodoAlertDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

const Dashboard = () => {
  const { data: todos, isLoading, isError, error } = useFetchUserTodos();
  const completeTodoMutation = useCompleteTodo();
  const isMobile = useIsMobile();

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleUpdateClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsUpdateDialogOpen(true);
  };

  const handleCompleteChange = (todo: Todo, checked: boolean) => {
    if (checked && !todo.completionDate) { // Only complete if not already completed
      completeTodoMutation.mutate({
        todoID: todo.todoID,
        completionDate: format(new Date(), "yyyy-MM-dd"),
        completionNotes: "Marked as complete from UI",
      });
    }
    // If unchecked, API doesn't support "uncompleting" directly, so we just acknowledge for now.
    // A real API might have an "uncomplete" or "set status" endpoint.
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">My Todos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[180px] w-full" />
          <Skeleton className="h-[180px] w-full" />
          <Skeleton className="h-[180px] w-full" />
        </div>
        <Skeleton className="h-[400px] w-full mt-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">My Todos</h1>
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Todos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>An error occurred: {error?.message || "Unknown error"}</p>
            <p>Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedTodos = todos?.filter(todo => todo.completionDate).length || 0;
  const pendingTodos = (todos?.length || 0) - completedTodos;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-800 dark:text-gray-100">My Todos</h1>
          <CreateTodoDialog />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Todos</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{todos?.length || 0}</div>
              <p className="text-xs text-muted-foreground text-gray-500 dark:text-gray-400">All your tasks at a glance</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTodos}</div>
              <p className="text-xs text-muted-foreground text-gray-500 dark:text-gray-400">Tasks marked as done</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{pendingTodos}</div>
              <p className="text-xs text-muted-foreground text-gray-500 dark:text-gray-400">Tasks still to do</p>
            </CardContent>
          </Card>
        </div>
        <Separator className="my-8 bg-gray-200 dark:bg-gray-700" />


        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">All Tasks</h2>

        {todos && todos.length > 0 ? (
          isMobile ? (
            <div className="grid gap-4">
              {todos.map((todo) => (
                <Card key={todo.todoID} className="bg-white dark:bg-gray-800 shadow-md">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`todo-${todo.todoID}`}
                        checked={!!todo.completionDate}
                        onCheckedChange={(checked) => handleCompleteChange(todo, !!checked)}
                        disabled={completeTodoMutation.isPending}
                      />
                      <CardTitle className={`text-lg ${todo.completionDate ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-gray-100"}`}>
                        {todo.todoTitle}
                      </CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUpdateClick(todo)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <DeleteTodoAlertDialog todo={todo} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {todo.description && (
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        {todo.description}
                      </CardDescription>
                    )}
                    {todo.dueDate && (
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        <span className="font-semibold">Due:</span> {format(new Date(todo.dueDate), "PPP")}
                      </p>
                    )}
                    {todo.priorityLevel && (
                      <Badge variant="outline" className="mr-2 border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                        Priority: {todo.priorityLevel}
                      </Badge>
                    )}
                    {todo.category && (
                      <Badge variant="outline" className="mr-2 border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        Category: {todo.category}
                      </Badge>
                    )}
                    {todo.tags && (
                      <Badge variant="outline" className="border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-900 dark:text-orange-300">
                        Tags: {todo.tags}
                      </Badge>
                    )}
                    {todo.completionDate && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Completed on: {format(new Date(todo.completionDate), "PPP")}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-md border bg-white dark:bg-gray-800 shadow-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700">
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[120px]">Due Date</TableHead>
                    <TableHead className="w-[100px]">Priority</TableHead>
                    <TableHead className="w-[100px]">Category</TableHead>
                    <TableHead className="w-[100px]">Tags</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todos.map((todo) => (
                    <TableRow key={todo.todoID} className={`${todo.completionDate ? "bg-gray-100 dark:bg-gray-700/50" : ""}`}>
                      <TableCell className="font-medium">
                        <Checkbox
                          id={`checkbox-${todo.todoID}`}
                          checked={!!todo.completionDate}
                          onCheckedChange={(checked) => handleCompleteChange(todo, !!checked)}
                          disabled={completeTodoMutation.isPending}
                        />
                      </TableCell>
                      <TableCell className={`${todo.completionDate ? "line-through text-gray-500 dark:text-gray-400" : ""}`}>
                        {todo.todoTitle}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {todo.description || "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {todo.dueDate ? format(new Date(todo.dueDate), "PPP") : "-"}
                      </TableCell>
                      <TableCell>
                        {todo.priorityLevel ? (
                          <Badge variant="outline" className="border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                            {todo.priorityLevel}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {todo.category ? (
                          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                            {todo.category}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {todo.tags ? (
                          <Badge variant="outline" className="border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-900 dark:text-orange-300">
                            {todo.tags}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleUpdateClick(todo)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <DeleteTodoAlertDialog todo={todo} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        ) : (
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle>No Todos Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Looks like you haven't created any todos yet. Start by adding one!</p>
              <Button onClick={() => setIsUpdateDialogOpen(true)} className="mt-4">Create First Todo</Button>
            </CardContent>
          </Card>
        )}

        {selectedTodo && (
          <UpdateTodoDialog
            todo={selectedTodo}
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;

// Dummy icons for stats cards - normally import directly
const FileText = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>;
const CheckCircle = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-8.87"></path><path d="M12 2v10"></path><path d="M22 4L12 14L8 10"></path></svg>;
const Clock = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;