# Transcript Bench

Upload audio, transcribe it, translate it, and download SRT/TXT with timestamps —
runs as a website, no Linux or local install required.

## How it works
- `index.html` — the whole UI, runs in the browser.
- `api/transcribe.js`, `api/translate.js` — small serverless functions that
  forward requests to OpenAI's API (a browser can't call OpenAI directly due
  to CORS, so these act as a pass-through). They don't store your key.
- You paste your own OpenAI API key into the page each time you use it; it's
  only ever sent to your own deployed functions, then straight to OpenAI.

## Deploy (no Linux needed — everything below runs in the cloud)
1. Create a free account at vercel.com if you don't have one.
2. Push this folder to a new GitHub repo (GitHub's web uploader works fine,
   or GitHub Desktop on Chrome OS).
3. In Vercel, "Add New Project" → import that repo → Deploy. No config
   needed; Vercel auto-detects the `api/` folder as serverless functions.
4. Open the deployed URL, paste your OpenAI API key, upload audio, go.

## Notes
- Handles audio up to roughly 90 minutes. Whisper's API caps each upload at
  25 MB, so for anything above ~24 MB the page runs ffmpeg.wasm in your
  browser first to split the file into ~15-minute, 64kbps mono chunks, then
  transcribes each chunk and stitches the timestamps back together. The
  first time this runs it downloads the ffmpeg core (~30 MB); after that
  it's cached by the browser.
- Translation is done in batches of 40 subtitle lines via GPT-4o-mini to
  keep responses reliable; you'll see progress in the log panel.
- Your API key never gets saved anywhere — it lives only in the browser tab
  for that session.
