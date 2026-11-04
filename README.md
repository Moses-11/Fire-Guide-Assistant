# Fire Guide AI — GitHub Pages starter

A responsive Fire Guide chat interface built with HTML, CSS and JavaScript. It includes:
- Fire Guide-branded responsive chat UI
- Markdown rendering (Marked) with HTML sanitization (DOMPurify)
- Curated local fire-safety answers
- Quick topic prompts, chat history in browser local storage, and clear/new chat controls
- No build tools or framework required

## Run locally
Open `index.html` in a modern browser. Internet access is needed for Google Fonts and the Markdown/sanitization CDN libraries. A plain-text fallback is included if those libraries fail to load.

## Publish on GitHub Pages
1. Create a new GitHub repository, for example `fire-guide-ai`.
2. Upload `index.html`, `styles.css`, `app.js`, and this README to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and `/ (root)`, then save.
6. Wait for the deployment and open the Pages URL shown in Settings → Pages.

## Important: local knowledge base vs live AI
This starter is a working front-end demo with curated responses. It is **not yet connected to a live AI model**. GitHub Pages cannot safely keep a private AI API key. For a real AI assistant, add a serverless/backend endpoint (such as a Cloudflare Worker) and store the provider key as a server-side secret. The browser should call your endpoint, never the provider directly with a private key.

Before public release, have all emergency and first-aid content reviewed against current local fire-service and medical guidance. The assistant is educational and must direct people in immediate danger to evacuate and contact local emergency services.
