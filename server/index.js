
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;
const OLLAMA_URL = "http://127.0.0.1:11434";
const MODEL = "gemma3:1b";

app.use(cors());
app.use(express.json({ limit: "20kb" }));

const activities = [
  "Observe nature",
  "Walking and exploration",
  "Photography",
  "Mindful break",
  "Birds and wildlife",
];

app.get("/api/health", async (_req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!response.ok) throw new Error("Ollama unavailable");

    const data = await response.json();
    const available = data.models?.some((model) =>
      model.name.startsWith(MODEL)
    );

    res.json({
      ok: true,
      model: MODEL,
      modelAvailable: Boolean(available),
    });
  } catch {
    res.status(503).json({
      ok: false,
      error: "Ollama is unavailable. Start Ollama and try again.",
    });
  }
});

app.post("/api/mission", async (req, res) => {
  const { minutes, interest, setting, difficulty } = req.body ?? {};

  const validMinutes = [10, 15, 20, 30, 45, 60];
  const validSettings = ["park", "neighborhood", "backyard", "indoors-near-window"];

  if (
    !validMinutes.includes(Number(minutes)) ||
    typeof interest !== "string" ||
    !activities.includes(interest) ||
    !validSettings.includes(setting) ||
    !["easy", "moderate"].includes(difficulty)
  ) {
    return res.status(400).json({ error: "Please check your mission preferences." });
  }

  const prompt = `
You are OutsideIn, a thoughtful outdoor micro-adventure guide.
Create one safe, accessible, low-cost activity that encourages
the user to spend less time on screens and notice the real world.

User preferences:
- Time available: ${minutes} minutes
- Interest: ${interest}
- Setting: ${setting}
- Difficulty: ${difficulty}

Safety rules:
- Do not suggest trespassing, risky climbing, touching unknown plants
  or animals, entering traffic, or going somewhere isolated.
- Keep the activity appropriate for daylight and the stated setting.
- If outdoors is unavailable, suggest observing nature from a window.
- Do not require a phone, purchase, or special equipment.

Return ONLY valid JSON with this exact structure:
{
  "title": "Short engaging title",
  "description": "A friendly two-sentence introduction",
  "steps": ["Step one", "Step two", "Step three"],
  "observationGoal": "One thing to notice",
  "reflectionQuestion": "One question to answer afterwards",
  "safetyNote": "One concise practical safety reminder"
}
`;

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        format: "json",
        options: { temperature: 0.7 },
      }),
      signal: AbortSignal.timeout(90000),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned status ${response.status}`);
    }

    const result = await response.json();
    const mission = JSON.parse(result.response);
    console.log(
  "Gemma raw response:",
  JSON.stringify(mission, null, 2)
);

    const validMission =
      typeof mission.title === "string" &&
      typeof mission.description === "string" &&
      Array.isArray(mission.steps) &&
      mission.steps.length >= 2 &&
      mission.steps.every((step) => typeof step === "string") &&
      typeof mission.observationGoal === "string" &&
      typeof mission.reflectionQuestion === "string" &&
      typeof mission.safetyNote === "string";

    if (!validMission) {
      throw new Error("The model returned an invalid mission structure");
    }

    res.json({ mission, model: MODEL });
  } catch (error) {
    console.error("Mission generation failed:", error.message);
    res.status(502).json({
      error: "We couldn't generate a mission. Please try again.",
    });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`OutsideIn API running at http://127.0.0.1:${PORT}`);
});
