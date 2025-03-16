//@ts-nocheck

import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { sendRequestToGemini, BookingDetails } from "./sendRequestToGemini";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "50mb" })); // Increased limit for audio data
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for frontend requests

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello, TypeScript Express!" });
});

// Interface for the request body
interface GeminiRequestBody {
  audioBase64: string;
  bookingDetails: {
    [key: string]: any; // Adjust this based on your specific booking details structure
  };
  isFirstInteraction: boolean;
}

// Extend Request type to include our custom body
interface GeminiRequest extends Request {
  body: GeminiRequestBody;
}

// Gemini API endpoint
//@ts-ignore
app.post("/api/gemini", async (req: GeminiRequest, res: Response) => {
  console.log("/api/gemini route called");
  console.log("Request  body:", req.body);

  try {
    const { audioBase64, bookingDetails, chatId } = req.body;

    // Validate request
    if (bookingDetails === undefined) {
      return res.status(400).json({
        error: "Missing required booking details",
      });
    }

    // Process with Gemini
    const response = await sendRequestToGemini(
      audioBase64 || null,
      bookingDetails as BookingDetails,
      chatId
    );

    // Return response
    res.json(response);
  } catch (error) {
    console.error("Error in Gemini API route:", error);
    res.status(500).json({
      error: "Failed to process request",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
