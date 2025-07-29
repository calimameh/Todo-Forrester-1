import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class CompleteTodoCommand {
  static async execute({ todoID, completionDate, completionNotes }) {
    const existingTodoData = await db.findById('Todo', todoID);

    if (!existingTodoData) {
      throw new Error(`Todo with ID ${todoID} not found.`);
    }

    const todo = new Todo(existingTodoData);
    
    // Update the completion fields
    todo.completionDate = completionDate;
    todo.completionNotes = completionNotes;

    await db.update('Todo', todo.toJSON());
    return todo.toJSON();
  }
}

export default CompleteTodoCommand;