import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import MarkdownIt from "markdown-it";

const app = express();
const md = new MarkdownIt();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// TypeScript interface for request body
interface ConvertRequest {
  markdown: string;
}

// Convert Markdown to HTML
const convertMarkdownToHtml = (markdown: string): string => {
  return md.render(markdown);
};

// POST /convert endpoint
app.post("/convert", (req: Request, res: Response, next: NextFunction): any => {
  try {
    const { markdown } = req.body as ConvertRequest;

    // Input validation
    if (typeof markdown !== "string" || !markdown.trim()) {
      return res.status(400).json({
        error: "Markdown text is required and must be a non-empty string",
      });
    }

    // Convert Markdown to HTML
    const html = convertMarkdownToHtml(markdown);
    res.send({ html });
  } catch (err) {
    next(err); // Pass errors to the global error handler
  }
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

// Start the server
const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
