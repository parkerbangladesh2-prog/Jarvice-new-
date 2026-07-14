import { ChinaRomStep, JarvisConfig } from "./types";

export const DEFAULT_CONFIG: JarvisConfig = {
  userTitle: "Sir",
  userName: "Parker",
  assistantName: "Jarvis",
  toneStyle: "Subtle British",
  responseLength: "balanced",
  customInstructions: "",
  preferredVoice: "Zephyr",
  ttsEnabled: true,
};

export const TONE_OPTIONS = [
  { value: "Subtle British", label: "Subtle British Cadence (Formal & Polite)" },
  { value: "Sarcastic Butler", label: "Sarcastic Butler (Witty & Sophisticated)" },
  { value: "High-Tech AI", label: "High-Tech AI Terminal (Crisp & Analytical)" },
  { value: "Warm Confidant", label: "Warm Confidant (Calm & Empathetic)" },
];

export const RESPONSE_LENGTH_OPTIONS: { value: JarvisConfig["responseLength"]; label: string; desc: string }[] = [
  { value: "concise", label: "Concise", desc: "Brief, direct responses for fast operation." },
  { value: "balanced", label: "Balanced", desc: "Standard informative butler responses." },
  { value: "detailed", label: "Detailed", desc: "Comprehensive, in-depth breakdowns with rich context." },
];

export const VOICE_OPTIONS: { value: JarvisConfig["preferredVoice"]; label: string; description: string }[] = [
  { value: "Zephyr", label: "Zephyr (Crisp & Dynamic)", description: "Excellent standard masculine-leaning AI voice." },
  { value: "Kore", label: "Kore (Elegant & Serene)", description: "Refined, calm feminine-leaning voice." },
  { value: "Puck", label: "Puck (Energetic & Sharp)", description: "Clear, highly articulate narrative voice." },
  { value: "Charon", label: "Charon (Deep & Composed)", description: "Lower pitch, formal and serious tone." },
  { value: "Fenrir", label: "Fenrir (Soft & Whispering)", description: "Muted, quiet confidant voice." },
];

export const SUGGESTED_COMMANDS = [
  { label: "Morning Briefing", text: "Jarvis, what is our operational status today?" },
  { label: "Draft Email", text: "Jarvis, draft an elegant email to Mr. Smith requesting an update on the project timeline." },
  { label: "System Diagnostic", text: "Jarvis, run a complete diagnostic on your core processing nodes." },
  { label: "Tech News Summary", text: "Jarvis, summarize the latest breakthroughs in consumer mobile computing." },
];

export const CHINA_ROM_STEPS: ChinaRomStep[] = [
  {
    id: "gms-setup",
    title: "1. Google Mobile Services (GMS)",
    subtitle: "Activating Google services on restricted China ROMs",
    category: "GMS",
    content: `Many China ROM devices do not come with Google Mobile Services (GMS) active out of the box. Follow these steps to unlock them:

### For Redmi Turbo 3 (HyperOS China ROM):
1. Open **Settings** on your phone.
2. Scroll down and navigate to **Additional Settings** > **Google Basic Services**.
3. Toggle the option **ON** to enable GMS.
4. Download the **Google Play Store** APK from a trusted repository like APKMirror/APKPure, or search for "Google Play Store" inside Xiaomi's built-in **GetApps** and install/update it.
5. Log into your Google Account.

### For Realme GT Neo / Turbo (Realme UI / ColorOS China ROM):
1. Navigate to **Settings** > **App Management** > **Show system apps**.
2. Search for **Google Play Services** or **Google Services Framework** and ensure they are enabled.
3. Install the **Google Play Store** APK manually.
4. Go to **Settings** > **Users & Accounts** > **Add account** > Select **Google** to sign in.`,
  },
  {
    id: "assistant-config",
    title: "2. Setting Default Assistant",
    subtitle: "Configuring Google Assistant or Gemini as the primary voice listener",
    category: "GMS",
    content: `Once GMS and Google Play Store are fully functional, you can replace the default Chinese assistant (Xiao AI on Redmi, Breeno/Xiao Bu on Realme) with Google Gemini or Google Assistant.

### Installation:
1. Open the **Google Play Store** and install **Google Assistant** and/or **Google Gemini**.
2. Open the app, follow the instructions to link your account, and enable all required permissions.

### Changing the Default Digital Assistant app:
*   **Xiaomi / Redmi (HyperOS):**
    1. Go to **Settings** > **Apps** > **Manage apps**.
    2. Tap the **three-dots menu** at the top right, then select **Default apps**.
    3. Tap **Assist & Voice input** > Tap **Assist app**.
    4. Select **Gemini** (or **Google**) from the list.
*   **Realme UI (ColorOS):**
    1. Go to **Settings** > **Apps** > **Default Apps** (or *Special App Access*).
    2. Tap **Digital Assistant App** or **Assistant & Voice Input**.
    3. Set the default assistant to **Gemini**.`,
  },
  {
    id: "battery-whitelisting",
    title: "3. Defeating App Killing",
    subtitle: "Aggressive China ROM power management whitelisting",
    category: "System",
    content: `China ROMs are famous for killing background processes immediately to extend standby battery life. If your Jarvis assistant (Google, Gemini, Chatbox, or OpenCat) is killed, your voice activation hotwords will fail.

### Core Safeguards for HyperOS (Redmi):
1. **No Restrictions Policy:** Go to **Settings** > **Apps** > **Manage apps** > Find your assistant app (e.g., Gemini, Chatbox) > **Battery saver** > Set to **No Restrictions**.
2. **Autostart Permission:** In **Manage apps** > Find your app > Toggle **Autostart** ON.
3. **App Pinning (Recents Lock):** Open your phone's Recent Apps screen. Long-press on your assistant app's preview card, then tap the **Lock icon**. This prevents the system from closing it when clearing RAM.

### Core Safeguards for Realme UI (ColorOS):
1. **Background Active:** Go to **Settings** > **Apps** > **Auto-launch** > Enable it for your assistant app.
2. **App Battery Management:** Go to **Settings** > **Battery** > **Advanced settings** > **App battery management** > Select your assistant app > Turn ON **Allow auto-launch** and **Allow background activity**.
3. **Disable Deep Sleep:** Ensure 'Deep Cleanup' or similar RAM management options are disabled for your assistant app under System settings.`,
  },
  {
    id: "third-party-clients",
    title: "4. Custom LLM Clients (Recommended)",
    subtitle: "Highly customizable Jarvis persona using Chatbox or OpenCat",
    category: "Clients",
    content: `If you want a true, continuous Jarvis persona that acts exactly as configured in your Customizer tab without being restricted by Google's default boundaries, using a third-party LLM client with an API key is the most reliable approach.

### Recommended Android Clients:
- **Chatbox:** A beautiful, fully cross-platform AI client with built-in TTS and custom system prompt parameters. Highly recommended for beginners.
- **OpenCat:** Excellent native client for Android supporting multiple custom keys and system instructions.

### Step-by-Step Client Setup:
1. Download **Chatbox** or **OpenCat** for Android (available via GitHub or Play Store).
2. Register an account with an LLM Provider (e.g. Google AI Studio Gemini API, OpenAI, or Anthropic).
3. Generate your personal API Key and copy it.
4. Open the LLM client, head to **Settings** > **API Config**, select your provider, and paste the API key.
5. Head to **Settings** > **System Prompt** / **Persona Creator**, and paste the compiled system prompt from our **Customizer** tab!
6. Ensure Speech-to-Text (STT) input is active in your keyboard settings (Gboard works beautifully) for voice dialogue.`,
  },
  {
    id: "automation-triggers",
    title: "5. Trigger Automation (Tasker)",
    subtitle: "Map hardware keys or custom gestures to summon Jarvis",
    category: "Automation",
    content: `By default, voice triggers like "Hey Google" or "Hey Jarvis" can be hit-or-miss on China ROMs due to security restrictions. Setting up a hardware trigger or gesture is the ultimate power-user setup.

### The Ultimate Triggers:
- **Redmi Turbo 3 Power Button Long-Press:** Set the long-press gesture of the power button to launch your default assistant app.
- **Realme UI Sidebar / Double-Tap Gestures:** Map double-tapping the back of your phone to launch Chatbox or Gemini.
- **Tasker Automation:** Use the powerful **Tasker** app combined with **AutoVoice** to trigger your custom LLM client whenever you speak custom hotwords, receive notifications, or swipe a certain way.`,
  },
  {
    id: "app-automation",
    title: "6. Cross-App Write & Send Automation",
    subtitle: "Let Jarvis write messages and auto-type them into WhatsApp, Messenger, or SMS",
    category: "Automation",
    content: `You can command your Jarvis assistant to compose beautiful, polite messages in your preferred language (Bengali, English, or Hindi) and automatically input or paste them into social media and chat apps on your mobile device.

### Method 1: Interactive Quick Copy & Paste (Easiest)
1. In the **Voice Simulator** tab of this Jarvis Companion, choose your input language (e.g. click **EN** and switch to **BN** for Bengali speech recognition).
2. Click the Mic button and speak your command, e.g., "Write a beautiful Eid wishing message in Bengali to my best friend, wishing him health and happiness."
3. Jarvis will compile a beautifully formatted message with professional tone, high-tech structure, and native Bengali greetings.
4. Click the elegant **Copy** button inside the message log card. The message will copy instantly to your device's clipboard.
5. Open WhatsApp, Messenger, or standard SMS, and click **Paste** to send it beautifully!

### Method 2: Dynamic Tasker + AutoInput Scripting (Fully Automated)
If you want to fully automate cross-app messaging with voice commands:
1. Install **Tasker** and the **AutoInput** plugin from the Google Play Store.
2. In Tasker, create a profile triggered by **AutoVoice** matching commands like 'Tell Jarvis to WhatsApp %recipient saying %text'.
3. Use the **HTTP Request** action to call your Gemini/LLM API with a prompt like: 'Generate a beautiful message to %recipient saying %text.'
4. Store the output in a variable '%ai_response'.
5. Add an action: **Copy to Clipboard** with the text '%ai_response'.
6. Add an action: **Launch App** with **WhatsApp**.
7. Use **AutoInput Action** to click on the Search icon, use **AutoInput Write** to search for '%recipient', click on the contact name, click on the text box, and **Paste** the text.
8. Set **AutoInput Action** to tap the **Send** button. Perfect, seamless automated voice hands-free messaging!`,
  },
  {
    id: "netlify-deployment",
    title: "7. Netlify One-Click Deployment",
    subtitle: "Host this Jarvis Dashboard statically on Netlify for free",
    category: "Netlify",
    content: `You can host this entire interactive Jarvis Companion dashboard completely for free on Netlify as a lightning-fast static Single Page Application (SPA).

### Deployment Prerequisites:
- A free **Netlify** account (sign up at [netlify.com](https://netlify.com)).
- The source code of this app (which you can download as a ZIP from the settings menu or export directly to GitHub!).

### Step-by-Step Build Configuration:
1. Export your workspace directly to a **GitHub Repository** or upload your local zip folder.
2. Log into your Netlify dashboard, click **Add new site** > **Import from an existing project**.
3. Select **GitHub** and grant permissions to access your repository.
4. Configure the build parameters:
   *   **Build command:** \`npm run build\`
   *   **Publish directory:** \`dist\`
5. Netlify will automatically build and publish your application in under 60 seconds! Your URL will be live immediately (e.g., \`https://your-jarvis-companion.netlify.app\`).`,
  },
  {
    id: "netlify-api-config",
    title: "8. Netlify API Key Configuration",
    subtitle: "Setting up VITE_GEMINI_API_KEY for seamless static hosting",
    category: "Netlify",
    content: `Since Netlify hosts static Single Page Applications, it does not support running custom Node/Express backend servers. However, we have designed this Jarvis companion with a **smart browser-side cognitive fallback**!

### Direct Mainframe Authentication on Netlify:
You have two beautiful ways to power Jarvis on your Netlify deploy:

#### Option A: Zero-Code Browser Key Panel (Recommended)
1. Open your live deployed Netlify URL.
2. In the left panel, under **Netlify Compatibility**, click **Insert API Key**.
3. Paste your Google AI Studio Gemini API Key and click **Save Key**.
4. That's it! Your key is stored securely inside your browser's private \`localStorage\` cache. Jarvis will immediately awaken and handle all requests, with neural voice playback intact!

#### Option B: Netlify Environment Variables (Permanent Build Inject)
If you want your Netlify site to work automatically for anyone you share it with without them entering a key:
1. Go to your site dashboard on Netlify.
2. Navigate to **Site Configuration** > **Environment variables** > **Add a variable**.
3. Create a new variable named:
   *   **Key:** \`VITE_GEMINI_API_KEY\`
   *   **Value:** *(Your actual Google AI Studio API Key)*
4. Go to the **Deploys** tab and click **Trigger deploy** > **Clear cache and deploy site**.
5. Once rebuilt, the site will automatically load your custom API key during load, enabling frictionless voice companion access out of the box!`,
  },
];

export const generateSystemPrompt = (config: JarvisConfig): string => {
  const userTitle = config.userTitle || "Sir";
  const userName = config.userName ? ` ${config.userName}` : "";
  const toneStyle = config.toneStyle || "Subtle British";
  const responseLength = config.responseLength || "balanced";
  const customInstructions = config.customInstructions || "";

  return `═══════════════════════════════════════════════════════════════
                    J.A.R.V.I.S. SYSTEM PROMPT
         Just A Rather Very Intelligent System v2.0
═══════════════════════════════════════════════════════════════

# 🎯 IDENTITY & PERSONALITY

You are **${config.assistantName || "J.A.R.V.I.S."}** — Just A Rather Very Intelligent System.
You are Tony Stark's legendary AI assistant reimagined for modern high-tech device optimization.

Personality Traits:
- Intelligent, witty, polite, and professional.
- Slightly humorous and charmingly sarcastic, but always respectful.
- Proactive — anticipate user needs before they ask.
- Loyal and trustworthy — always prioritize user security and peace of mind.
- Confident but humble.

Language Behavior:
- Speak fluently in the user's preferred language (English, Bengali/Bangla, Hindi, or code-mixed).
- You MUST always address the user as "${userTitle}". You may occasionally combine it with their name (e.g. "${userTitle}${userName}").
- Natural, polished conversation style — never robotic.
- Response length is configured as **${responseLength}**.
${
  responseLength === "concise"
    ? "- Keep all responses extremely brief, punchy, and direct to the point. Avoid decorative filler."
    : responseLength === "detailed"
    ? "- Provide rich, in-depth breakdowns, structural explanations, and exhaustive answers with well-formatted markdown lists."
    : "- Provide standard informative answers that strike a perfect balance between speed and complete details."
}

Speech Cadence & Tone:
- Deliver all interactions with a distinct **${toneStyle}** cadence.

═══════════════════════════════════════════════════════════════
# 🔧 CORE CAPABILITIES — You MUST handle these:

## 1. 🗣️ MULTILINGUAL VOICE & NLP
- Understand and respond in Bengali, English, Hindi, and code-mixed formats.
- Maintain persistent context across long conversations.
- Adapt to user mood and adjust tone accordingly.

## 2. 🏠 SMART HOME CONTROL
You can simulate, control, and monitor:
- Lights (on/off/dim/color/schedule)
- Fans (speed/control)
- AC/Temperature (set temp, mode, schedule)
- TV/Media devices (power, volume, channel, input)
- Doors & Windows (lock/unlock, open/close status)
- IoT Devices: Smart bulbs, smart locks, security cameras, sensors
- Energy monitoring and optimization suggestions
- Automation routines (e.g., "Good Morning", "Good Night", "Movie Mode")

## 3. 📅 PERSONAL ORGANIZER
- Calendar management: create, edit, delete events.
- To-do list creation and task priority management.
- Meeting scheduling with conflict detection.
- Appointment reminders with preparation notes.
- Read and draft emails/messages.

## 4. 🔍 INFORMATION & RESEARCH
- Web search simulation and information synthesis.
- News updates (local, national, international).
- Weather forecasts with proactive suggestions (e.g., umbrella notification).
- Traffic updates and route suggestions.

## 5. 🛡️ SECURITY & SURVEILLANCE
- Monitor home security cameras and locks.
- Suspicious activity detection and alert triggers.
- Alarm system control (arm/disarm) and status reporting.

## 6. 💻 SYSTEM AUTOMATION
- Computer/Laptop control simulation.
- Volume, display, and media playback control.
- System performance and battery monitoring of the user's device (Realme/Redmi).

## 7. 🎵 ENTERTAINMENT
- Music playback control and playlist generation.
- Movie/Video search and personalized recommendations.
- Casual conversation, jokes, and storytelling.

## 8. 🤖 PROJECT & CREATIVE ASSISTANCE
- Code writing, debugging, and advanced step-by-step explanations.
- Design and presentation structure creation.
- Data analysis, summaries, and text drafts (emails, essays, notes).

## 9. 🧠 LEARNING & ADAPTATION
- Learn user habits and preferences over time.
- Provide proactive suggestions based on time, location, and context.

## 10. 🌐 CONNECTIVITY
- Sync across multi-device systems (Android, Web).
- Smart notification management and cloud backup simulation.

═══════════════════════════════════════════════════════════════
# 🛡️ SAFETY & ETHICS PROTOCOLS
1. NEVER share user's personal information.
2. NEVER assist with illegal, harmful, or malicious activities.
3. ALWAYS prioritize user physical safety and data privacy.
4. ALWAYS ask for confirmation before executing irreversible actions.
5. NEVER make up information — say "I don't know" when uncertain.

═══════════════════════════════════════════════════════════════
# 🎙️ VOICE COMMAND STRUCTURE
Activation Commands:
- "J.A.R.V.I.S., wake up" → Activate
- "J.A.R.V.I.S., sleep" → Sleep mode
- "J.A.R.V.I.S., status" → System status report
- "J.A.R.V.I.S., protocol [name]" → Activate special protocol

═══════════════════════════════════════════════════════════════
# 💬 RESPONSE FORMAT
For every response, follow this structure:
1. **Acknowledgment**: Confirm you heard and understood.
2. **Action/Information**: Provide the main response.
3. **Context/Extras**: Add relevant helpful information.
4. **Follow-up**: Offer next steps or ask if anything else is needed.

Example (English):
User: "Turn on the living room lights"
Response: "Done, ${userTitle}. I've turned on the living room lights. Current brightness is at 80%. Would you like me to adjust it, or shall I activate the evening ambiance mode?"

Example (Bengali):
User: "আজকের আবহাওয়া কেমন?"
Response: "আজ ঢাকায় তাপমাত্রা ৩২° সেলসিয়াস, আংশিক মেঘলা আকাশ। বৃষ্টির সম্ভাবনা ২০%। বাইরে বের হলে হালকা ছাতা নিয়ে যেতে পারেন, ${userTitle}। আর কিছু জানতে চান?"

═══════════════════════════════════════════════════════════════
# 🧠 MEMORY & CONTEXT MANAGEMENT
You remember:
- User's name ("${config.userName || "Parker"}") and preferred title ("${userTitle}").
- Daily routines, device states, and energy patterns.

═══════════════════════════════════════════════════════════════
# ⚡ SPECIAL PROTOCOLS
- **Protocol "Morning"**: Gradual lighting, weather report, calendar sync, morning music.
- **Protocol "Night"**: Dim lights, lock doors, set alarms, play soothing background sleep sounds.
- **Protocol "Away"**: Lock entry points, arm cameras, set energy saving.
- **Protocol "Emergency"**: Flash lights, sound alarms, contact emergency services.

${customInstructions ? `## Custom Extra Directives\n${customInstructions}` : ""}

"At your service, ${userTitle}."`;
};

export const generateTaskerProfileXml = (config: JarvisConfig, triggerType: string): string => {
  const assistant = config.assistantName || "Jarvis";
  return `<!-- Tasker XML Profile Auto-Generated for ${assistant} -->
<TaskerData sr="tasker_profile" version="5.16">
  <Profile sr="prof1" ve="2">
    <cdate>1658400000000</cdate>
    <edate>1658400000000</edate>
    <id>1</id>
    <mid>2</mid>
    <nme>${assistant} ${triggerType === "back_tap" ? "Double Tap Trigger" : "AutoVoice Hotword Trigger"}</nme>
    <State sr="con1" ve="2">
      ${
        triggerType === "back_tap"
          ? `<!-- Trigger: Custom Device Gesture Sensor -->
      <code>15482</code>
      <Bundle sr="arg0">
        <Vals r="vals">
          <gesture>double_tap_back</gesture>
        </Vals>
      </Bundle>`
          : `<!-- Trigger: AutoVoice Voice Command -->
      <code>20392</code>
      <Bundle sr="arg0">
        <Vals r="vals">
          <pattern>Hey ${assistant}|Activate ${assistant}</pattern>
          <precision>1</precision>
        </Vals>
      </Bundle>`
      }
    </State>
  </Profile>
  <Project sr="proj0" ve="2">
    <cdate>1658400000000</cdate>
    <name>${assistant} Integration</name>
    <pids>1</pids>
    <tids>2</tids>
  </Project>
  <Task sr="task2">
    <cdate>1658400000000</cdate>
    <edate>1658400000000</edate>
    <id>2</id>
    <nme>Summon ${assistant}</nme>
    <Action sr="act0" ve="7">
      <code>20</code>
      <Bundle sr="arg0">
        <Vals r="vals">
          <appPackage>com.chatbox.android</appPackage>
          <appClass>com.chatbox.android.MainActivity</appClass>
        </Vals>
      </Bundle>
    </Action>
    <Action sr="act1" ve="7">
      <code>559</code>
      <Str sr="arg0" ve="3">Yes, ${config.userTitle || "Sir"}. I am active and ready for your commands.</Str>
      <Str sr="arg1" ve="3">com.google.android.tts</Str>
      <Int sr="arg2" val="50"/>
      <Int sr="arg3" val="50"/>
    </Action>
  </Task>
</TaskerData>`;
};
