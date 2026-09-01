export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const incoming = await req.formData();
  const file = incoming.get('file');
  const apiKey = incoming.get('apiKey');

  if (!file || !apiKey) {
    return new Response(JSON.stringify({ error: { message: 'Missing file or apiKey' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const upstream = new FormData();
  upstream.append('file', file, file.name || 'audio');
  upstream.append('model', 'whisper-1');
  upstream.append('response_format', 'verbose_json');

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: upstream
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' }
  });
}
