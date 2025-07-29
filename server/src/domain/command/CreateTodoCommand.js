import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';
import { v4 as uuidv4 } from 'uuid';

class CreateTodoCommand {
  static async execute({ todoTitle, description, dueDate, priorityLevel, category, tags }) {
    const todoID = uuidv4();

    const todo = new Todo({
      todoID,
      todoTitle,
      description,
      dueDate,
      priorityLevel,
      category,
      tags,
      // completionDate and completionNotes are not provided at creation
      completionDate: null,
      completionNotes: null,
    });

    await db.insert('Todo', todo.toJSON());
    return todo.toJSON();
  }
}

export default CreateTodoCommand;