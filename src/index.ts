import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Rutas
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

// Configuración del entorno
dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Endpoints principales
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Endpoint base
app.get('/', (req, res) => {
  res.send('API RESTful de Tareas funcionando correctamente.');
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint no encontrado.' });
});

// Manejo global de errores
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor.', error: err.message });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
