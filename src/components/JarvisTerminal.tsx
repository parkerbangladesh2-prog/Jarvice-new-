import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Send, Volume2, VolumeX, ShieldAlert, Sparkles, Terminal, Play, CircleAlert, Cpu, Radio, Zap, Copy, Check, Globe } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, JarvisConfig } from "../types";
import { SUGGESTED_COMMANDS } from "../data";

const jarvisCoreImg = "/src/assets/images/jarvis_core_1784006866001.jpg";

interface JarvisTerminalProps {
  config: JarvisConfig;
}

export default function JarvisTerminal({ config }: JarvisTerminalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "jarvis",
      text: `Good day, ${config.userTitle || "Sir"}. Systems are online. I have loaded your specialized Realme/Redmi Turbo 3 configuration profile. I am active and ready for your commands.`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voicePlaybackMode, setVoicePlaybackMode] = useState<"ai" | "browser" | "off">("ai");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [recognitionError, setRecognitionError] = useState("");
  const [speechLanguage, setSpeechLanguage] = useState("en-US");
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Netlify direct client configuration state
  const [clientApiKey, setClientApiKey] = useState<string>(() => {
    return localStorage.getItem("jarvis_client_gemini_api_key") || "";
  });
  const [isStaticModeActive, setIsStaticModeActive] = useState<boolean>(() => {
    // Automatically flag as static if running on a netlify or local-dev without explicit backend proxy if desired, or let auto-detection do it
    return window.location.hostname.includes("netlify") || window.location.hostname.includes("github.io");
  });
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const [apiKeyInputValue, setApiKeyInputValue] = useState("");


  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Scroll chat to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle configuration changes updates initial message
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "initial") {
        return [
          {
            id: "initial",
            sender: "jarvis",
            text: `Good day, ${config.userTitle || "Sir"}. Systems are online. I have loaded your specialized Realme/Redmi Turbo 3 configuration profile. I am active and ready for your commands.`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ];
      }
      return prev;
    });
  }, [config.userTitle]);

  // Clean up Web Audio on unmount
  useEffect(() => {
    return () => {
      stopPlayingAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Set up browser speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = speechLanguage;

      rec.onstart = () => {
        setIsListening(true);
        setRecognitionError("");
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setInputText(text);
          // Auto send can be cool, but let user review it first to ensure accuracy
        }
      };

      rec.onerror = (err: any) => {
        console.error("Speech recognition error:", err);
        setRecognitionError(`Voice input failed: ${err.error || "No speech detected"}`);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [speechLanguage]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setRecognitionError("Speech Recognition is not supported in this browser version. Please type your query.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopPlayingAudio();
      window.speechSynthesis?.cancel();
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stopPlayingAudio = () => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop();
      } catch (e) {}
      activeSourceRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  // Playback raw 24kHz PCM mono returned by Gemini TTS
  const playPcmAudio = async (base64Data: string) => {
    try {
      stopPlayingAudio();
      setIsPlayingAudio(true);

      const binary = atob(base64Data);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      // Convert 16-bit signed Int16 raw PCM to Float32
      const int16Array = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      // Initialize audio context lazily
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const audioCtx = audioContextRef.current;
      const audioBuffer = audioCtx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.copyToChannel(float32Array, 0);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      
      source.onended = () => {
        setIsPlayingAudio(false);
      };

      activeSourceRef.current = source;
      source.start(0);
    } catch (e) {
      console.error("PCM Playback failed:", e);
      setIsPlayingAudio(false);
    }
  };

  // Playback standard Browser Speech Synthesis
  const speakBrowserTts = (text: string) => {
    if (!window.speechSynthesis) return;
    stopPlayingAudio();
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

    // Try to find a British English voice for that butler feel!
    const voices = window.speechSynthesis.getVoices();
    const ukVoice = voices.find(v => v.lang.startsWith("en-GB") || v.name.includes("Google UK English") || v.name.includes("British"));
    if (ukVoice) {
      utterance.voice = ukVoice;
    }

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleClientSideDirectGemini = async (messagesList: ChatMessage[], keyToUse: string) => {
    const ai = new GoogleGenAI({ apiKey: keyToUse });
    
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

    const chatHistory = messagesList.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const responseText = geminiResponse.text || "I apologize, Sir. I was unable to compile a suitable response.";

    let base64Audio: string | undefined;
    if (voicePlaybackMode === "ai") {
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
        console.error("Client-side TTS failed:", ttsErr);
      }
    }

    return { text: responseText, audio: base64Audio };
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    stopPlayingAudio();
    window.speechSynthesis?.cancel();

    // Append User Message
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    let data: any = null;
    let fallbackToClient = isStaticModeActive;

    try {
      if (!fallbackToClient) {
        try {
          const response = await fetch("/api/jarvis/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              config: {
                ...config,
                ttsEnabled: voicePlaybackMode === "ai",
              },
              messages: newMessages,
            }),
          });

          if (response.status === 404) {
            console.warn("Express endpoint missing (404). Transitioning to client-side static mode.");
            setIsStaticModeActive(true);
            fallbackToClient = true;
          } else if (!response.ok) {
            throw new Error("Connection to mainframe disrupted.");
          } else {
            data = await response.json();
          }
        } catch (fetchErr: any) {
          console.warn("Mainframe proxy unreachable. Transitioning to client-side static mode.");
          setIsStaticModeActive(true);
          fallbackToClient = true;
        }
      }

      if (fallbackToClient) {
        if (!clientApiKey) {
          setShowApiKeyPrompt(true);
          setIsLoading(false);
          setMessages((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              sender: "jarvis",
              text: `[!] STATIC MODE ENGAGED (Netlify / Static Web Host)\n\nSir, since we are executing on a static web server without full-stack runtime capabilities, I need you to enter your personal Gemini API Key below to keep my cognitive systems functional.`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
          return;
        }

        data = await handleClientSideDirectGemini(newMessages, clientApiKey);
      }

      if (!data) {
        throw new Error("Unable to retrieve response from active nodes.");
      }

      const jarvisMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "jarvis",
        text: data.text,
        audio: data.audio,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages(prev => [...prev, jarvisMsg]);

      // Play vocal audio based on preferences
      if (voicePlaybackMode === "ai" && data.audio) {
        playPcmAudio(data.audio);
      } else if (voicePlaybackMode === "browser") {
        speakBrowserTts(data.text);
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "jarvis",
          text: err.message || "An error occurred, Sir. I was unable to connect with my core database structure.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 text-gray-200" id="jarvis-terminal-dashboard">
      {/* COLUMN 1: Suggestions / Interactive Presets (Left) */}
      <div className="xl:w-[28%] flex flex-col space-y-6">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl" id="preset-commands-card">
          <h3 className="font-sans font-bold text-lg text-slate-100 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Quick Diagnostics
          </h3>
          <p className="text-xs text-slate-400 mb-5">
            Summon Jarvis with these configured template statements to test his vocal cadence and butler persona:
          </p>

          <div className="space-y-3" id="quick-presets-container">
            {SUGGESTED_COMMANDS.map((cmd, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSendMessage(cmd.text)}
                className="w-full text-left p-3.5 rounded-xl border border-slate-850 bg-slate-950/40 hover:bg-slate-800/40 hover:border-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{cmd.label}</span>
                  <Play className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed group-hover:text-slate-100 transition-colors">
                  "{cmd.text}"
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Output Selector Card */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl" id="tts-settings-card">
          <h3 className="font-sans font-bold text-lg text-slate-100 mb-3 flex items-center gap-2.5">
            <Volume2 className="w-5 h-5 text-cyan-400" />
            Voice Configuration
          </h3>
          <div className="space-y-3">
            {[
              { id: "ai", title: "AI Vocal Synthesis", desc: "Server-side 24kHz Gemini neural voices." },
              { id: "browser", title: "Web Speech Engine", desc: "Uses your local browser system voice." },
              { id: "off", title: "Visual Text Only", desc: "Completely mutes verbal playback." },
            ].map((mode) => (
              <div
                key={mode.id}
                onClick={() => setVoicePlaybackMode(mode.id as any)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  voicePlaybackMode === mode.id
                    ? "bg-cyan-500/10 border-cyan-500/40"
                    : "bg-slate-950/20 border-transparent hover:bg-slate-950/40"
                }`}
              >
                <div className="flex items-start gap-2.5 select-none">
                  <input
                    type="radio"
                    checked={voicePlaybackMode === mode.id}
                    onChange={() => setVoicePlaybackMode(mode.id as any)}
                    className="mt-0.5 border-slate-800 text-cyan-500 focus:ring-cyan-500"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-100">{mode.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{mode.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Netlify / Static Deployments Integration Card */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl" id="netlify-integration-card">
          <h3 className="font-sans font-bold text-lg text-slate-100 mb-2.5 flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-cyan-400" />
            Netlify Compatibility
          </h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Configure how Jarvis runs when hosted statically on platform servers like Netlify:
          </p>

          <div className="space-y-3.5">
            <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-850">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wide">Mainframe Mode</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                isStaticModeActive 
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                  : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
              }`}>
                {isStaticModeActive ? "Static (Netlify)" : "Full-Stack Server"}
              </span>
            </div>

            {isStaticModeActive && (
              <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wide">Client API Key</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  clientApiKey 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse"
                }`}>
                  {clientApiKey ? "Configured" : "Required"}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
              <button
                onClick={() => {
                  setApiKeyInputValue(clientApiKey);
                  setShowApiKeyPrompt(true);
                }}
                className="py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl transition-all cursor-pointer text-center"
              >
                {clientApiKey ? "Edit API Key" : "Insert API Key"}
              </button>
              <button
                onClick={() => {
                  const newVal = !isStaticModeActive;
                  setIsStaticModeActive(newVal);
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: Math.random().toString(),
                      sender: "jarvis",
                      text: `Mainframe toggled to ${newVal ? "Static Client-Side mode" : "Full-Stack Server mode"}, ${config.userTitle || "Sir"}. Ready to process queries.`,
                      timestamp: new Date().toLocaleTimeString(),
                    },
                  ]);
                }}
                className="py-2 bg-slate-950/50 hover:bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-750 rounded-xl transition-all cursor-pointer text-center"
              >
                {isStaticModeActive ? "Force Full-Stack" : "Force Static"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* COLUMN 2: J.A.R.V.I.S. Core Picture & Matrix (Middle) */}
      <div className="xl:w-[32%] flex flex-col space-y-6" id="jarvis-core-center-column">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-between min-h-[580px] relative overflow-hidden">
          {/* Subtle overlay lines for holographic CRT monitor feel */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_97%,rgba(6,182,212,0.03)_97%)] bg-[length:100%_4px] pointer-events-none" />

          {/* Matrix Header */}
          <div className="text-center select-none w-full border-b border-slate-850 pb-3">
            <h3 className="font-display font-bold text-base text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
              Core Matrix
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">
              Holographic System Node • Interactive Visualizer
            </p>
          </div>

          {/* Glowing Animated Circular Core Picture */}
          <div className="relative flex items-center justify-center py-6 select-none" id="core-hologram-avatar">
            {/* outer tech rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-60 h-60 rounded-full border border-dashed border-cyan-500/15"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-52 h-52 rounded-full border border-double border-cyan-500/25 shadow-[0_0_20px_rgba(6,182,212,0.05)]"
            />

            {/* active pulsing glow effect depending on speaking/thinking state */}
            <motion.div
              animate={isPlayingAudio ? {
                scale: [1, 1.08, 1],
                opacity: [0.3, 0.7, 0.3],
              } : isLoading ? {
                scale: [1, 1.03, 1],
                opacity: [0.2, 0.5, 0.2],
              } : {
                scale: [1, 1.01, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: isPlayingAudio ? 0.8 : 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute w-44 h-44 rounded-full bg-cyan-400/20 blur-xl"
            />

            {/* The Actual Generated J.A.R.V.I.S. Core Picture */}
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-cyan-400/40 p-1 bg-slate-950/80 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <img
                src={jarvisCoreImg}
                alt="J.A.R.V.I.S. Core Picture"
                referrerPolicy="no-referrer"
                className={`w-full h-full rounded-full object-cover transition-all duration-500 ${
                  isPlayingAudio ? "scale-105 brightness-110" : isLoading ? "brightness-105 animate-pulse" : "brightness-90 hover:brightness-100"
                }`}
              />
            </div>

            {/* Core telemetry details */}
            <div className="absolute bottom-[-16px] px-3.5 py-1 bg-slate-950 border border-slate-800 rounded-full shadow-lg">
              <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                {isPlayingAudio ? "Core Vocalizing" : isLoading ? "Syncing Threads" : "Active Standby"}
              </span>
            </div>
          </div>

          {/* Quick Special Protocols */}
          <div className="w-full mt-4 bg-slate-950/40 border border-slate-850 p-4 rounded-2xl">
            <p className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wider mb-2.5 text-center flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              Special System Protocols
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Morning", cmd: "J.A.R.V.I.S., protocol Morning", desc: "Start Morning Briefing", color: "hover:bg-amber-500/10 hover:border-amber-500/30 text-slate-300" },
                { name: "Night", cmd: "J.A.R.V.I.S., protocol Night", desc: "Secure Core & Lock Up", color: "hover:bg-purple-500/10 hover:border-purple-500/30 text-slate-300" },
                { name: "Away", cmd: "J.A.R.V.I.S., protocol Away", desc: "Deploy Surveillance", color: "hover:bg-blue-500/10 hover:border-blue-500/30 text-slate-300" },
                { name: "Emergency", cmd: "J.A.R.V.I.S., protocol Emergency", desc: "Trigger Security Alarm", color: "hover:bg-red-500/10 hover:border-red-500/30 text-slate-300" },
              ].map((p) => (
                <button
                  key={p.name}
                  disabled={isLoading}
                  onClick={() => handleSendMessage(p.cmd)}
                  className={`p-2 rounded-xl border border-slate-850 bg-slate-950 text-[11px] font-mono text-left transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex flex-col justify-between ${p.color}`}
                >
                  <span className="font-bold text-cyan-400 text-[10px]">PROT: {p.name.toUpperCase()}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 truncate">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* COLUMN 3: Main Terminal Chat Interface (Right) */}
      <div className="xl:w-[40%] flex flex-col h-[580px] bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden" id="jarvis-chat-terminal">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5 select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="font-mono text-xs text-slate-400 ml-2 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-cyan-500" />
              JARVIS_SYSTEM_V4.0_ACTIVE
            </span>
          </div>

          {/* Voice Wave Visualizer */}
          <div className="flex items-center gap-1.5 h-6">
            <AnimatePresence>
              {isPlayingAudio || isLoading ? (
                <div className="flex items-center gap-0.5 h-5 px-3 bg-cyan-500/10 rounded-full border border-cyan-500/20" id="audio-visualizer-wave">
                  <span className="text-[10px] font-bold text-cyan-400 font-mono mr-1.5 uppercase tracking-wider select-none animate-pulse">
                    {isPlayingAudio ? "Speaking" : "Thinking"}
                  </span>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isPlayingAudio ? [4, 20, 4] : [4, 12, 4],
                      }}
                      transition={{
                        duration: isPlayingAudio ? 0.6 + i * 0.1 : 0.4 + i * 0.08,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-0.75 bg-cyan-400 rounded-full"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-1 px-3 py-1 bg-slate-950/80 border border-slate-850 rounded-full text-[10px] font-mono text-slate-500 font-semibold select-none">
                  STANDBY
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 font-mono text-sm leading-relaxed mb-6" id="terminal-messages-list">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3.5 shadow-md relative group ${
                    isUser
                      ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-100 rounded-tr-none"
                      : "bg-slate-950/60 border border-slate-850 text-slate-200 rounded-tl-none"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 text-[10px] text-slate-500 font-bold tracking-wider uppercase select-none gap-6">
                    <span>{isUser ? config.userName || "User" : config.assistantName || "Jarvis"}</span>
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => {
                          try {
                            navigator.clipboard.writeText(msg.text);
                            setCopiedMessageId(msg.id);
                            setTimeout(() => setCopiedMessageId(null), 2000);
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-pointer"
                        title="Copy text to clipboard"
                      >
                        {copiedMessageId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] bg-slate-950/60 border border-slate-850 rounded-2xl rounded-tl-none px-4 py-3.5 text-slate-400">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Sir, compiling logic arrays...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Errors Alert */}
        {recognitionError && (
          <div className="flex items-center gap-2 px-3.5 py-2.5 mb-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-mono">
            <CircleAlert className="w-4 h-4 flex-shrink-0" />
            <span>{recognitionError}</span>
          </div>
        )}

        {/* Static Deployment / Netlify API Key Setup Overlay */}
        <AnimatePresence>
          {showApiKeyPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="mb-3.5 bg-slate-950/95 border border-cyan-500/40 p-4.5 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.15)]"
            >
              <div className="flex items-start gap-3 mb-3">
                <ShieldAlert className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0 animate-pulse" />
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
                    MAINMAIN COGNITIVE ACTIVATION (NETLIFY / STATIC)
                  </h4>
                  <p className="text-[10px] text-slate-400 font-sans mt-1 leading-relaxed">
                    Sir, to enable full cognitive voice processing in static hosting environments like Netlify, please supply your Google AI Studio API key. It is saved purely inside your browser cache.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Insert Gemini API Key (AIzaSy...)"
                  value={apiKeyInputValue}
                  onChange={(e) => setApiKeyInputValue(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => {
                    const key = apiKeyInputValue.trim();
                    if (key) {
                      localStorage.setItem("jarvis_client_gemini_api_key", key);
                      setClientApiKey(key);
                      setShowApiKeyPrompt(false);
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: Math.random().toString(),
                          sender: "jarvis",
                          text: `Mainframe synchronized, ${config.userTitle || "Sir"}. Client-side direct connection established successfully.`,
                          timestamp: new Date().toLocaleTimeString(),
                        },
                      ]);
                    }
                  }}
                  className="px-4 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  Save Key
                </button>
                <button
                  onClick={() => setShowApiKeyPrompt(false)}
                  className="px-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Input Area */}
        <div className="flex items-center gap-2 mt-auto bg-slate-950/60 rounded-2xl border border-slate-850 p-2" id="terminal-input-bar">
          <button
            onClick={toggleListening}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
              isListening
                ? "bg-red-500/20 border border-red-500/30 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)] animate-pulse"
                : "bg-slate-850 border border-slate-750 text-slate-300 hover:text-cyan-400 hover:border-slate-700"
            }`}
            title="Speech-to-Text Voice Input"
          >
            {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
          </button>

          <div className="relative flex-shrink-0" id="mic-language-selector">
            <select
              value={speechLanguage}
              onChange={(e) => setSpeechLanguage(e.target.value)}
              className="absolute opacity-0 inset-0 w-full h-full cursor-pointer z-10"
              title="Select Speech Input Language"
            >
              <option value="en-US">English (US)</option>
              <option value="bn-BD">Bengali (বাংলা)</option>
              <option value="hi-IN">Hindi (हिन्दी)</option>
            </select>
            <div className="h-11 px-3 bg-slate-850 border border-slate-750 rounded-xl flex items-center gap-1.5 text-xs text-slate-300 font-mono hover:text-cyan-400 hover:border-slate-700 transition-all select-none">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{speechLanguage === "en-US" ? "EN" : speechLanguage === "bn-BD" ? "BN" : "HI"}</span>
            </div>
          </div>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            placeholder={`> Enter command (${speechLanguage === "en-US" ? "English" : speechLanguage === "bn-BD" ? "Bengali" : "Hindi"}), ${config.userTitle || "Sir"}...`}
            className="flex-1 bg-transparent text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none border-none py-2 px-1 focus:ring-0"
          />

          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
            className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
