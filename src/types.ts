export interface ChatMessage {
  id: string;
  sender: "user" | "jarvis";
  text: string;
  audio?: string; // base64 audio data if TTS is used
  timestamp: string;
}

export interface JarvisConfig {
  userTitle: string;
  userName: string;
  assistantName: string;
  toneStyle: string; // "Subtle British", "Sarcastic Butler", "High-Tech AI", "Warm Confidant"
  responseLength: "concise" | "balanced" | "detailed";
  customInstructions: string;
  preferredVoice: "Zephyr" | "Kore" | "Puck" | "Charon" | "Fenrir";
  ttsEnabled: boolean;
}

export interface ChinaRomStep {
  id: string;
  title: string;
  subtitle: string;
  category: "GMS" | "Clients" | "System" | "Automation" | "Netlify";
  content: string;
}
