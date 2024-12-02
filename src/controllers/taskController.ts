import { Request, Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getTasks = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { title, description, status } = req.body;

  try {
    const task = new Task({ title, description, status, userId: req.user.id });
    await task.save();

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found.' });

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) return res.status(404).json({ message: 'Task not found.' });

    return res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error });
  }
};
