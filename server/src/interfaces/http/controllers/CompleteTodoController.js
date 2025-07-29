import express from 'express';
import CompleteTodoCommand from '../../../domain/command/CompleteTodoCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { todoID, completionDate, completionNotes } = req.body;

    const result = await CompleteTodoCommand.execute({
      todoID,
      completionDate,
      completionNotes,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/complete-todo',
  router,
};