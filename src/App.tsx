import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Sliders, Play, Info, HelpCircle, HardDrive, Wifi, Activity, Cpu } from "lucide-react";
import SetupGuide from "./components/SetupGuide";
import PromptCustomizer from "./components/PromptCustomizer";
import JarvisTerminal from "./components/JarvisTerminal";
import JarvisDashboard from "./components/JarvisDashboard";
import { JarvisConfig } from "./types";
import { DEFAULT_CONFIG } from "./data";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "terminal" | "customizer" | "guide">("dashboard");
  const [config, setConfig] = useState<JarvisConfig>(DEFAULT_CONFIG);
  const [systemUptime, setSystemUptime] = useState("04:12:08");

  // Load configuration from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jarvis_companion_config");
      if (saved) {
        setConfig(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load local config:", e);
    }
  }, []);

  const handleConfigChange = (newConfig: JarvisConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem("jarvis_companion_config", JSON.stringify(newConfig));
    } catch (e) {
      console.error("Failed to save local config:", e);
    }
  };

  // Simulate a live counting metrics tick
  useEffect(() => {
    const timer = setInterval(() => {
      const hours = Math.floor(Math.random() * 2) + 4;
      const mins = Math.floor(Math.random() * 60).toString().padStart(2, "0");
      const secs = Math.floor(Math.random() * 60).toString().padStart(2, "0");
      setSystemUptime(`0${hours}:${mins}:${secs}`);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 relative overflow-hidden flex flex-col" id="app-viewport">
      {/* Background Radial Glow Details */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Banner Section */}
      <header className="bg-slate-900/40 backdrop-blur-md border-b border-slate-900/60 py-5 px-6 select-none" id="dashboard-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center box-glow-cyan shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <span className="font-display font-bold text-lg text-cyan-400 animate-pulse">J</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-xl md:text-2xl text-slate-50 tracking-tight">
                  J.A.R.V.I.S. Companion
                </h1>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-md bg-cyan-500/25 text-cyan-300 border border-cyan-500/30">
                  v4.0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Realme & Redmi Turbo 3 (China ROM) AI Optimization Center
              </p>
            </div>
          </div>

          {/* Telemetry Panel */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6" id="dashboard-telemetry">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">Target Core</p>
                <p className="text-xs text-slate-300 font-mono font-medium">Turbo 3 ROM</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">Uptime</p>
                <p className="text-xs text-slate-300 font-mono font-medium">{systemUptime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">Proxy Ingress</p>
                <p className="text-xs text-slate-300 font-mono font-medium text-cyan-400">Secure (Active)</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-10" id="main-content-viewport">
        {/* Navigation Selector Tabs */}
        <div className="flex justify-center mb-8" id="tab-navigation-bar">
          <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              <Cpu className="w-4 h-4" />
              Core Hub
            </button>
            <button
              onClick={() => setActiveTab("terminal")}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "terminal"
                  ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              <Play className="w-4 h-4" />
              Voice Simulator
            </button>
            <button
              onClick={() => setActiveTab("customizer")}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "customizer"
                  ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              <Sliders className="w-4 h-4" />
              Prompt Customizer
            </button>
            <button
              onClick={() => setActiveTab("guide")}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "guide"
                  ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              China ROM Guides
            </button>
          </div>
        </div>

        {/* Dynamic Tab Panel Content */}
        <div className="relative" id="tab-content-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {activeTab === "dashboard" && (
                <JarvisDashboard config={config} onNavigate={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === "terminal" && <JarvisTerminal config={config} />}
              {activeTab === "customizer" && (
                <PromptCustomizer config={config} onChange={handleConfigChange} />
              )}
              {activeTab === "guide" && <SetupGuide config={config} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Info Statement */}
      <footer className="text-center py-6 text-[11px] text-slate-600 font-mono select-none border-t border-slate-900/50" id="dashboard-footer">
        <p>SYSTEM REVISION: LATEST // INTEGRATING @GOOGLE/GENAI GEMINI ENGINE</p>
        <p className="mt-1">DESIGNED DIRECTLY FOR COMPATIBILITY WITH REALME UI & XIAOMI HYPEROS DEEP STANDBY SETTINGS</p>
      </footer>
    </div>
  );
}
