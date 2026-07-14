import React, { useState } from "react";
import { Clipboard, Check, Download, FileText, Settings, Sparkles, Sliders } from "lucide-react";
import { generateSystemPrompt, TONE_OPTIONS, RESPONSE_LENGTH_OPTIONS, VOICE_OPTIONS } from "../data";
import { JarvisConfig } from "../types";

interface PromptCustomizerProps {
  config: JarvisConfig;
  onChange: (config: JarvisConfig) => void;
}

export default function PromptCustomizer({ config, onChange }: PromptCustomizerProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");

  const systemPrompt = generateSystemPrompt(config);

  const handleFieldChange = (key: keyof JarvisConfig, value: any) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(systemPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const downloadPromptMd = () => {
    const blob = new Blob([systemPrompt], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jarvis_system_prompt.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadChatboxProfile = () => {
    const chatboxProfile = {
      name: config.assistantName || "Jarvis",
      avatar: "🤖",
      apiProvider: "openai", // fallback standard
      model: "gpt-4o",
      systemPrompt: systemPrompt,
      temperature: 0.7,
      maxTokens: 2000,
      presencePenalty: 0,
      frequencyPenalty: 0,
    };

    const blob = new Blob([JSON.stringify(chatboxProfile, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.assistantName || "Jarvis"}_Chatbox_Profile.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 text-gray-200" id="prompt-customizer-container">
      {/* Parameter Controls Panel */}
      <div className="xl:col-span-5 space-y-6">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl" id="customizer-controls-card">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="font-sans font-bold text-lg text-slate-100">Jarvis Persona Customizer</h3>
          </div>

          <div className="space-y-4">
            {/* Assistant Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Assistant Name
              </label>
              <input
                type="text"
                value={config.assistantName}
                onChange={(e) => handleFieldChange("assistantName", e.target.value)}
                placeholder="Jarvis"
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* User Title & Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Your Title
                </label>
                <input
                  type="text"
                  value={config.userTitle}
                  onChange={(e) => handleFieldChange("userTitle", e.target.value)}
                  placeholder="Sir"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={config.userName}
                  onChange={(e) => handleFieldChange("userName", e.target.value)}
                  placeholder="Parker"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Vocal Cadence Style */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Speech Cadence & Tone
              </label>
              <select
                value={config.toneStyle}
                onChange={(e) => handleFieldChange("toneStyle", e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none"
              >
                {TONE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Response Length Preferences */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Response Strategy
              </label>
              <div className="grid grid-cols-3 gap-2">
                {RESPONSE_LENGTH_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleFieldChange("responseLength", opt.value)}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                      config.responseLength === opt.value
                        ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400"
                        : "bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Synthesis Engine Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Gemini Voice Selection (AI TTS)
              </label>
              <div className="space-y-1.5">
                {VOICE_OPTIONS.map((v) => (
                  <div
                    key={v.value}
                    onClick={() => handleFieldChange("preferredVoice", v.value)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      config.preferredVoice === v.value
                        ? "bg-cyan-500/5 border-cyan-500/30"
                        : "bg-slate-950/20 border-transparent hover:bg-slate-950/40"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={config.preferredVoice === v.value}
                      onChange={() => handleFieldChange("preferredVoice", v.value)}
                      className="mt-1 border-slate-800 text-cyan-500 focus:ring-cyan-500"
                    />
                    <div className="select-none">
                      <p className="text-xs font-medium text-slate-200">{v.label}</p>
                      <p className="text-[10px] text-slate-500">{v.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Extra Prompt Directives */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Extra System Directives</span>
                <span className="text-[10px] lowercase text-slate-500 italic">one action per line</span>
              </label>
              <textarea
                value={config.customInstructions}
                onChange={(e) => handleFieldChange("customInstructions", e.target.value)}
                placeholder="e.g. Include local temperature status in briefings&#10;Speak with an occasional dry chuckle"
                rows={3}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none font-mono resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Compiled Markdown Prompt Preview & Download */}
      <div className="xl:col-span-7 space-y-6">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col h-full" id="compiled-prompt-preview-card">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h3 className="font-sans font-bold text-lg text-slate-100">Compiled System Prompt</h3>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-850">
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === "preview" ? "bg-slate-800 text-slate-100" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Render Preview
              </button>
              <button
                onClick={() => setActiveTab("edit")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === "edit" ? "bg-slate-800 text-slate-100" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Raw Markdown
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[460px] bg-slate-950/60 rounded-2xl border border-slate-850 p-5 md:p-6 mb-6" id="prompt-content-view">
            {activeTab === "preview" ? (
              <div className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed space-y-4">
                {systemPrompt.split("\n\n").map((para, index) => {
                  if (para.startsWith("# ")) {
                    return (
                      <h1 key={index} className="font-sans font-bold text-2xl text-slate-50 border-b border-slate-800 pb-2 mb-4">
                        {para.replace("#", "").trim()}
                      </h1>
                    );
                  }
                  if (para.startsWith("## ")) {
                    return (
                      <h2 key={index} className="font-sans font-bold text-lg text-cyan-400 mt-6 mb-2">
                        {para.replace("##", "").trim()}
                      </h2>
                    );
                  }
                  if (para.startsWith("**") && para.includes("**:")) {
                    return (
                      <p key={index} className="text-sm">
                        <strong className="text-slate-100">{para.split(":")[0].replace(/\*\*/g, "")}:</strong>
                        <span>{para.substring(para.indexOf(":") + 1)}</span>
                      </p>
                    );
                  }
                  if (para.startsWith("-") || para.match(/^\d\./)) {
                    return (
                      <ul key={index} className="list-disc pl-5 text-sm space-y-1.5 my-3 text-slate-300">
                        {para.split("\n").map((line, idx) => (
                          <li key={idx} dangerouslySetInnerHTML={{
                            __html: line.replace(/^-\s*/, "").replace(/^\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          }} />
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={index} className="text-sm" dangerouslySetInnerHTML={{
                      __html: para
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/`(.*?)`/g, "<code class='bg-slate-900 border border-slate-800 px-1 py-0.5 rounded text-xs text-cyan-300 font-mono'>$1</code>")
                    }} />
                  );
                })}
              </div>
            ) : (
              <textarea
                readOnly
                value={systemPrompt}
                className="w-full h-[400px] bg-transparent text-xs text-slate-300 font-mono resize-none border-none focus:outline-none focus:ring-0 leading-relaxed"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={copyPromptToClipboard}
              className="bg-slate-850 hover:bg-slate-755 border border-slate-750 py-3 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              {copiedPrompt ? <Check className="w-4 h-4 text-emerald-400" /> : <Clipboard className="w-4 h-4" />}
              {copiedPrompt ? "Copied System Prompt!" : "Copy System Prompt"}
            </button>
            <button
              onClick={downloadPromptMd}
              className="bg-slate-850 hover:bg-slate-755 border border-slate-755 py-3 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              Download Markdown
            </button>
            <button
              onClick={downloadChatboxProfile}
              className="bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 py-3 rounded-xl text-xs font-bold text-cyan-400 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              Export Chatbox Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
