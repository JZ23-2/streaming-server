import * as streamKeyService  from "../services/streamKeyService.js";

export async function createStreamKey(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email are required" });
  }

  const result = streamKeyService.createStreamKey(email);
  res.json(result);
}
