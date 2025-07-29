import { v4 as uuidv4 } from 'uuid';

class Todo {
  constructor({
    todoID = uuidv4(),
    todoTitle,
    description = null,
    dueDate = null,
    priorityLevel = null,
    category = null,
    tags = null,
    completionDate = null,
    completionNotes = null
  }) {
    if (!todoTitle) {
      throw new Error('Todo Title is required');
    }

    this.id = todoID; // Internal primary key mapping
    this.todoID = todoID;
    this.todoTitle = todoTitle;
    this.description = description;
    this.dueDate = dueDate;
    this.priorityLevel = priorityLevel;
    this.category = category;
    this.tags = tags;
    this.completionDate = completionDate;
    this.completionNotes = completionNotes;
  }

  toJSON() {
    return {
      id: this.id, // Expose internal ID
      todoID: this.todoID, // Expose API field ID
      todoTitle: this.todoTitle,
      description: this.description,
      dueDate: this.dueDate,
      priorityLevel: this.priorityLevel,
      category: this.category,
      tags: this.tags,
      completionDate: this.completionDate,
      completionNotes: this.completionNotes
    };
  }
}

export default Todo;