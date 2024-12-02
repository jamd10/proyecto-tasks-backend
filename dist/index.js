"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Importación de rutas
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
// Configuración del entorno
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares globales
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Conexión a MongoDB
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.error('Error al conectar a MongoDB:', err));
// Rutas principales
app.use('/auth', authRoutes_1.default); // Rutas de autenticación
app.use('/tasks', taskRoutes_1.default); // Rutas de tareas
// Endpoint base
app.get('/', (req, res) => {
    res.send('API RESTful de Tareas funcionando correctamente.');
});
// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint no encontrado.' });
});
// Manejo global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: 'Internal Server Error', error: err.message });
});
// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
