// Cheap passcode check, separate from /api/generate, so a wrong guess doesn't
// spend an Anthropic API call. Reads ACCESS_PASSCODE from the Vercel project's
// environment variables (set it in Settings -> Environment Variables).

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: { message: 'Method not allowed.' } });
    return;
  }

  const configuredPasscode = process.env.ACCESS_PASSCODE;
  const { passcode } = req.body || {};

  if (!configuredPasscode) {
    // No passcode configured server-side yet -> don't lock everyone out;
    // treat the gate as open until one is set.
    res.status(200).json({ ok: true });
    return;
  }

  res.status(200).json({ ok: passcode === configuredPasscode });
};
