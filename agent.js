// Serverless proxy for SIGNAL's Claude calls.
//
// Why this exists: SIGNAL was originally built as a Claude artifact, where the browser
// can call api.anthropic.com directly with no key exposed. Outside that environment,
// calling Anthropic straight from the browser would mean shipping your API key in
// client-side JS — anyone could open devtools and steal it. This function sits between
// the browser and Anthropic: the browser calls /api/agent, this function attaches the
// real API key (read from a server-side environment variable, never sent to the
// browser) and forwards the request.
//
// Deployment (Vercel): this file living at /api/agent.js is all Vercel needs to expose
// it at POST /api/agent — no extra config. Just set the ANTHROPIC_API_KEY environment
// variable in your Vercel project settings (Project → Settings → Environment Variables).

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: { message: "Method not allowed" } });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: {
        message:
          "Server is missing ANTHROPIC_API_KEY. Set it in your Vercel project's Environment Variables and redeploy.",
      },
    });
    return;
  }

  const { model, max_tokens, system, messages } = req.body || {};
  if (!messages) {
    res.status(400).json({ error: { message: "Request body must include 'messages'." } });
    return;
  }

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || "claude-sonnet-4-6",
        max_tokens: max_tokens || 1000,
        system,
        messages,
      }),
    });

    const data = await anthropicRes.json();
    // Forward Anthropic's status code as-is (e.g. 401 for a bad key, 429 for rate
    // limits) so the front end's existing error handling can surface it meaningfully.
    res.status(anthropicRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: { message: "Proxy request to Anthropic failed: " + err.message } });
  }
};
