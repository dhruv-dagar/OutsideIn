
import { useEffect, useState } from "react";
import "./App.css";

const interests = [
  "Observe nature",
  "Walking and exploration",
  "Photography",
  "Mindful break",
  "Birds and wildlife",
];

const settings = [
  { value: "park", label: "A park or green space", icon: "🌳" },
  { value: "neighborhood", label: "My neighborhood", icon: "🚶" },
  { value: "backyard", label: "Garden or backyard", icon: "🌿" },
  { value: "indoors-near-window", label: "Near a window", icon: "☀️" },
];

const defaults = {
  minutes: 15,
  interest: interests[0],
  setting: "park",
  difficulty: "easy",
};

function readHistory() {
  try {
    return JSON.parse(localStorage.getItem("outsidein-history") || "[]");
  } catch {
    return [];
  }
}

export default function App() {
  const [preferences, setPreferences] = useState(defaults);
  const [mission, setMission] = useState(null);
  const [history, setHistory] = useState(readHistory);
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState("Checking experience…");
  const [apiMode, setApiMode] = useState("local");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetch("/api/health")
      .then((response) => {
        if (!response.ok) throw new Error("Offline");
        return response.json();
      })
      .then((data) => {
        setApiMode(data.mode === "demo" ? "demo" : "local");
        setApiStatus(
          data.mode === "demo"
            ? "Public demo · Sample missions"
            : data.modelAvailable
              ? `Local AI ready · ${data.model}`
              : "Model not found — check Ollama"
        );
      })
      .catch(() => {
        setApiMode("local");
        setApiStatus("Local AI unavailable");
      });
  }, []);

  function updatePreference(key, value) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  async function generateMission(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMission(null);
    setCompleted(false);
    setReflection("");

    try {
      const response = await fetch("/api/mission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed");

      setMission(data.mission);
    } catch (err) {
      setError(err.message || "Couldn't generate a mission.");
    } finally {
      setLoading(false);
    }
  }

  function completeMission() {
    if (!mission || completed) return;

    const entry = {
      id: crypto.randomUUID(),
      title: mission.title,
      date: new Date().toISOString(),
      reflection: reflection.trim(),
      minutes: Number(preferences.minutes),
    };

    const updated = [entry, ...history].slice(0, 30);
    setHistory(updated);
    localStorage.setItem("outsidein-history", JSON.stringify(updated));
    setCompleted(true);
  }

  const totalMinutes = history.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="OutsideIn home">
          <span className="brand-mark">↗</span>
          outside<span>in</span>
        </a>
        <span className="local-badge">
          <span className="status-dot" />
          {apiStatus}
        </span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">A LITTLE LESS SCREEN. A LITTLE MORE LIFE.</span>
          <h1>The world is<br />waiting <em>outside.</em></h1>
          <p>
            Tiny adventures. Fresh perspectives. A reason to put your phone
            down and see what’s around you.
          </p>
          <a href="#planner" className="primary-link">
            Find my next adventure <span>↓</span>
          </a>
          <div className="hero-note">✳ No feeds. No pressure. Just you and the world.</div>
        </div>
        <div className="hero-art" role="img" aria-label="Illustration of a sunny green landscape">
          <div className="sun" />
          <div className="hill hill-back" />
          <div className="hill hill-front" />
          <div className="trail" />
          <div className="flower flower-one">✿</div>
          <div className="flower flower-two">✿</div>
          <div className="art-caption">TAKE THE SCENIC ROUTE</div>
        </div>
      </section>

      <section className="planner-section" id="planner">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR TIME, YOUR ADVENTURE</span>
            <h2>Make a little room for outside.</h2>
          </div>
          <span className="step-label">01 / PLAN</span>
        </div>

        <form className="planner" onSubmit={generateMission}>
          <fieldset>
            <legend>How much time do you have?</legend>
            <div className="choice-row">
              {[10, 15, 20, 30, 45, 60].map((minutes) => (
                <button
                  type="button"
                  key={minutes}
                  className={`time-choice ${Number(preferences.minutes) === minutes ? "selected" : ""}`}
                  onClick={() => updatePreference("minutes", minutes)}
                  aria-pressed={Number(preferences.minutes) === minutes}
                >
                  {minutes}<small> min</small>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>What sounds good today?</legend>
            <div className="interest-grid">
              {interests.map((interest, index) => (
                <button
                  type="button"
                  key={interest}
                  className={`interest-choice ${preferences.interest === interest ? "selected" : ""}`}
                  onClick={() => updatePreference("interest", interest)}
                  aria-pressed={preferences.interest === interest}
                >
                  <span>{["🍃", "🥾", "📷", "☁️", "🐦"][index]}</span>
                  {interest}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Where will you explore?</legend>
            <div className="setting-grid">
              {settings.map((setting) => (
                <button
                  type="button"
                  key={setting.value}
                  className={`setting-choice ${preferences.setting === setting.value ? "selected" : ""}`}
                  onClick={() => updatePreference("setting", setting.value)}
                  aria-pressed={preferences.setting === setting.value}
                >
                  <span>{setting.icon}</span>
                  {setting.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Choose your pace</legend>
            <div className="choice-row">
              {[
                { value: "easy", label: "Easygoing", note: "Take it slow" },
                { value: "moderate", label: "A little active", note: "Move a bit more" },
              ].map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={`pace-choice ${preferences.difficulty === option.value ? "selected" : ""}`}
                  onClick={() => updatePreference("difficulty", option.value)}
                  aria-pressed={preferences.difficulty === option.value}
                >
                  <strong>{option.label}</strong>
                  <small>{option.note}</small>
                </button>
              ))}
            </div>
          </fieldset>

          <button className="generate-button" type="submit" disabled={loading}>
            {loading ? "Dreaming up your adventure…" : "✳  Create my adventure"}
          </button>
          {error && <p className="error-message" role="alert">{error}</p>}
          <p className="privacy-note">{apiMode === "demo" ? "Try the public demo with curated sample missions. Your saved history stays in this browser." : "Your preferences stay in this session. Mission generation runs through your local Ollama model."}</p>
        </form>
      </section>

      {mission && (
        <section className="mission-section" aria-live="polite">
          <div className="mission-card">
            <span className="eyebrow">YOUR NEXT LITTLE ADVENTURE</span>
            <h2>{mission.title}</h2>
            <p className="mission-description">{mission.description}</p>

            <div className="mission-meta">
              <span>◷ {preferences.minutes} minutes</span>
              <span>✳ {preferences.interest}</span>
            </div>

            <h3>Here's your plan</h3>
            <ol className="mission-steps">
              {mission.steps.map((step, index) => (
                <li key={`${index}-${step}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {step}
                </li>
              ))}
            </ol>

            <div className="observation-box">
              <span>👀 YOUR THING TO NOTICE</span>
              <p>{mission.observationGoal}</p>
            </div>

            <div className="safety-note">
              <strong>Stay safe:</strong> {mission.safetyNote}
            </div>

            {!completed ? (
              <div className="reflection-area">
                <label htmlFor="reflection">When you get back, what did you notice?</label>
                <textarea
                  id="reflection"
                  rows="3"
                  maxLength="500"
                  value={reflection}
                  onChange={(event) => setReflection(event.target.value)}
                  placeholder="A sound, a tiny detail, a new thought… (optional)"
                />
                <button className="generate-button" onClick={completeMission}>
                  I did it — save my adventure ✓
                </button>
              </div>
            ) : (
              <p className="success-message">✓ Adventure saved. Nice work showing up for the real world.</p>
            )}
          </div>
        </section>
      )}

      <section className="history-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SMALL MOMENTS ADD UP</span>
            <h2>Your outside time.</h2>
          </div>
          <span className="step-label">{history.length} ADVENTURES</span>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <span>Adventures completed</span>
            <strong>{history.length}</strong>
          </div>
          <div className="stat-card">
            <span>Minutes spent outside</span>
            <strong>{totalMinutes}</strong>
          </div>
          <div className="stat-card">
            <span>Latest mission</span>
            <strong className="latest-stat">{history[0]?.title || "Waiting for your first"}</strong>
          </div>
        </div>
        {history.length > 0 && (
          <div className="history-list">
            {history.slice(0, 5).map((item) => (
              <article className="history-item" key={item.id}>
                <div><strong>{item.title}</strong><small>{new Date(item.date).toLocaleDateString()}</small></div>
                <span>{item.minutes} min ✓</span>
                {item.reflection && <p>{item.reflection}</p>}
              </article>
            ))}
            <button
              className="clear-history"
              onClick={() => {
                if (window.confirm("Delete your locally saved adventure history?")) {
                  setHistory([]);
                  localStorage.removeItem("outsidein-history");
                }
              }}
            >
              Clear local history
            </button>
          </div>
        )}
      </section>

      <footer className="footer">
        <a className="brand" href="#"><span className="brand-mark">↗</span> outside<span>in</span></a>
        <p>Built to help you reconnect with the world beyond your screen.</p>
        <span>LOCAL AI · OPEN SOURCE · REAL LIFE</span>
      </footer>
    </main>
  );
}
