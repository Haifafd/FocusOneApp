import { storage } from "./storage";

const CACHE_KEY = "@focusone:quote_cache";
const CACHE_TTL_MS = 60 * 60 * 1000;

const FALLBACK_QUOTES = [
  "The secret of getting ahead is getting started.",
  "Focus on being productive instead of busy.",
  "You don't have to see the whole staircase, just take the first step.",
  "What you do every day matters more than what you do once in a while.",
  "Discipline is the bridge between goals and accomplishment.",
  "Small daily improvements lead to staggering long-term results.",
  "Progress, not perfection.",
  "Done is better than perfect.",
  "Concentrate all your thoughts upon the work in hand.",
  "The successful warrior is the average person with laser-like focus.",
  "Where focus goes, energy flows.",
  "Direction is more important than speed.",
  "Action is the foundational key to all success.",
  "It is during our darkest moments that we must focus to see the light.",
  "Starve your distractions, feed your focus.",
];

const randomLocal = () => FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];

export async function fetchQuote() {
  const cached = await storage.get(CACHE_KEY);
  if (cached && Date.now() - cached.savedAt < CACHE_TTL_MS) return cached.text;

  try {
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), 5000);
    const r = await fetch(`https://api.adviceslip.com/advice?_=${Date.now()}`, { signal: ctrl.signal });
    clearTimeout(timeoutId);
    const data = await r.json();
    const text = data?.slip?.advice || randomLocal();
    await storage.set(CACHE_KEY, { text, savedAt: Date.now() });
    return text;
  } catch {
    return randomLocal();
  }
}
