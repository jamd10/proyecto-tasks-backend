import express, { Request, Response, NextFunction } from 'express';
import { register, login } from '../controllers/authController';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Registro de usuario con validaciones
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    register(req, res).catch(next); // Llama al controlador y pasa errores a `next()`
  }
);

// Inicio de sesión con validaciones
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    login(req, res).catch(next); // Llama al controlador y pasa errores a `next()`
  }
);

export default router;
