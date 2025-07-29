import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class UpdateTodoCommand {
  static async execute({ todoID, newTitle, newDescription, newDueDate, newPriorityLevel, newCategory, newTags }) {
    const existingTodoData = await db.findById('Todo', todoID);

    if (!existingTodoData) {
      throw new Error('Todo not found');
    }

    const todo = new Todo(existingTodoData);

    if (newTitle !== undefined) {
      todo.todoTitle = newTitle;
    }
    if (newDescription !== undefined) {
      todo.description = newDescription;
    }
    if (newDueDate !== undefined) {
      todo.dueDate = newDueDate;
    }
    if (newPriorityLevel !== undefined) {
      todo.priorityLevel = newPriorityLevel;
    }
    if (newCategory !== undefined) {
      todo.category = newCategory;
    }
    if (newTags !== undefined) {
      todo.tags = newTags;
    }

    await db.update('Todo', todoID, todo.toJSON());

    return todo.toJSON();
  }
}

export default UpdateTodoCommand;