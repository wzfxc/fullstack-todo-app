import { Response, NextFunction, Request, RequestHandler } from 'express';
import { Task } from '../models';
import { AuthenticatedRequest } from '../types';
import { CreateTaskInput, UpdateTaskInput } from '../schemas/task.schema';

type AuthHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;

const asHandler = (fn: AuthHandler): RequestHandler => fn as unknown as RequestHandler;

const _getAllTasks: AuthHandler = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.user.id } });
    res.status(200).json({ status: 'success', data: tasks });
  } catch (err) {
    next(err);
  }
};

const _getTaskById: AuthHandler = async (req, res, next) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) {
      res.status(404).json({ status: 'error', message: 'Task not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: task });
  } catch (err) {
    next(err);
  }
};

const _createTask: AuthHandler = async (req, res, next) => {
  try {
    const { title, description, status } = req.body as CreateTaskInput;
    const task = await Task.create({ title, description, status, userId: req.user.id });
    res.status(201).json({ status: 'success', data: task });
  } catch (err) {
    next(err);
  }
};

const _updateTask: AuthHandler = async (req, res, next) => {
  try {
    const { title, description, status } = req.body as UpdateTaskInput;
    const [affectedRows] = await Task.update(
      { title, description, status },
      { where: { id: req.params.id, userId: req.user.id } },
    );

    if (affectedRows === 0) {
      res.status(404).json({ status: 'error', message: 'Task not found or no changes made' });
      return;
    }

    const updated = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    next(err);
  }
};

const _deleteTask: AuthHandler = async (req, res, next) => {
  try {
    const affectedRows = await Task.destroy({ where: { id: req.params.id, userId: req.user.id } });

    if (affectedRows === 0) {
      res.status(404).json({ status: 'error', message: 'Task not found' });
      return;
    }

    res.status(200).json({ status: 'success', message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getAllTasks = asHandler(_getAllTasks);
export const getTaskById = asHandler(_getTaskById);
export const createTask = asHandler(_createTask);
export const updateTask = asHandler(_updateTask);
export const deleteTask = asHandler(_deleteTask);
