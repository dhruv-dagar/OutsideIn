export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json({
    ok: true,
    mode: "demo",
    model: "curated-sample",
    modelAvailable: false
  });
}
