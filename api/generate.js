// Vercel serverless function. Holds the real Anthropic API key server-side
// (set as the ANTHROPIC_API_KEY environment variable in the Vercel project
// settings — never committed to this repo) and forwards the browser's
// already-built request payload to Anthropic, gated by a shared passcode
// (ACCESS_PASSCODE, also set in Vercel's environment variables).
//
// The browser never sees the Anthropic key. It only ever talks to this
// same-origin endpoint.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: { message: 'Method not allowed.' } });
    return;
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    res.status(500).json({
      error: {
        message:
          'Server is missing the ANTHROPIC_API_KEY environment variable. Add it in the Vercel project settings (Settings -> Environment Variables), then redeploy.'
      }
    });
    return;
  }

  const configuredPasscode = process.env.ACCESS_PASSCODE;
  const { passcode, payload } = req.body || {};

  if (configuredPasscode && passcode !== configuredPasscode) {
    res.status(401).json({ error: { message: 'Incorrect or missing passcode.' } });
    return;
  }

  if (!payload || typeof payload !== 'object') {
    res.status(400).json({ error: { message: 'Missing request payload.' } });
    return;
  }

  try {
    const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload)
    });

    const data = await anthropicResp.json().catch(() => null);
    res.status(anthropicResp.status).json(
      data !== null ? data : { error: { message: 'Anthropic returned a non-JSON response.' } }
    );
  } catch (err) {
    res.status(502).json({
      error: { message: 'Could not reach Anthropic: ' + (err && err.message ? err.message : String(err)) }
    });
  }
};
