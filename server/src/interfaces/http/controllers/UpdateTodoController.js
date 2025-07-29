import express from 'express';
import UpdateTodoCommand from '../../../domain/command/UpdateTodoCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { todoID, newTitle, newDescription, newDueDate, newPriorityLevel, newCategory, newTags } = req.body;
    const result = await UpdateTodoCommand.execute({
      todoID,
      newTitle,
      newDescription,
      newDueDate,
      newPriorityLevel,
      newCategory,
      newTags,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/update-todo',
  router,
};