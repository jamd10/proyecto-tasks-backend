import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Middleware de autenticación
router.use((req, res, next) => {
  authMiddleware(req, res, next); // Asegura que todos los endpoints estén protegidos
});

// Rutas de tareas
router.get('/', (req, res, next) => {
  getTasks(req, res).catch(next); // Manejo de errores asincrónicos
});

router.post('/', (req, res, next) => {
  createTask(req, res).catch(next); // Manejo de errores asincrónicos
});

router.put('/:id', (req, res, next) => {
  updateTask(req, res).catch(next); // Manejo de errores asincrónicos
});

router.delete('/:id', (req, res, next) => {
  deleteTask(req, res).catch(next); // Manejo de errores asincrónicos
});

export default router;
