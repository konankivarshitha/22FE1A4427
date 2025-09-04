import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ShortenForm from "./ShortenForm";
import RedirectPage from "./RedirectPage";
import StatsPage from "./StatsPage";
import { Container, Button, Box } from "@mui/material";
import { logEvent } from "./logger";

const LINKS_KEY = "short_links_v1";

function App() {
  const [links, setLinks] = useState({}); // { code: { url, expiry, clicks: [] } }

  // 🔹 Load links from localStorage on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LINKS_KEY));
      if (saved) {
        setLinks(saved);
        logEvent("Loaded links from localStorage", "info", { count: Object.keys(saved).length });
      }
    } catch (err) {
      logEvent("Failed to parse saved links", "error", { err });
    }
  }, []);

  // 🔹 Save links whenever they change
  useEffect(() => {
    localStorage.setItem(LINKS_KEY, JSON.stringify(links));
    logEvent("Saved links to localStorage", "info", { count: Object.keys(links).length });
  }, [links]);

  return (
    <Container sx={{ textAlign: "center", mt: 4 }}>
      <h1>🔗 React URL Shortener</h1>

      <Box sx={{ mb: 2 }}>
        <Button
          component={Link}
          to="/"
          variant="contained"
          sx={{ mr: 2 }}
          onClick={() => logEvent("Navigate to Shortener", "info")}
        >
          Shortener
        </Button>
        <Button
          component={Link}
          to="/stats"
          variant="outlined"
          onClick={() => logEvent("Navigate to Stats", "info")}
        >
          Statistics
        </Button>
      </Box>

      <Routes>
        <Route path="/" element={<ShortenForm links={links} setLinks={setLinks} />} />
        <Route path="/:code" element={<RedirectPage links={links} setLinks={setLinks} />} />
        <Route path="/stats" element={<StatsPage links={links} />} />
      </Routes>
    </Container>
  );
}

export default App;
