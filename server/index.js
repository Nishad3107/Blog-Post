import http from 'http';
import { URL } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.CHATBOT_PORT || 8787;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    ...headers,
  });
  res.end(JSON.stringify(body));
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    });
    return res.end();
  }

  if (url.pathname !== '/api/gemini') {
    return send(res, 404, { error: 'Not found' });
  }

  if (req.method !== 'POST') {
    return send(res, 405, { error: 'Method not allowed' });
  }

  if (!GEMINI_API_KEY) {
    return send(res, 500, { error: 'Missing GEMINI_API_KEY' });
  }

  let raw = '';
  req.on('data', (chunk) => {
    raw += chunk;
  });

  req.on('end', async () => {
    try {
      const body = raw ? JSON.parse(raw) : {};
      const messages = Array.isArray(body.messages) ? body.messages : [];
      const context = body.context || '';
      const userText = messages.map((m) => `${m.role}: ${m.content}`).join('\n');
      const prompt = `You are a helpful travel assistant for a travel blog. Use the provided context first. Be concise and suggest 2-3 actionable tips.\n\nContext:\n${context}\n\nConversation:\n${userText}`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        return send(res, 500, { error: errText });
      }

      const data = await geminiRes.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not respond.';
      return send(res, 200, { reply: text });
    } catch (err) {
      return send(res, 500, { error: err?.message || 'Unknown error' });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Chatbot server listening on http://localhost:${PORT}`);
});
