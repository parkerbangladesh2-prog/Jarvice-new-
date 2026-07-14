import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Zap, Activity, ShieldCheck, Thermometer, Battery, Globe, Network, Sparkles, MessageSquare, Play, HelpCircle, HardDrive } from "lucide-react";
import { JarvisConfig } from "../types";

interface JarvisDashboardProps {
  config: JarvisConfig;
  onNavigate: (tab: "terminal" | "customizer" | "guide") => void;
}

const jarvisCoreImg = "/src/assets/images/jarvis_core_1784006866001.jpg";

export default function JarvisDashboard({ config, onNavigate }: JarvisDashboardProps) {
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const [coreStatus, setCoreStatus] = useState<"ACTIVE" | "SLEEP" | "DIAGNOSING">("ACTIVE");
  const [activeBrainNodeCount, setActiveBrainNodeCount] = useState(892);
  const [memoryCapacity, setMemoryCapacity] = useState(74.2);
  const [selectedLangName, setSelectedLangName] = useState("Multilingual Core");

  // Synthesize custom high-tech audio chime
  const playBeep = (freq: number, type: OscillatorType = "sine", duration = 0.1) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.value = freq;
      
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context not supported in this iframe:", e);
    }
  };

  // Live fluctuating background stats to simulate J.A.R.V.I.S.'s "live brain" activity
  useEffect(() => {
    const interval = setInterval(() => {
      if (coreStatus === "ACTIVE") {
        setActiveBrainNodeCount((prev) => {
          const delta = Math.floor(Math.random() * 9) - 4;
          const newVal = prev + delta;
          return newVal > 1024 ? 1024 : newVal < 800 ? 800 : newVal;
        });
        setMemoryCapacity((prev) => {
          const delta = (Math.random() * 0.4) - 0.2;
          const newVal = parseFloat((prev + delta).toFixed(1));
          return newVal > 99.9 ? 99.9 : newVal < 65.0 ? 65.0 : newVal;
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [coreStatus]);

  const runDiagnostic = () => {
    if (isDiagnosticRunning) return;
    playBeep(880, "sine", 0.15);
    setTimeout(() => playBeep(1320, "sine", 0.25), 150);
    
    setIsDiagnosticRunning(true);
    setCoreStatus("DIAGNOSING");
    setDiagnosticProgress(0);
    setDiagnosticLogs(["Initializing Complete System Diagnostic..."]);

    const steps = [
      { prg: 15, log: "Initializing Neural core interface... OK" },
      { prg: 30, log: `Checking local preferences: Welcome back, ${config.userTitle || "Sir"} ${config.userName || "Parker"}` },
      { prg: 45, log: "Parsing system parameters (Realme UI & Xiaomi HyperOS Optimization: ENGAGED)" },
      { prg: 65, log: `Verifying J.A.R.V.I.S. Language Engine (Multilingual Dialects: COMPLIANT)` },
      { prg: 80, log: "Testing Neural Arc Core holographic visual matrix... STATUS STABLE" },
      { prg: 95, log: "Syncing proxy ingress layers & Google Gemini 2.5/3.5-Flash thread pathways... CONNECTED" },
      { prg: 100, log: "SYSTEM STATUS: SECURE, FULLY FUNCTIONAL, AND READY FOR YOUR DISPOSAL, SIR!" },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        setDiagnosticProgress(step.prg);
        setDiagnosticLogs((prev) => [...prev, `[+] ${step.log}`]);
        playBeep(440 + step.prg * 6, "triangle", 0.08);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsDiagnosticRunning(false);
          setCoreStatus("ACTIVE");
          playBeep(1760, "sine", 0.4);
        }, 1000);
      }
    }, 800);
  };

  const handleToggleCoreState = () => {
    if (coreStatus === "ACTIVE") {
      setCoreStatus("SLEEP");
      playBeep(220, "sawtooth", 0.3);
    } else {
      setCoreStatus("ACTIVE");
      playBeep(1100, "sine", 0.2);
    }
  };

  return (
    <div className="space-y-8 text-gray-200" id="jarvis-core-dashboard-overview">
      
      {/* 1. HERO ARCH CORE BRANE / BRAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="hero-core-grid">
        
        {/* Holographic Arc Core (Left Column) */}
        <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl min-h-[460px]" id="holographic-arc-core">
          {/* Subtle overlay lines for CRT scanline look */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_97%,rgba(6,182,212,0.03)_97%)] bg-[length:100%_4px] pointer-events-none" />
          
          {/* Diagnostic scanning laser line effect */}
          {isDiagnosticRunning && (
            <motion.div
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee] z-20"
            />
          )}

          {/* Core HUD Frame */}
          <div className="text-center w-full border-b border-slate-850 pb-4 mb-4 select-none">
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              J.A.R.V.I.S. BRAIN SYSTEM ENGINE
            </span>
            <h2 className="font-display font-black text-2xl text-slate-100 mt-1 uppercase tracking-tight">
              NEURAL ARC CORE v2.0
            </h2>
          </div>

          {/* Central Rotating Holographic Brain & Frame */}
          <div className="relative flex items-center justify-center py-8 select-none">
            {/* Holographic orbital rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute w-72 h-72 rounded-full border border-dashed border-cyan-500/10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-64 h-64 rounded-full border border-double border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.04)]"
            />
            <motion.div
              animate={{ rotate: 180 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute w-52 h-52 rounded-full border border-cyan-400/20 shadow-[inset_0_0_15px_rgba(6,182,212,0.1)]"
            />

            {/* Pulsating back glow */}
            <motion.div
              animate={{
                scale: coreStatus === "ACTIVE" ? [1, 1.1, 1] : coreStatus === "DIAGNOSING" ? [1, 1.2, 1] : [0.95, 1, 0.95],
                opacity: coreStatus === "ACTIVE" ? [0.25, 0.5, 0.25] : coreStatus === "DIAGNOSING" ? [0.4, 0.8, 0.4] : [0.08, 0.15, 0.08],
              }}
              transition={{
                duration: coreStatus === "DIAGNOSING" ? 0.6 : 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute w-44 h-44 rounded-full bg-cyan-500/30 blur-2xl z-0"
            />

            {/* MAIN ARC REACTOR / BRAIN IMAGE TARGET */}
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-cyan-400/40 p-1.5 bg-slate-950/80 shadow-[0_0_40px_rgba(6,182,212,0.4)] z-10">
              <img
                src={jarvisCoreImg}
                alt="J.A.R.V.I.S. Neural Core"
                referrerPolicy="no-referrer"
                className={`w-full h-full rounded-full object-cover transition-all duration-700 ${
                  coreStatus === "ACTIVE"
                    ? "scale-100 brightness-105"
                    : coreStatus === "DIAGNOSING"
                    ? "scale-105 brightness-125 animate-pulse"
                    : "scale-95 brightness-50 grayscale"
                }`}
              />
              
              {/* Spinning visual compass frame */}
              <div className="absolute inset-0 border-4 border-dashed border-cyan-500/10 rounded-full animate-spin" />
            </div>

            {/* Real-time telemetry indicators */}
            <div className="absolute bottom-[-16px] px-4 py-1.5 bg-slate-950 border border-slate-800 rounded-full shadow-xl z-20">
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                {coreStatus === "ACTIVE" ? "BRAIN ONLINE" : coreStatus === "DIAGNOSING" ? "DIAGNOSING..." : "BRAIN SLEEP"}
              </span>
            </div>
          </div>

          {/* Quick core control switches */}
          <div className="w-full flex items-center justify-center gap-4 mt-8 z-10">
            <button
              onClick={handleToggleCoreState}
              disabled={isDiagnosticRunning}
              className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold transition-all duration-300 cursor-pointer ${
                coreStatus === "ACTIVE"
                  ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
              } disabled:opacity-40`}
            >
              {coreStatus === "ACTIVE" ? "STANDBY SLEEP" : "WAKE UP CORE"}
            </button>

            <button
              onClick={runDiagnostic}
              disabled={isDiagnosticRunning}
              className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 rounded-xl text-xs font-mono font-bold transition-all duration-300 cursor-pointer disabled:opacity-40"
            >
              RUN CORE DIAGNOSTIC
            </button>
          </div>
        </div>

        {/* Real-Time Live Brain Status & Identity (Right Column) */}
        <div className="lg:col-span-7 flex flex-col space-y-6" id="core-interactive-telemetry">
          {/* A. Dynamic System Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="text-[9px] font-mono font-bold uppercase">Processor</span>
              </div>
              <div>
                <p className="text-xl font-mono font-bold text-slate-100">{activeBrainNodeCount}</p>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">Active Brain Threads</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span className="text-[9px] font-mono font-bold uppercase">RAM Cache</span>
              </div>
              <div>
                <p className="text-xl font-mono font-bold text-slate-100">{memoryCapacity} GB</p>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">Memory Node Capacity</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <Thermometer className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="text-[9px] font-mono font-bold uppercase">Temp</span>
              </div>
              <div>
                <p className="text-xl font-mono font-bold text-slate-100">38.4°C</p>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">Core Temperature</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span className="text-[9px] font-mono font-bold uppercase">Languages</span>
              </div>
              <div>
                <p className="text-xl font-mono font-bold text-slate-100">3 Core</p>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">Bengali, EN, Hindi</p>
              </div>
            </div>
          </div>

          {/* B. Live Assistant Configuration Status Summary */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex-1" id="identity-status-card">
            <h3 className="font-sans font-bold text-base text-slate-100 mb-4 flex items-center gap-2 border-b border-slate-850 pb-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Active System Persona Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase font-mono block">Assistant Name</span>
                <span className="font-semibold text-slate-200">{config.assistantName || "J.A.R.V.I.S."}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase font-mono block">Addressing You As</span>
                <span className="font-semibold text-slate-200">
                  {config.userTitle || "Sir"} {config.userName || "Parker"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase font-mono block">Communication Style</span>
                <span className="font-semibold text-slate-200 capitalize">{config.toneStyle || "Humorous & Sarcastic"}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase font-mono block">Core Focus Target</span>
                <span className="font-semibold text-cyan-400">Realme & Redmi Turbo 3 China ROM</span>
              </div>
            </div>

            {/* Quick launcher section to simulator */}
            <div className="mt-8 pt-5 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-300 font-bold">Ready to interact with J.A.R.V.I.S. voice simulator?</p>
                <p className="text-[11px] text-slate-500 mt-1">Speak or type multilingual commands and get beautifully formatted replies.</p>
              </div>
              <button
                onClick={() => onNavigate("terminal")}
                className="w-full sm:w-auto px-5 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 rounded-xl font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer box-glow-cyan"
              >
                <Play className="w-4 h-4 animate-pulse" />
                Launch Simulator
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC SYSTEM DIAGNOSTIC PRONTO (Only shows when diagnosing) */}
      <AnimatePresence>
        {isDiagnosticRunning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-black/80 border border-cyan-500/30 rounded-3xl p-6 font-mono text-xs text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.15)] relative"
            id="system-diagnostic-console"
          >
            <div className="absolute top-4 right-6 flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400">PROGRESS: {diagnosticProgress}%</span>
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{ width: `${diagnosticProgress}%` }}
                />
              </div>
            </div>

            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2 select-none">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              SYSTEM DIAGNOSTICS & THREAD SYNCHRONIZATION
            </h4>

            <div className="space-y-1.5 h-36 overflow-y-auto mt-2 select-text">
              {diagnosticLogs.map((log, index) => (
                <p key={index} className="leading-relaxed font-mono">
                  {log}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. CAPABILITIES SHOWCASE */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl" id="capabilities-showcase">
        <h3 className="font-sans font-bold text-lg text-slate-100 mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          Active Core Capabilities & Services
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: "🗣️ Multilingual Voice Engine",
              desc: "Talk seamlessly in Bengali, English, and Hindi. Jarvis understands native vocal accents, processes continuous state contexts, and replies with beautiful local warmth.",
              target: "terminal" as const,
              btnText: "Talk to Jarvis",
            },
            {
              title: "✍️ Smart Cross-App Auto-Write",
              desc: "Let Jarvis draft beautiful wishing, work, or casual texts with high-tech structure, then click single-tap copy to instantly send via WhatsApp, Messenger, or standard SMS on your mobile.",
              target: "guide" as const,
              btnText: "Read Setup Guide",
            },
            {
              title: "⚙️ China ROM Optimization",
              desc: "Specialized diagnostics and guide setup mapping for Realme UI & Xiaomi HyperOS to bypass aggressive deep standby, autostart blockades, and keep your custom Jarvis companion active.",
              target: "guide" as const,
              btnText: "Configure ROM",
            },
            {
              title: "🏠 Smart IoT Integration",
              desc: "Simulate and control active home systems including living room lighting modes, dimmers, AC temperatures, smart surveillance camera feeds, and automated routines.",
              target: "terminal" as const,
              btnText: "Simulate Controls",
            },
            {
              title: "🛡️ High-Tech Security Core",
              desc: "Simulate real security camera facial recognition, lock up secure entry points, sound custom alarms, and trigger the emergency alert protocols instantaneously.",
              target: "terminal" as const,
              btnText: "Test Security",
            },
            {
              title: "🧠 Custom Memory Adaptation",
              desc: "Fine-tune and store J.A.R.V.I.S.'s personality guidelines, your custom name, preferred tone style, response length, and custom extra directives in his local memory storage.",
              target: "customizer" as const,
              btnText: "Tweak Personality",
            },
          ].map((cap, idx) => (
            <div
              key={idx}
              className="bg-slate-950/40 border border-slate-850 hover:border-slate-800 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300"
            >
              <div>
                <h4 className="font-sans font-bold text-sm text-slate-100 mb-2">{cap.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{cap.desc}</p>
              </div>
              <button
                onClick={() => onNavigate(cap.target)}
                className="w-full py-2 bg-slate-900 border border-slate-850 hover:border-cyan-500/30 text-[11px] font-mono font-bold text-slate-400 hover:text-cyan-400 rounded-xl transition-all duration-300 cursor-pointer text-center"
              >
                {cap.btnText} →
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
