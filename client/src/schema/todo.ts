import { z } from "zod";

// Define the Zod schema for the Todo object based on OpenAPI spec
export const TodoSchema = z.object({
  todoID: z.string().nonempty("Todo ID cannot be empty"),
  todoTitle: z.string().nonempty("Todo title cannot be empty"),
  description: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(), // Assuming YYYY-MM-DD string format
  priorityLevel: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  completionDate: z.string().optional().nullable(), // Assuming YYYY-MM-DD string format
  completionNotes: z.string().optional().nullable(),
});

// Define Zod schema for CreateTodoRequest
export const CreateTodoRequestSchema = z.object({
  todoTitle: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  priorityLevel: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
});

// Define Zod schema for UpdateTodoRequest
export const UpdateTodoRequestSchema = z.object({
  todoID: z.string().nonempty("Todo ID is required for update"),
  newTitle: z.string().optional(),
  newDescription: z.string().optional(),
  newDueDate: z.string().optional(),
  newPriorityLevel: z.string().optional(),
  newCategory: z.string().optional(),
  newTags: z.string().optional(),
});

// Define Zod schema for CompleteTodoRequest
export const CompleteTodoRequestSchema = z.object({
  todoID: z.string().nonempty("Todo ID is required to complete"),
  completionDate: z.string().optional().nullable(),
  completionNotes: z.string().optional().nullable(),
});

// Define Zod schema for DeleteTodoRequest
export const DeleteTodoRequestSchema = z.object({
  todoID: z.string().nonempty("Todo ID is required for deletion"),
  deletionReason: z.string().optional().nullable(),
});

// Type inference from Zod schemas
export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoRequest = z.infer<typeof CreateTodoRequestSchema>;
export type UpdateTodoRequest = z.infer<typeof UpdateTodoRequestSchema>;
export type CompleteTodoRequest = z.infer<typeof CompleteTodoRequestSchema>;
export type DeleteTodoRequest = z.infer<typeof DeleteTodoRequestSchema>;