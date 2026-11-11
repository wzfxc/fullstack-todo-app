import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth';
import { validate } from '../middlewares/validateParams';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', validate(createTaskSchema), createTask);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;

