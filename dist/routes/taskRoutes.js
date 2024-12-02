"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
// Middleware de autenticación
router.use((req, res, next) => {
    (0, authMiddleware_1.default)(req, res, next); // Asegura que todos los endpoints estén protegidos
});
// Rutas de tareas
router.get('/', (req, res, next) => {
    (0, taskController_1.getTasks)(req, res).catch(next); // Manejo de errores asincrónicos
});
router.post('/', (req, res, next) => {
    (0, taskController_1.createTask)(req, res).catch(next); // Manejo de errores asincrónicos
});
router.put('/:id', (req, res, next) => {
    (0, taskController_1.updateTask)(req, res).catch(next); // Manejo de errores asincrónicos
});
router.delete('/:id', (req, res, next) => {
    (0, taskController_1.deleteTask)(req, res).catch(next); // Manejo de errores asincrónicos
});
exports.default = router;
