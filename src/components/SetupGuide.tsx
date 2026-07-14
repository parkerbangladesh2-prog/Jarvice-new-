import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle, AlertCircle, Cpu, Shield, Download, Clipboard, Check, Layers, PlayCircle } from "lucide-react";
import { CHINA_ROM_STEPS, generateTaskerProfileXml } from "../data";
import { JarvisConfig } from "../types";

interface SetupGuideProps {
  config: JarvisConfig;
}

export default function SetupGuide({ config }: SetupGuideProps) {
  const [selectedStep, setSelectedStep] = useState(CHINA_ROM_STEPS[0].id);
  const [filter, setFilter] = useState<string>("All");
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [taskerTrigger, setTaskerTrigger] = useState<string>("voice");
  const [copiedTaskerXml, setCopiedTaskerXml] = useState(false);
  const [systemWhitelistBrand, setSystemWhitelistBrand] = useState<"Xiaomi" | "Realme">("Xiaomi");

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jarvis_setup_progress");
      if (saved) {
        setCompletedSteps(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load progress:", e);
    }
  }, []);

  const toggleStepCompletion = (id: string) => {
    const updated = { ...completedSteps, [id]: !completedSteps[id] };
    setCompletedSteps(updated);
    try {
      localStorage.setItem("jarvis_setup_progress", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save progress:", e);
    }
  };

  const stepsList = CHINA_ROM_STEPS.filter(
    (step) => filter === "All" || step.category === filter
  );

  const activeStep = CHINA_ROM_STEPS.find((s) => s.id === selectedStep) || CHINA_ROM_STEPS[0];
  const taskerXml = generateTaskerProfileXml(config, taskerTrigger);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTaskerXml(true);
    setTimeout(() => setCopiedTaskerXml(false), 2000);
  };

  const downloadTaskerProfile = () => {
    const blob = new Blob([taskerXml], { type: "text/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.assistantName || "Jarvis"}_Tasker_Profile.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-gray-200" id="setup-guide-container">
      {/* Sidebar Controls */}
      <div className="lg:col-span-4 flex flex-col space-y-6">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5" id="category-filter-card">
          <h3 className="font-sans font-medium text-lg text-slate-100 mb-3 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Guide Categories
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {["All", "GMS", "Clients", "System", "Automation", "Netlify"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                  filter === cat
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    : "bg-slate-800/40 text-slate-400 border border-transparent hover:bg-slate-800/80 hover:text-slate-200"
                }`}
              >
                {cat === "GMS" ? "Google GMS" : cat === "System" ? "Battery Whitelist" : cat === "Clients" ? "LLM Clients" : cat === "Netlify" ? "Netlify Deploy" : cat}
              </button>
            ))}
          </div>

          <div className="space-y-2 mt-4 max-h-[350px] overflow-y-auto pr-1" id="step-selector-list">
            {stepsList.map((step) => {
              const isSelected = step.id === selectedStep;
              const isCompleted = !!completedSteps[step.id];
              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedStep(step.id)}
                  className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-slate-800/80 border-cyan-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                      : "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-slate-900/30"
                  }`}
                >
                  <div className="flex items-start gap-3 select-none">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStepCompletion(step.id);
                      }}
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                        isCompleted
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-400"
                          : "border-slate-700 text-transparent hover:border-slate-500"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                    </button>
                    <div>
                      <p className={`text-sm font-medium transition-colors ${isSelected ? "text-cyan-400" : "text-slate-200 group-hover:text-cyan-300"}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{step.subtitle}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {stepsList.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-6">No steps found in this category.</p>
            )}
          </div>
        </div>

        {/* Brand Whitelist Quick-Checker */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5" id="brand-whitelisting-card">
          <h3 className="font-sans font-medium text-lg text-slate-100 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Device-Specific Whitelist
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Select your brand for an immediate checklist to prevent Jarvis from being killed in the background:
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setSystemWhitelistBrand("Xiaomi")}
              className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                systemWhitelistBrand === "Xiaomi"
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-slate-800/30 border-transparent text-slate-400 hover:bg-slate-850"
              }`}
            >
              Xiaomi / Redmi
            </button>
            <button
              onClick={() => setSystemWhitelistBrand("Realme")}
              className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                systemWhitelistBrand === "Realme"
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-slate-800/30 border-transparent text-slate-400 hover:bg-slate-850"
              }`}
            >
              Realme UI (Oppo)
            </button>
          </div>

          <div className="space-y-3" id="whitelist-checklist">
            {systemWhitelistBrand === "Xiaomi" ? (
              <>
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input type="checkbox" className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500" />
                  <span>Set <strong>Gemini / Chatbox</strong> Battery Saver to <strong>No Restrictions</strong></span>
                </label>
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input type="checkbox" className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500" />
                  <span>Enable <strong>Autostart</strong> in Manage Apps settings</span>
                </label>
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input type="checkbox" className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500" />
                  <span>Lock App in Recents screen (Lock icon toggle)</span>
                </label>
              </>
            ) : (
              <>
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input type="checkbox" className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500" />
                  <span>Enable <strong>Auto-launch</strong> in App Management</span>
                </label>
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input type="checkbox" className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500" />
                  <span>Set <strong>Allow background activity</strong> under Battery Settings</span>
                </label>
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input type="checkbox" className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500" />
                  <span>Lock app in the recent memory task-list manager</span>
                </label>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl min-h-[400px]" id="step-content-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
            <div>
              <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {activeStep.category}
              </span>
              <h2 className="font-sans font-bold text-2xl text-slate-50 mt-2">
                {activeStep.title}
              </h2>
              <p className="text-slate-400 text-sm mt-1">{activeStep.subtitle}</p>
            </div>
            <button
              onClick={() => toggleStepCompletion(activeStep.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                completedSteps[activeStep.id]
                  ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {completedSteps[activeStep.id] ? "Completed!" : "Mark as Done"}
            </button>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed space-y-4">
            {activeStep.content.split("\n\n").map((para, index) => {
              if (para.startsWith("###")) {
                return (
                  <h3 key={index} className="font-sans font-bold text-lg text-slate-100 mt-6 mb-2">
                    {para.replace("###", "").trim()}
                  </h3>
                );
              }
              if (para.startsWith("##")) {
                return (
                  <h2 key={index} className="font-sans font-bold text-xl text-slate-50 mt-8 mb-3 border-b border-slate-800/50 pb-1">
                    {para.replace("##", "").trim()}
                  </h2>
                );
              }
              if (para.startsWith("-") || para.match(/^\d\./)) {
                return (
                  <div key={index} className="pl-4 border-l-2 border-slate-800 py-1 space-y-1.5 my-3 bg-slate-950/20 rounded-r-lg pr-3">
                    {para.split("\n").map((line, idx) => {
                      const isBullet = line.trim().startsWith("-");
                      const isNumber = line.trim().match(/^\d\./);
                      const cleanedLine = line.replace(/^-\s*/, "").replace(/^\d\.\s*/, "").trim();
                      return (
                        <div key={idx} className="flex gap-2.5 items-start text-sm">
                          <span className="text-cyan-400 font-bold mt-0.5 select-none">{isBullet ? "•" : isNumber ? `${idx + 1}.` : ""}</span>
                          <span dangerouslySetInnerHTML={{
                            __html: cleanedLine
                              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                              .replace(/\*(.*?)\*/g, "<em>$1</em>")
                              .replace(/`(.*?)`/g, "<code class='bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-xs text-cyan-300'>$1</code>")
                          }} />
                        </div>
                      );
                    })}
                  </div>
                );
              }
              return (
                <p key={index} dangerouslySetInnerHTML={{
                  __html: para
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>")
                    .replace(/`(.*?)`/g, "<code class='bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-xs text-cyan-300'>$1</code>")
                }} />
              );
            })}
          </div>
        </div>

        {/* Tasker Automation Profile Generator (Triggered in Tab 5 or displayed as an advanced companion widget) */}
        {activeStep.id === "automation-triggers" && (
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl mt-6" id="tasker-generator-box">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-7 h-7 text-cyan-400" />
              <div>
                <h3 className="font-sans font-bold text-lg text-slate-100">Tasker Profile Generator</h3>
                <p className="text-xs text-slate-400">Generate a custom XML profile for Tasker to link physical gestures to {config.assistantName || "Jarvis"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Trigger Gesture</label>
                <select
                  value={taskerTrigger}
                  onChange={(e) => setTaskerTrigger(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value="voice">Voice Hotword ("Hey {config.assistantName || "Jarvis"}")</option>
                  <option value="back_tap">Double Tap Device Back</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={() => copyToClipboard(taskerXml)}
                  className="flex-1 bg-slate-800 hover:bg-slate-755 border border-slate-700 py-2.5 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {copiedTaskerXml ? <Check className="w-4 h-4 text-emerald-400" /> : <Clipboard className="w-4 h-4" />}
                  {copiedTaskerXml ? "Copied to Clipboard!" : "Copy XML Code"}
                </button>
                <button
                  onClick={downloadTaskerProfile}
                  className="flex-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 py-2.5 rounded-xl text-xs font-semibold text-cyan-400 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download XML File
                </button>
              </div>
            </div>

            <div className="relative">
              <pre className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl text-xs text-slate-300 font-mono overflow-x-auto max-h-[160px]">
                {taskerXml}
              </pre>
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none rounded-b-xl" />
            </div>

            <div className="flex items-start gap-2.5 mt-4 text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="font-semibold">How to Import:</strong> Save the XML file to your device. Open Tasker, long-press on "Profiles" tab at the top, select "Import Profile", and navigate to this downloaded XML file. Ensure you have the <strong>AutoVoice</strong> plugin installed for voice triggers.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
