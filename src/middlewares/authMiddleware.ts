import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.split(' ')[1]; // Obtiene el token del header

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' }); // Devuelve error si no hay token
    return; // Detiene la ejecución
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string); // Verifica el token
    req.user = decoded; // Agrega la información del usuario al request
    next(); // Continúa al siguiente middleware o controlador
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' }); // Devuelve error si el token no es válido
  }
};

export default authMiddleware;
