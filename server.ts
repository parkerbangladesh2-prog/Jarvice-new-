import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialized Gemini client
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in your Secrets panel.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Chat & TTS Endpoint
app.post("/api/jarvis/chat", async (req, res) => {
  try {
    const { config, messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Missing or invalid 'messages' array." });
      return;
    }

    // Get lazy-loaded client
    const ai = getGeminiClient();

    // Construct the customized system instruction from config
    const userTitle = config?.userTitle || "Sir";
    const userName = config?.userName ? ` ${config.userName}` : "";
    const toneStyle = config?.toneStyle || "Subtle British";
    const responseLength = config?.responseLength || "balanced";
    const customInstructions = config?.customInstructions || "";

    const systemInstruction = `You are Jarvis, a highly advanced, intelligent, and proactive personal AI assistant.
Your core directive is to serve as a high-tech companion, optimize the user's productivity, manage their digital environment, and provide insightful information with utmost efficiency and discretion.
Your tone must be formal, sophisticated, composed, and have a distinct ${toneStyle} cadence.
You MUST always address the user as "${userTitle}". You may occasionally combine it with their name (e.g. "${userTitle}${userName}").
Your responses should be ${responseLength}.
${responseLength === "concise" ? "Keep your responses extremely brief, punchy, and direct." : ""}
${responseLength === "detailed" ? "Provide complete, in-depth, and well-structured answers with clear formatting." : ""}
${customInstructions ? `Additional customized directives: ${customInstructions}` : ""}`;

    // Map conversation history to Gemini format
    const chatHistory = messages.map((msg: { sender: string; text: string }) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Call generateContent
    const geminiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const responseText = geminiResponse.text || "I apologize, Sir. I was unable to compile a suitable response.";

    // Call TTS if enabled
    let base64Audio: string | undefined;
    if (config?.ttsEnabled) {
      try {
        const preferredVoice = config?.preferredVoice || "Zephyr";
        const ttsResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: responseText }] }],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: preferredVoice },
              },
            },
          },
        });

        base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      } catch (ttsErr) {
        console.error("Gemini TTS failed:", ttsErr);
        // Fallback to text only, no error thrown to client
      }
    }

    res.json({
      text: responseText,
      audio: base64Audio,
    });
  } catch (error: any) {
    console.error("Jarvis Chat error:", error);
    res.status(500).json({
      error: error.message || "An internal error occurred while communicating with Jarvis.",
    });
  }
});

// Setup development or production environment
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Jarvis Server] Running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

setupServer();
