"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Obtiene el token del header
    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' }); // Devuelve error si no hay token
        return; // Detiene la ejecución
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET); // Verifica el token
        req.user = decoded; // Agrega la información del usuario al request
        next(); // Continúa al siguiente middleware o controlador
    }
    catch (err) {
        res.status(400).json({ message: 'Invalid token.' }); // Devuelve error si el token no es válido
    }
};
exports.default = authMiddleware;
