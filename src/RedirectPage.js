import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { logEvent } from "./logger";

function RedirectPage({ links, setLinks }) {
  const { code } = useParams();

  useEffect(() => {
    const entry = links[code];
    if (!entry) {
      logEvent("Redirect failed: code not found", "warn", { code });
      return;
    }
    const { url, expiry } = entry;
    if (Date.now() > expiry) {
      logEvent("Redirect blocked: link expired", "info", { code, url });
      return;
    }

    // track click
    setLinks((prev) => ({
      ...prev,
      [code]: { ...prev[code], clicks: [...prev[code].clicks, { ts: Date.now() }] }
    }));
    logEvent("Redirecting", "info", { code, url });

    // perform redirect
    window.location.href = url;
  }, [code, links, setLinks]);

  if (!links[code]) return <h2>❌ Link not found</h2>;
  if (Date.now() > links[code].expiry) return <h2>⏳ Link expired</h2>;
  return <h2>Redirecting…</h2>;
}

export default RedirectPage;
