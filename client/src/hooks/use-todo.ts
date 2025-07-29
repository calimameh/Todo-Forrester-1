import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  CompleteTodoRequest,
  DeleteTodoRequest,
} from "../schema/todo";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:3000/api/v1";

export function useFetchUserTodos() {
  const { toast } = useToast();
  return useQuery<Todo[], Error>({
    queryKey: ["todos", "user"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/fetch-user-todos`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch todos");
      }
      return response.json();
    },
    onError: (error) => {
      toast({
        title: "Error fetching todos",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Note: fetchTodoDetails is not implemented as a separate hook because its
// OpenAPI spec is identical to fetchUserTodos (GET, returns array of Todos, no params).
// If it were intended for a single Todo, it would require a todoID parameter.

export function useCreateTodo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Todo, Error, CreateTodoRequest>({
    mutationFn: async (newTodoData: CreateTodoRequest) => {
      const response = await fetch(`${API_BASE_URL}/create-todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create todo");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", "user"] });
      toast({
        title: "Success",
        description: "Todo created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating todo",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Todo, Error, UpdateTodoRequest>({
    mutationFn: async (updateTodoData: UpdateTodoRequest) => {
      const response = await fetch(`${API_BASE_URL}/update-todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateTodoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update todo");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", "user"] });
      toast({
        title: "Success",
        description: "Todo updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating todo",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useCompleteTodo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Todo, Error, CompleteTodoRequest>({
    mutationFn: async (completeTodoData: CompleteTodoRequest) => {
      const response = await fetch(`${API_BASE_URL}/complete-todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeTodoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to complete todo");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", "user"] });
      toast({
        title: "Success",
        description: "Todo marked as complete!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error completing todo",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Todo, Error, DeleteTodoRequest>({
    mutationFn: async (deleteTodoData: DeleteTodoRequest) => {
      const response = await fetch(`${API_BASE_URL}/delete-todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deleteTodoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete todo");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", "user"] });
      toast({
        title: "Success",
        description: "Todo deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting todo",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}