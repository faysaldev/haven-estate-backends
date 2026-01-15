"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (userDetails, secret, expiresIn) => {
    const options = { expiresIn: expiresIn };
    return jsonwebtoken_1.default.sign(userDetails, secret, options);
};
exports.createToken = createToken;
// Generate Refresh Token
const createRefreshToken = (userDetails) => {
    return (0, exports.createToken)(userDetails, process.env.JWT_REFRESH_SECRET, "30d");
};
exports.createRefreshToken = createRefreshToken;
