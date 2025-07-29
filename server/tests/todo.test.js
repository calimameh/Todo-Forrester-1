import request from 'supertest';

const BASE_URL = 'http://localhost:3000/api/v1';

// Helper function to validate the structure and types of a Todo object
const validateTodoSchema = (todo) => {
    expect(todo).toBeDefined();
    expect(typeof todo.todoID).toBe('string');
    expect(typeof todo.todoTitle).toBe('string');

    // Required fields
    expect(todo.todoID).toBeDefined();
    expect(todo.todoTitle).toBeDefined();

    // Optional fields if they exist
    if (Object.prototype.hasOwnProperty.call(todo, 'description')) {
        expect(typeof todo.description).toBe('string');
    }
    if (Object.prototype.hasOwnProperty.call(todo, 'dueDate')) {
        expect(typeof todo.dueDate).toBe('string');
    }
    if (Object.prototype.hasOwnProperty.call(todo, 'priorityLevel')) {
        expect(typeof todo.priorityLevel).toBe('string');
    }
    if (Object.prototype.hasOwnProperty.call(todo, 'category')) {
        expect(typeof todo.category).toBe('string');
    }
    if (Object.prototype.hasOwnProperty.call(todo, 'tags')) {
        expect(typeof todo.tags).toBe('string');
    }
    if (Object.prototype.hasOwnProperty.call(todo, 'completionDate')) {
        expect(typeof todo.completionDate).toBe('string');
    }
    if (Object.prototype.hasOwnProperty.call(todo, 'completionNotes')) {
        expect(typeof todo.completionNotes).toBe('string');
    }
};

// Example data from the OpenAPI spec
const createTodoRequestPayload = {
    todoTitle: 'Buy groceries',
    description: 'Weekly shopping',
    dueDate: '2023-10-15',
    priorityLevel: 'High',
    category: 'Personal',
    tags: 'Shopping'
};

const completeTodoRequestPayloadFragment = {
    completionDate: '2023-10-16',
    completionNotes: 'All items bought'
};

// Note: UpdateTodoRequest and DeleteTodoRequest schemas only have examples for 'todoID'.
// Per the instructions ("Use only values from the spec's example fields. Do not invent any data or fields."),
// we will only send the 'todoID' for these requests.

describe('Todo API', () => {
    let createdTodoId; // Stores the ID of the todo created in beforeEach

    // Create a new todo item before each test that requires one
    beforeEach(async () => {
        const res = await request(BASE_URL)
            .post('/create-todo')
            .send(createTodoRequestPayload);

        expect(res.statusCode).toEqual(200);
        validateTodoSchema(res.body);
        createdTodoId = res.body.todoID;
        expect(createdTodoId).toBeDefined();
    });

    describe('POST /create-todo', () => {
        it('should successfully create a new todo item', async () => {
            // Test already covered by beforeEach, but keeping it for explicit positive test.
            // Sending a new request to ensure this specific endpoint test works in isolation if needed.
            const res = await request(BASE_URL)
                .post('/create-todo')
                .send({
                    todoTitle: 'New standalone test todo',
                    description: 'This is a test todo',
                    dueDate: '2023-12-01',
                    priorityLevel: 'Low',
                    category: 'Work',
                    tags: 'Dev'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toMatch(/json/);
            validateTodoSchema(res.body);

            // Assert specific fields from the request payload
            expect(res.body.todoTitle).toEqual('New standalone test todo');
            expect(res.body.description).toEqual('This is a test todo');
            expect(res.body.dueDate).toEqual('2023-12-01');
            expect(res.body.priorityLevel).toEqual('Low');
            expect(res.body.category).toEqual('Work');
            expect(res.body.tags).toEqual('Dev');
        });
    });

    describe('POST /update-todo', () => {
        it('should successfully update an existing todo item', async () => {
            const updateRequestPayload = {
                todoID: createdTodoId,
                // Per spec, no examples for newTitle, newDescription etc.
                // We must not invent data. So, only todoID is sent.
                // If the server requires more, this test might fail.
            };

            const res = await request(BASE_URL)
                .post('/update-todo')
                .send(updateRequestPayload);

            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toMatch(/json/);
            validateTodoSchema(res.body);

            // Assert that the returned todo has the correct ID
            expect(res.body.todoID).toEqual(createdTodoId);
        });
    });

    describe('POST /complete-todo', () => {
        it('should successfully mark a todo item as complete', async () => {
            const completeRequestPayload = {
                todoID: createdTodoId,
                ...completeTodoRequestPayloadFragment,
            };

            const res = await request(BASE_URL)
                .post('/complete-todo')
                .send(completeRequestPayload);

            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toMatch(/json/);
            validateTodoSchema(res.body);

            // Assert specific fields from the request payload
            expect(res.body.todoID).toEqual(createdTodoId);
            expect(res.body.completionDate).toEqual(completeTodoRequestPayload.completionDate);
            expect(res.body.completionNotes).toEqual(completeTodoRequestPayload.completionNotes);
        });
    });

    describe('POST /delete-todo', () => {
        it('should successfully delete a todo item', async () => {
            const deleteRequestPayload = {
                todoID: createdTodoId,
                // Per spec, no example for deletionReason. Must not invent data.
            };

            const res = await request(BASE_URL)
                .post('/delete-todo')
                .send(deleteRequestPayload);

            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toMatch(/json/);
            validateTodoSchema(res.body); // Spec says it returns Todo on success
            expect(res.body.todoID).toEqual(createdTodoId);
        });
    });

    describe('GET /fetch-user-todos', () => {
        it('should successfully fetch a list of user todo items', async () => {
            const res = await request(BASE_URL)
                .get('/fetch-user-todos');

            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toMatch(/json/);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0); // Assuming at least the one created in beforeEach exists

            // Validate each item in the array
            res.body.forEach(todo => validateTodoSchema(todo));

            // Ensure the createdTodoId is in the list
            const foundTodo = res.body.find(todo => todo.todoID === createdTodoId);
            expect(foundTodo).toBeDefined();
        });
    });

    describe('GET /fetch-todo-details', () => {
        it('should successfully fetch details for specific todo(s) as an array', async () => {
            // Note: The spec defines this endpoint to return an array of Todos,
            // and it does not take any path or query parameters for a specific ID.
            const res = await request(BASE_URL)
                .get('/fetch-todo-details');

            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toMatch(/json/);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0); // Assuming at least the one created in beforeEach exists

            // Validate each item in the array
            res.body.forEach(todo => validateTodoSchema(todo));

            // Ensure the createdTodoId is in the list (if this endpoint returns all todos or a relevant subset)
            const foundTodo = res.body.find(todo => todo.todoID === createdTodoId);
            expect(foundTodo).toBeDefined();
        });
    });
});