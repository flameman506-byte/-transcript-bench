export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { apiKey, texts, targetLanguage } = await req.json();

  if (!apiKey || !Array.isArray(texts) || !targetLanguage) {
    return new Response(JSON.stringify({ error: { message: 'Missing apiKey, texts, or targetLanguage' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const prompt =
    `Translate each of the following ${texts.length} subtitle lines into ${targetLanguage}. ` +
    `Preserve the exact order and count (${texts.length} lines in, ${texts.length} lines out). ` +
    `Return ONLY a JSON array of strings — no markdown, no commentary.\n\n` +
    JSON.stringify(texts);

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2
    })
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' }
  });
}
