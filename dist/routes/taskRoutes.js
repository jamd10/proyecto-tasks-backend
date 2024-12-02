"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const Task_1 = __importDefault(require("../models/Task"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// Middleware de autenticación
router.use(authMiddleware_1.default);
// Obtener tareas con paginación
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, taskController_1.getTasks)(req, res);
    }
    catch (error) {
        next(error);
    }
}));
// Obtener una tarea específica por ID
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validar que el ID sea válido
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(400).json({ message: 'Invalid task ID format' });
            return;
        }
        // Buscar la tarea en la base de datos
        const task = yield Task_1.default.findById(id);
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
    }
    catch (error) {
        next(error);
    }
}));
// Crear tarea con validaciones
router.post('/', [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        yield (0, taskController_1.createTask)(req, res);
    }
    catch (error) {
        next(error);
    }
}));
// Actualizar tarea con validaciones
router.put('/:id', [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid task ID'),
    (0, express_validator_1.body)('title').optional().notEmpty().withMessage('Title cannot be empty if provided'),
    (0, express_validator_1.body)('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        yield (0, taskController_1.updateTask)(req, res);
    }
    catch (error) {
        next(error);
    }
}));
// Eliminar tarea
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, taskController_1.deleteTask)(req, res);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
