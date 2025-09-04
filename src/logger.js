// src/logger.js
const LOG_KEY = "app_logs_v1";

// read all logs (for Stats/Logs page)
export function getLogs() {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY)) || [];
  } catch {
    return [];
  }
}

// clear logs (optional button)
export function clearLogs() {
  localStorage.removeItem(LOG_KEY);
}

// the middleware function — use this everywhere instead of console.log
export function logEvent(message, level = "info", context = {}) {
  const entry = {
    ts: Date.now(),
    level,                // "info" | "warn" | "error" | "debug"
    message,              // human-readable text
    context               // any extra data (code, url, etc.)
  };

  // 1) print to console (you may keep this during dev)
  //    NOTE: your assignment forbids "inbuilt language loggers" in final;
  //    if so, comment out the line below for final submission.
  console.log(`[${new Date(entry.ts).toISOString()}] [${level}] ${message}`, context);

  // 2) persist to localStorage
  const logs = getLogs();
  logs.push(entry);
  // keep last 500 logs to avoid unbounded growth
  while (logs.length > 500) logs.shift();
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
}
