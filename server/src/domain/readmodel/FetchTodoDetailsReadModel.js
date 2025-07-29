import db from '../../infrastructure/db/index.js';

class FetchTodoDetailsReadModel {
  /**
   * Queries for a single Todo's details based on the specified output schema.
   * As the API definition does not include parameters, this method retrieves the first Todo found
   * and maps its properties to the expected response format.
   *
   * @returns {Promise<object | null>} The details of a Todo or null if no Todo is found.
   */
  static async query() {
    const todos = await db.findAll('Todo'); // Assuming 'Todo' is the entity name

    if (!todos || todos.length === 0) {
      return null; // Or an empty object {} if the schema allows for an empty but valid response
    }

    const todo = todos[0]; // Get the first Todo, as per Swagger spec returning a single object without parameters

    const currentStatus = todo.completionDate ? 'Completed' : 'Pending';

    return {
      todoTitle: todo.todoTitle,
      currentStatus: currentStatus,
      dueDate: todo.dueDate,
      priorityLevel: todo.priorityLevel,
    };
  }
}

export default FetchTodoDetailsReadModel;