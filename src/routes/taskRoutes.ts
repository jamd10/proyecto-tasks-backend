import express, { Request, Response, NextFunction } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import Task from '../models/Task';
import authMiddleware, { AuthRequest } from '../middlewares/authMiddleware';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

// Middleware de autenticación
router.use(authMiddleware);

// Obtener tareas con paginación
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await getTasks(req, res);
  } catch (error) {
    next(error);
  }
});

// Obtener una tarea específica por ID
router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: 'Invalid task ID format' });
      return;
    }

    // Buscar la tarea en la base de datos
    const task = await Task.findById(id);

    if (!task) {
      res.status(404).json({ message: 'Task not found.' });
      return;
    }

    // Verificar si la tarea pertenece al usuario autenticado
    if (task.userId.toString() !== req.user.id) {
      res.status(403).json({ message: 'Access denied to this task.' });
      return;
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

// Crear tarea con validaciones
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      await createTask(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// Actualizar tarea con validaciones
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty if provided'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      await updateTask(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// Eliminar tarea
router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteTask(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
