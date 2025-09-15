"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatResponse = void 0;
const formatResponse = (res, statusCode, status, message, content) => {
    return res.status(statusCode).json({
        status,
        message,
        content,
    });
};
exports.formatResponse = formatResponse;
//# sourceMappingURL=formatRespons.js.map