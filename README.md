# 🌿 OutsideIn — Local AI-Powered Micro-Adventures

**Less screen time. More real-world discovery.**

OutsideIn is an open-source, AI-powered micro-adventure generator that encourages people to step away from their screens and reconnect with the world around them. It uses a locally running Gemma model to generate personalized outdoor activities based on available time, interests, surroundings, and preferred activity level.

Built for **Hacktoberfest 2026 — Week 1: Touch Grass**.

[![Built with React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Built with Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Backend: Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![AI: Gemma](https://img.shields.io/badge/AI-Gemma%203-4285F4)](https://ai.google.dev/gemma)
[![Inference: Ollama](https://img.shields.io/badge/Inference-Ollama-black)](https://ollama.com/)

---

## 📖 Table of Contents

- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [Features](#-features)
- [Demo](#-demo)
- [How It Works](#-how-it-works)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Privacy and Safety](#-privacy-and-safety)
- [Limitations](#-limitations)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [Why Open Innovation Matters](#-why-open-innovation-matters)
- [Acknowledgements](#-acknowledgements)
- [License](#-license)

## 🌍 The Problem

Our digital lives make it easy to spend hours looking at screens without intentionally engaging with the physical world.

Even when people want a break, deciding what to do can become another reason to reach for a phone. Generic wellness advice rarely provides a concrete, achievable next step.

**What if taking a break were as easy as generating a small adventure?**

OutsideIn addresses this by turning a few minutes of free time into a simple, personalized activity that encourages observation, exploration, and mindfulness.

## 💡 Our Solution

OutsideIn generates practical micro-adventures tailored to a user's preferences.

Instead of recommending another app to scroll through, it provides an activity that can be carried out in the real world.

For example, a user with 15 minutes available who enjoys observing nature might receive a mission to notice the shapes, textures, and movement of leaves in a nearby green space.

Each generated mission includes:

- **A title and introduction** that make the activity inviting.
- **Step-by-step instructions** that turn the idea into an actionable plan.
- **An observation goal** that encourages curiosity about the surroundings.
- **A reflection question** to answer after the activity.
- **A safety reminder** relevant to the suggested activity.

The goal is not to maximize app engagement. It is to help users find something worthwhile to do away from their screens.

## ✨ Features

### 🧠 Local AI Mission Generation

Uses Gemma 3 through Ollama to generate personalized outdoor activities on the user's machine, rather than relying on a paid hosted LLM API.

### ⏱️ Flexible Time Options

Choose from 10, 15, 20, 30, 45, or 60 minutes to fit an adventure into an available break.

### 🍃 Interest-Based Activities

Choose from interests such as:

- Nature observation
- Walking and exploration
- Photography
- Mindful breaks
- Birds and wildlife

### 📍 Setting-Aware Suggestions

Select a park, neighborhood, backyard, or a window-side setting to guide mission generation.

### 🚶 Adjustable Activity Level

Choose an easygoing or moderately active experience.

### 📓 Reflection and Local History

Record a short reflection and save completed adventures in the browser using `localStorage`.

### 📊 Progress Overview

View the number of completed adventures, accumulated planned minutes, and recent activity history.

### 🔒 Privacy-Conscious Design

Mission generation runs against a local Ollama instance. Adventure history stays in browser storage, and the application does not require a user account or cloud database.

## 🖥️ Demo

**Live repository:** [github.com/dhruv-dagar/OutsideIn](https://github.com/dhruv-dagar/OutsideIn)

Add your screenshots and demo recording here as they become available.

Suggested screenshots:

1. `docs/screenshots/dashboard.png` — Main dashboard and preference selector.
2. `docs/screenshots/mission.png` — Generated mission and observation goal.
3. `docs/screenshots/history.png` — Saved adventures and progress overview.

Once these files are committed, embed them with:

```markdown
![OutsideIn dashboard](docs/screenshots/dashboard.png)
![Generated adventure](docs/screenshots/mission.png)
![Adventure history](docs/screenshots/history.png)
```

## ⚙️ How It Works

OutsideIn combines a React frontend, an Express API, and a locally running language model.

```text
┌───────────────────────────────┐
│        React Frontend         │
│                               │
│ Time · Interest · Setting     │
│ Difficulty · Reflection       │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       Express Backend         │
│          Port 3001            │
│                               │
│ Validate preferences          │
│ Construct model prompt        │
│ Validate generated response   │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        Ollama Runtime         │
│      Local Gemma 3:1b         │
│          Port 11434           │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       Structured Mission      │
│                               │
│ Title · Description · Steps   │
│ Observation · Reflection      │
│ Safety Reminder               │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       React Mission Card      │
│   Completion · Local History  │
└───────────────────────────────┘
```

### Mission Generation Flow

1. The user selects their preferences in the browser.
2. React sends a JSON request to the Express backend.
3. The backend validates the requested options.
4. The backend sends a prompt to the locally running Gemma model through Ollama.
5. Ollama returns a structured JSON response.
6. The backend validates the mission fields before returning the result.
7. React displays the mission and allows the user to record a reflection after completing it.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Interactive user interface |
| Vite | Frontend development server and build tool |
| Node.js | JavaScript runtime |
| Express | REST API |
| Ollama | Local model runtime and inference API |
| Gemma 3 1B | Open-weight language model used for mission generation |
| CSS | Responsive interface and visual styling |
| Browser `localStorage` | Local adventure history |

### Why Local AI?

Local inference offers several benefits:

- No paid hosted LLM API is needed for mission generation.
- User preferences and prompts can remain on the local machine.
- The model can be experimented with and evaluated independently.
- The project is easier to reproduce without requiring a third-party AI API key.

Local inference still requires downloading the model, and the application needs Ollama running to generate missions.

## 🚀 Getting Started

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/) and npm
- [Git](https://git-scm.com/)
- [Ollama](https://ollama.com/)
- A computer capable of running the selected model

### 1. Clone the Repository

```bash
git clone https://github.com/dhruv-dagar/OutsideIn.git
cd OutsideIn
```

### 2. Install Dependencies

```bash
npm install
npm install express cors
```

### 3. Download the Model

```bash
ollama pull gemma3:1b
```

Verify that the model is available:

```bash
ollama list
```

### 4. Start Ollama

Ollama normally runs as a background service on supported desktop installations.

If it is not already running, start it:

```bash
ollama serve
```

Keep this terminal open if you started the server manually.

### 5. Start the Backend

Open another terminal in the project directory:

```bash
npm run server
```

The API should start at:

```text
http://127.0.0.1:3001
```

### 6. Start the Frontend

Open a separate terminal:

```bash
npm run dev
```

Vite will display the local development URL, usually:

```text
http://localhost:5173
```

Open the URL in your browser and generate your first micro-adventure.

### 7. Verify the Backend

Check whether the local AI service and model are available:

```bash
curl http://127.0.0.1:3001/api/health
```

Generate a sample mission:

```bash
curl -X POST http://127.0.0.1:3001/api/mission \
  -H 'Content-Type: application/json' \
  -d '{
    "minutes": 15,
    "interest": "Observe nature",
    "setting": "park",
    "difficulty": "easy"
  }'
```

The API returns a JSON object containing the generated mission and model identifier.

## 🔌 API Reference

### `GET /api/health`

Checks whether Ollama is reachable and the configured model is available.

Example response:

```json
{
  "ok": true,
  "model": "gemma3:1b",
  "modelAvailable": true
}
```

### `POST /api/mission`

Generates a mission using the selected preferences.

Example request:

```json
{
  "minutes": 15,
  "interest": "Observe nature",
  "setting": "park",
  "difficulty": "easy"
}
```

Supported values:

| Field | Accepted values |
|---|---|
| `minutes` | `10`, `15`, `20`, `30`, `45`, `60` |
| `interest` | `Observe nature`, `Walking and exploration`, `Photography`, `Mindful break`, `Birds and wildlife` |
| `setting` | `park`, `neighborhood`, `backyard`, `indoors-near-window` |
| `difficulty` | `easy`, `moderate` |

A successful response contains:

```json
{
  "mission": {
    "title": "Example mission",
    "description": "A short introduction to the activity.",
    "steps": [
      "Find a comfortable, safe place.",
      "Observe a detail in your surroundings.",
      "Reflect on what you noticed."
    ],
    "observationGoal": "Notice the different shapes of nearby leaves.",
    "reflectionQuestion": "What detail surprised you?",
    "safetyNote": "Stay in a safe, accessible area."
  },
  "model": "gemma3:1b"
}
```

The content above illustrates the response format; actual mission text is generated by the model.

Invalid preferences return HTTP `400`. Model failures or invalid generated output return HTTP `502`.

## 📁 Project Structure

```text
OutsideIn/
├── public/
├── server/
│   └── index.js
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

## 🔐 Privacy and Safety

OutsideIn is designed to make offline, low-pressure activities easier to discover.

- Mission generation uses the local Ollama API.
- Adventure history is stored in the browser's `localStorage`.
- The application does not require registration or a cloud database.
- The backend validates preference inputs and checks the structure of generated missions.
- Prompts instruct the model to avoid hazardous or inaccessible activities.

**Important:** Local AI does not automatically guarantee privacy or safety. Ollama must be running, and the generated instructions can still be inaccurate or inappropriate. Review activities before following them, use common sense, and remain aware of your surroundings.

The current application does not verify real-time weather, locations, accessibility, or local hazards.

## ⚠️ Limitations

This is an early-stage project and has several limitations:

- Mission quality depends on the locally installed model.
- AI-generated safety advice is not a substitute for personal judgment.
- Saved history is browser-specific and can be lost when site data is cleared.
- Mission history is not synchronized across devices.
- The current version does not use live maps, weather information, or location services.
- Local model inference can be slow on hardware with limited memory.
- The interface requires the frontend server, backend server, and Ollama service to be available for mission generation.

## 🗺️ Future Improvements

Potential next steps include:

- [ ] Improve mission quality with stronger structured-output validation.
- [ ] Add automated tests for the API and preference validation.
- [ ] Add mission categories for different environments and accessibility needs.
- [ ] Improve offline interface support and remove external font dependencies.
- [ ] Add export and import for locally saved adventure history.
- [ ] Add optional mission feedback to evaluate generated activities.
- [ ] Benchmark different open-weight models for quality, speed, and memory usage.
- [ ] Improve accessibility and add multilingual mission generation.
- [ ] Add an optional progressive web app experience.

## 🤝 Contributing

Contributions, suggestions, bug reports, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make a focused change.
4. Run the application and verify your change.
5. Open a pull request describing the change and testing performed.

For larger changes, open an issue first so the design can be discussed.

Please avoid committing API keys, personal data, model files, or local environment configuration.

## 🌱 Why Open Innovation Matters

OutsideIn demonstrates how open-weight AI can support a small but meaningful everyday problem without requiring a paid hosted AI service.

Open innovation makes it possible for developers to inspect an architecture, experiment with different models, adapt prompts, improve safety checks, and build on one another's work.

By making the source code available, OutsideIn invites the community to improve how local AI can encourage healthier relationships with technology.

The idea is simple: AI can be useful without becoming another reason to stay glued to a screen.

**Build with open technology. Spend more time in the real world.**

## 🙌 Acknowledgements

- The Gemma team for the open-weight model family.
- The Ollama project for making local model inference accessible.
- The React, Vite, Node.js, and Express communities.
- Hacktoberfest 2026 and the open-source community.

## 📄 License

This project does not yet declare a repository license. Add a `LICENSE` file before describing the project as reusable under a particular open-source license. The Gemma model is distributed under its own terms, separate from the project's code license.
