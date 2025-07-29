import db from '../../infrastructure/db/index.js';
import Todo from '../entity/Todo.js'; // Referencing the entity this command operates on

class DeleteTodoCommand {
  /**
   * Executes the command to delete a Todo item.
   * @param {object} params - The parameters for the command.
   * @param {string} params.todoID - The ID of the Todo item to delete.
   * @param {string} params.deletionReason - The reason for deleting the Todo item.
   * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful.
   */
  static async execute({ todoID, deletionReason }) {
    // In a real application, you might log the deletionReason
    // or store it in an audit log before deleting the entity.
    // For this exercise, we'll just use it as part of the command's context.

    // Check if the Todo exists before attempting to delete it (optional, but good practice)
    const existingTodo = await db.findById(Todo.name, todoID);
    if (!existingTodo) {
      throw new Error(`Todo with ID ${todoID} not found.`);
    }

    const success = await db.remove(Todo.name, todoID);
    return success;
  }
}

export default DeleteTodoCommand;