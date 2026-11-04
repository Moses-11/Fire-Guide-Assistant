/* Fire Guide AI — static GitHub Pages starter.
   This version uses a curated local knowledge base. For live AI, connect a secure
   serverless/backend endpoint; never put a private API key in this public repo. */
const $ = (selector) => document.querySelector(selector);
const form = $("#chatForm");
const input = $("#messageInput");
const messages = $("#messages");
const welcome = $("#welcome");
const sendBtn = $("#sendBtn");
const STORAGE_KEY = "fireGuideAiChat_v1";

const knowledge = [
  {
    keys: ["pass method", "fire extinguisher", "extinguisher"],
    answer: `## Using a fire extinguisher: the PASS method

Only attempt to fight a **small, contained fire** if you have the correct extinguisher, have been trained, and have a clear escape route behind you. Otherwise, evacuate.

1. **P — Pull** the safety pin.
2. **A — Aim** the nozzle at the base of the fire, not the flames.
3. **S — Squeeze** the handle.
4. **S — Sweep** from side to side at the base of the fire.

**Remember:** If the fire grows, smoke increases, or your exit is threatened, stop immediately, evacuate and raise the alarm. Never use water on a grease or energized electrical fire.`
  },
  {
    keys: ["evacuation", "evacuate", "escape", "school fire", "assembly point"],
    answer: `## Emergency evacuation steps

1. **Raise the alarm** immediately and alert people nearby.
2. **Leave by the nearest safe exit.** Do not use lifts.
3. **Stay low** if there is smoke; cleaner air may be closer to the floor.
4. **Feel a closed door** with the back of your hand before opening it. If it is hot, use another route.
5. **Close doors behind you** if safe, to help slow the spread of fire.
6. **Go to the designated assembly point** and stay there.
7. **Report missing people** to emergency responders. Do not re-enter the building.

### For schools
Keep evacuation routes clear, practise drills, assign trained wardens, and make arrangements to assist learners who need support.

If your route is blocked, move to a room with a window if possible, close the door, block smoke gaps with cloth if available, call emergency services and signal your location.`
  },
  {
    keys: ["burn", "scald", "first aid"],
    answer: `## Immediate first aid for a burn

1. Move away from the heat source and make sure the area is safe.
2. Cool the burn under **cool running water for 20 minutes** as soon as possible.
3. Remove jewellery and loose clothing near the burn, unless stuck to the skin.
4. Cover it loosely with a sterile, non-fluffy dressing or clean cling film laid over the burn.
5. Seek urgent medical care for large or deep burns, chemical or electrical burns, burns to the face, hands, feet, genitals or major joints, or any burn in a child that concerns you.

**Do not:** apply ice, butter, toothpaste, oils or creams; do not burst blisters; do not pull away material stuck to the skin.

For a serious burn, call emergency services. Keep the person warm and monitor their breathing while help is coming.`
  },
  {
    keys: ["prevent", "prevention", "home fire", "kitchen", "smoke alarm"],
    answer: `## Preventing fires at home

- Never leave cooking unattended. Keep towels, paper and curtains away from the stove.
- Keep matches and lighters away from children.
- Avoid overloading sockets and replace damaged cables.
- Switch off appliances when not in use, where appropriate.
- Store fuels and flammable liquids safely, away from heat.
- Install smoke alarms where possible, test them regularly and replace batteries as required.
- Keep exits and escape routes clear.
- Make and practise a household escape plan.

### If a cooking-oil pan catches fire
Turn off the heat if safe, cover the pan with a metal lid or fire blanket, and leave it covered until cool. **Never pour water onto burning oil** and never carry the burning pan. If it is not immediately controlled, evacuate and call for help.`
  },
  {
    keys: ["electrical", "electricity", "socket", "wiring"],
    answer: `## Electrical fire safety

1. Do not touch the appliance, plug or wires if there is smoke, flame or a risk of electric shock.
2. If you can safely isolate power at the breaker without approaching the fire, do so.
3. Never use water on equipment that may still be energized.
4. Use only an extinguisher rated for the type of fire and follow its instructions, and only if the fire is small and you have a clear escape route.
5. If the fire is spreading or you are unsure, evacuate, raise the alarm and call emergency services.

Have electrical faults inspected by a qualified electrician.`
  }
];

const fallback = `I can help with fire prevention, evacuation, extinguishers and basic burn first aid.

Could you tell me a little more about what you need? For example, are you asking about **home, school, workplace or public-place** fire safety?

> If there is a fire or immediate danger right now, leave the area, alert others and contact local emergency services. Do not wait for an online response.`;

function answerQuestion(question) {
  const q = question.toLowerCase();
  const match = knowledge.find(item => item.keys.some(key => q.includes(key)));
  if (/\b(hello|hi|hey)\b/.test(q)) {
    return "Hello! 👋 I'm your **Fire Guide AI Assistant**. I can help you learn about fire prevention, extinguishers, evacuation and basic first aid. What would you like to know?";
  }
  if (q.includes("what can you do") || q.includes("help me")) {
    return "I can explain **fire prevention**, the **PASS extinguisher method**, **emergency evacuation**, **electrical fire precautions**, and **basic burn first aid**. Choose a topic from the sidebar or ask me a question.";
  }
  return match ? match.answer : fallback;
}

function renderMarkdown(text) {
  if (window.marked && window.DOMPurify) {
    marked.setOptions({ breaks: true, gfm: true });
    return DOMPurify.sanitize(marked.parse(text));
  }
  // Safe plain-text fallback if CDN libraries are unavailable.
  const escaped = text.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  return `<p>${escaped.replace(/\n/g, "<br>")}</p>`;
}

function appendMessage(role, text, save = true) {
  const row = document.createElement("div");
  row.className = `message ${role}`;
  if (role === "assistant") {
    const avatar = document.createElement("div");
    avatar.className = "msg-avatar";
    avatar.textContent = "🔥";
    row.appendChild(avatar);
  }
  const body = document.createElement("div");
  body.className = "msg-content";
  if (role === "assistant") body.innerHTML = renderMarkdown(text);
  else body.textContent = text;
  row.appendChild(body);
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
  if (save) persistMessage(role, text);
}

function persistMessage(role, text) {
  const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  history.push({ role, text });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-60)));
}

function showTyping() {
  const row = document.createElement("div");
  row.className = "message assistant";
  row.id = "typingIndicator";
  row.innerHTML = '<div class="msg-avatar">🔥</div><div class="typing" aria-label="Assistant is thinking"><i></i><i></i><i></i></div>';
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}
function removeTyping() { $("#typingIndicator")?.remove(); }

function sendMessage(text) {
  const question = text.trim();
  if (!question) return;
  welcome.classList.add("hidden");
  messages.classList.add("active");
  appendMessage("user", question);
  input.value = "";
  input.style.height = "auto";
  sendBtn.disabled = true;
  showTyping();
  // Simulated response delay makes the local demo feel conversational.
  window.setTimeout(() => {
    removeTyping();
    appendMessage("assistant", answerQuestion(question));
    sendBtn.disabled = false;
    input.focus();
  }, 450);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  sendMessage(input.value);
});
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 130) + "px";
});
input.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});
document.querySelectorAll("[data-prompt]").forEach(button => {
  button.addEventListener("click", () => sendMessage(button.dataset.prompt));
});

function clearChat() {
  localStorage.removeItem(STORAGE_KEY);
  messages.replaceChildren();
  messages.classList.remove("active");
  welcome.classList.remove("hidden");
}
$("#newChatBtn").addEventListener("click", clearChat);
$("#clearBtn").addEventListener("click", clearChat);

const sidebar = $("#sidebar"), backdrop = $("#backdrop");
function closeMenu(){sidebar.classList.remove("open");backdrop.classList.remove("show");}
$("#menuBtn").addEventListener("click",()=>{sidebar.classList.add("open");backdrop.classList.add("show");});
backdrop.addEventListener("click",closeMenu);
document.querySelectorAll(".topic-nav button").forEach(b=>b.addEventListener("click",closeMenu));

// Restore the last local conversation.
try {
  const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (history.length) {
    welcome.classList.add("hidden");
    messages.classList.add("active");
    history.forEach(item => appendMessage(item.role, item.text, false));
  }
} catch { localStorage.removeItem(STORAGE_KEY); }

/*
LIVE AI INTEGRATION (recommended next step)
-------------------------------------------
GitHub Pages is static hosting. Do not paste a private provider API key here.
Deploy a small serverless function (for example, Cloudflare Workers) and then:
1. Replace answerQuestion(question) with an async fetch to your own endpoint.
2. Keep the API key as a server-side secret in the hosting provider.
3. Validate requests, apply rate limits, and restrict allowed origins.
*/
