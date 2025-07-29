import express from 'express';
import FetchTodoDetailsReadModel from '../../../domain/readmodel/FetchTodoDetailsReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const todoDetails = await FetchTodoDetailsReadModel.query();

    if (!todoDetails) {
      // According to the Swagger, only 200 and 400 are defined.
      // If no todo details are found, returning an empty object for 200 OK
      // is consistent with an "object" schema where properties might be optional.
      // If a "Not Found" (404) response was intended, it should be in the Swagger.
      return res.status(200).json({});
    }

    res.status(200).json(todoDetails);
  } catch (err) {
    // For a 500 error, return a generic error message
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

export default {
  routeBase: '/fetch-todo-details',
  router,
};