# BridgeID

**BridgeID** is a progressive identity and trust platform designed for people excluded from formal systems because they lack complete paperwork. It provides undocumented or under-documented individuals with a safe, practical, and highly usable digital presence to access jobs, aid, and support services.

*Minutes, not months: Establishing field-ready trust without waiting for government bureaucracy.*

---

## 🌍 The Mission

Over a billion people do not have formal government identity. Without it, they cannot open bank accounts, secure formal employment, or access humanitarian aid efficiently. **BridgeID** is not a replacement for government identity—it's an immediate bridging layer. We prioritize the speed of onboarding, functional usability, and decentralized trust generation so people can instantly become visible in a dignified way.

## 🚀 Key Features

* **Instant Profile Generation:** Create field-ready profiles capturing skills, needs, aliases, and locations in less than two minutes.
* **Dynamic ID Cards (Offline Ready):** Automatically produce high-resolution, printable `BridgeID` `.png` cards rendering the user's biometric photo, skills, trust verification labels, and a cryptographically verifiable QR code via HTML5 Canvas.
* **Consensus Trust Engine:** Replaces absolute document checks with an explainable algorithm (0–100 scale). It combines:
  * NGO Verifications (+50)
  * Local Community Confirmations (+30)
  * Network Engagements (+20)
* **AI-Powered Triage (Gemini):** Silent and automated triage processing. Unstructured descriptions are parsed by AI to categorize need types and flag case urgency (High/Medium/Low).
* **Public Discovery Directory:** A secure, structured interface where logged-in actors, NGOs, and employers can view profiles, endorse candidates directly, and evaluate local trust networks.

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router) + React
* **Styling:** Tailwind CSS + Framer Motion (for fluid modal expansion and micro-interactions)
* **Identity Rendering:** Client-side HTML5 Canvas API + `qrcode` package enabling zero-telemetry offline ID exports.
* **AI Logic Model:** Google Gemini (for NLP need/urgency classification operations)

## 📌 UN SDG Alignment

BridgeID directly addresses crucial United Nations Sustainable Development Goals:
- **SDG 1 (No Poverty):** Reducing systemic exclusion from resource-sharing platforms.
- **SDG 8 (Decent Work):** Validating manual/trade skills to increase localized informal sector employability.
- **SDG 10 (Reduced Inequalities):** Closing the digital divide for completely undocumented families.
- **SDG 16 (Peace, Justice & Strong Institutions):** Producing transparent, fraud-resistant transaction trails inside communities.

---

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed along with `pnpm`.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/bridgeid.git
   cd bridgeid
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up your environment variables:**
   Create a `.env.local` file in the root structure to define your DB access constraints and AI API tokens:
   ```env
   # API Keys
   GEMINI_API_KEY=your_gemini_api_key_here
   # Add necessary database, auth or additional strings
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Open the App:** Navigate to [http://localhost:3000](http://localhost:3000)

## 🔮 Future Roadmap

* **Trust Breakdown UI Visualization:** Allow deep clicks on a trust score to open a fully audited mathematical history of every node touchpoint supporting the candidate.
* **Encrypted Biometrics:** Expand the photo payload to implement hash protections preventing duplicate onboarding spam.
* **Decentralized NGO Keys:** Support signature checking between authenticated organizational clusters.

---
*BridgeID - Building human-centric trust on the edge.*
