"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const logger_middleware_1 = __importDefault(require("./middlewares/logger.middleware"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static("./public"));
// Enable CORS for all routes
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
}));
// parse urlencoded request body
app.use(express_1.default.urlencoded({ extended: true }));
// compression the all data
app.use((0, compression_1.default)());
// Use the logging middleware for all routes
app.use(logger_middleware_1.default);
// Use the centralized routes
app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Node and Express!");
});
app.use("/api/v1", index_1.default); // This mounts all the routes under the /api prefix (e.g., /api/user)fgh
exports.default = app;
