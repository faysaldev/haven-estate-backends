"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const handleError = (error) => {
    if (error instanceof Error) {
        return { message: error.message, stack: error.stack };
    }
    else {
        return { message: "An unknown error occurred" };
    }
};
exports.handleError = handleError;
