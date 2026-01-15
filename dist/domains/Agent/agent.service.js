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
const agent_model_1 = __importDefault(require("./agent.model"));
// Service to add or update agents
const addAgents = (agents) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Then create new agents
        const createdAgents = yield agent_model_1.default.create(agents);
        return createdAgents;
    }
    catch (error) {
        throw error;
    }
});
// Service to get agents
const getAgents = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agents = yield agent_model_1.default.find();
        return { agents };
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    addAgents,
    getAgents,
};
