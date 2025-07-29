import express from 'express';
import DeleteTodoCommand from '../../../domain/command/DeleteTodoCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { todoID, deletionReason } = req.body;

    // Validate incoming data based on OpenAPI spec (required fields)
    if (!todoID) {
      return res.status(400).json({ message: 'todoID is required.' });
    }
    if (!deletionReason) {
      return res.status(400).json({ message: 'deletionReason is required.' });
    }

    const success = await DeleteTodoCommand.execute({ todoID, deletionReason });

    if (success) {
      res.status(200).json({ message: 'Todo deleted successfully.' });
    } else {
      // This case might be reached if db.remove returns false for some reason,
      // though the command already throws if todo not found.
      res.status(400).json({ message: 'Failed to delete Todo.' });
    }
  } catch (err) {
    // Specific error messages for bad requests
    if (err.message.includes('not found')) {
      return res.status(404).json({ message: err.message });
    }
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/delete-todo',
  router,
};