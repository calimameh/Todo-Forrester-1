import db from '../../infrastructure/db/index.js';

class FetchUserTodosReadModel {
  /**
   * Queries for user todos, formatted according to the OpenAPI specification.
   * Note: The OpenAPI spec for '/fetch-user-todos' GET request specifies
   * a single object response, despite the read model name and cardinality
   * suggesting a list ("one-to-many"). This implementation strictly adheres
   * to the *response schema* defined in the OpenAPI specification,
   * returning a single transformed object.
   *
   * @returns {Promise<object>} A single object representing a transformed Todo,
   *                            or a default object if no Todos are found.
   */
  static async query() {
    // Fetch all todos from the database.
    // We expect `db.findAll('Todo')` to return an array of Todo objects.
    const todos = await db.findAll('Todo');

    if (!todos || todos.length === 0) {
      // Return an object with null values if no todos are found,
      // as the OpenAPI schema defines an object response.
      return {
        todoTitle: null,
        currentStatus: null,
        creationDate: null,
        category: null,
      };
    }

    // Since the OpenAPI spec for the endpoint's response is a single object,
    // we take the first todo found and transform it.
    const firstTodo = todos[0];

    // Transform the internal Todo object structure to match the OpenAPI response schema.
    // 'currentStatus' is derived based on 'completionDate'.
    // 'creationDate' is assumed to be available as 'createdAt' or defaulted to current date
    // if not explicitly present in the underlying Todo entity.
    return {
      todoTitle: firstTodo.todoTitle || null,
      currentStatus: firstTodo.completionDate ? 'Completed' : 'Pending',
      creationDate: (firstTodo.createdAt instanceof Date) ? firstTodo.createdAt.toISOString() : new Date().toISOString(),
      category: firstTodo.category || null,
    };
  }
}

export default FetchUserTodosReadModel;