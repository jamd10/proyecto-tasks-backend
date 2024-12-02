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
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield Task_1.default.find({ userId: req.user.id });
        return res.json(tasks);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error.', error });
    }
});
exports.getTasks = getTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, status } = req.body;
    try {
        const task = new Task_1.default({ title, description, status, userId: req.user.id });
        yield task.save();
        return res.status(201).json(task);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error.', error });
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const task = yield Task_1.default.findByIdAndUpdate(id, { title, description, status }, { new: true });
        if (!task)
            return res.status(404).json({ message: 'Task not found.' });
        return res.json(task);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error.', error });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const task = yield Task_1.default.findByIdAndDelete(id);
        if (!task)
            return res.status(404).json({ message: 'Task not found.' });
        return res.json({ message: 'Task deleted successfully.' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error.', error });
    }
});
exports.deleteTask = deleteTask;
