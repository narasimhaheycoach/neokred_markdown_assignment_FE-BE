"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const markdown_it_1 = __importDefault(require("markdown-it"));
const app = (0, express_1.default)();
const md = new markdown_it_1.default();
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Convert Markdown to HTML
const convertMarkdownToHtml = (markdown) => {
    return md.render(markdown);
};
// POST /convert endpoint
app.post("/convert", (req, res, next) => {
    try {
        const { markdown } = req.body;
        // Input validation
        if (typeof markdown !== "string" || !markdown.trim()) {
            return res.status(400).json({
                error: "Markdown text is required and must be a non-empty string",
            });
        }
        // Convert Markdown to HTML
        const html = convertMarkdownToHtml(markdown);
        res.send({ html });
    }
    catch (err) {
        next(err); // Pass errors to the global error handler
    }
});
// Global error handler
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong on the server" });
});
// Start the server
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
