const missions = [
  {
    title: "A Tiny World of Leaves",
    description: "Slow down and discover the small details hiding in a patch of greenery.",
    steps: [
      "Find a safe, accessible spot with plants or trees.",
      "Notice three leaves with different shapes, textures, or colours.",
      "Spend a moment observing how light and shadows change their appearance."
    ],
    observationGoal: "Find one detail in a leaf that you would normally overlook.",
    reflectionQuestion: "What small detail surprised you?",
    safetyNote: "Stay on safe paths, avoid touching unknown plants, and respect private property."
  },
  {
    title: "Listen to Your Surroundings",
    description: "Take a short break and pay attention to the soundscape around you.",
    steps: [
      "Choose a comfortable, safe place to pause.",
      "Listen quietly and identify three different sounds.",
      "Notice which sounds are close, which are distant, and how they change."
    ],
    observationGoal: "Identify a sound you usually tune out.",
    reflectionQuestion: "Which sound made you most curious?",
    safetyNote: "Remain aware of traffic and your surroundings. Do not enter unsafe areas."
  },
  {
    title: "A Different Way Home",
    description: "Explore familiar surroundings with fresh eyes.",
    steps: [
      "Choose a safe, familiar route or nearby area.",
      "Look for an interesting pattern, colour, or architectural detail.",
      "Pause somewhere safe and notice one thing you had never paid attention to."
    ],
    observationGoal: "Find something interesting in an ordinary place.",
    reflectionQuestion: "Did a familiar place feel different today?",
    safetyNote: "Use safe public paths, obey traffic rules, and avoid isolated areas."
  }
];

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { minutes, interest, setting, difficulty } = req.body || {};
  const validMinutes = [10, 15, 20, 30, 45, 60];
  const validInterests = [
    "Observe nature",
    "Walking and exploration",
    "Photography",
    "Mindful break",
    "Birds and wildlife"
  ];
  const validSettings = [
    "park",
    "neighborhood",
    "backyard",
    "indoors-near-window"
  ];

  if (
    !validMinutes.includes(Number(minutes)) ||
    !validInterests.includes(interest) ||
    !validSettings.includes(setting) ||
    !["easy", "moderate"].includes(difficulty)
  ) {
    return res.status(400).json({ error: "Invalid preferences" });
  }

  const mission = missions[Math.floor(Math.random() * missions.length)];

  return res.status(200).json({
    mission: {
      ...mission,
      description: `${mission.description} Suggested for ${minutes} minutes, with an interest in ${interest.toLowerCase()}.`
    },
    mode: "demo",
    model: "curated-sample"
  });
}
