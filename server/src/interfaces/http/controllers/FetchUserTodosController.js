import express from 'express';
import FetchUserTodosReadModel from '../../../domain/readmodel/FetchUserTodosReadModel.js';

const router = express.Router();

// The route base is derived from the read model name in kebab-case.
// Read model name: FetchUserTodosReadModel -> fetch-user-todos
const routeBase = '/fetch-user-todos';

router.get('/', async (req, res) => {
  try {
    // Execute the read model query to fetch and format the data.
    // The query method is designed to return a single object conforming
    // to the OpenAPI response schema for this endpoint.
    const todoData = await FetchUserTodosReadModel.query();

    // Send the structured data as a JSON response.
    res.json(todoData);
  } catch (err) {
    // Handle any errors that occur during the read model execution.
    res.status(500).json({ message: err.message || 'An unexpected error occurred.' });
  }
});

export default {
  routeBase,
  router,
};