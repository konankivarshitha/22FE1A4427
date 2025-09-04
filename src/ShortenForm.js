import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { logEvent } from "./logger";

function ShortenForm({ links, setLinks }) {
  const [inputs, setInputs] = useState([{ url: "", customCode: "", validity: "" }]);
  const [error, setError] = useState("");

  const generateCode = () => Math.random().toString(36).slice(2, 7);

  const handleChange = (i, field, value) => {
    const next = [...inputs];
    next[i][field] = value;
    setInputs(next);
  };

  const addField = () => {
    if (inputs.length >= 5) return;
    setInputs([...inputs, { url: "", customCode: "", validity: "" }]);
    logEvent("Add URL row", "info", { totalRows: inputs.length + 1 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const batch = {};

    for (let i = 0; i < inputs.length; i++) {
      let { url, customCode, validity } = inputs[i];

      // validation
      if (!/^https?:\/\//i.test(url)) {
        setError("Each URL must start with http/https");
        logEvent("Validation failed: invalid URL", "warn", { row: i + 1, url });
        return;
      }

      let code = (customCode || "").trim() || generateCode();
      if (!/^[a-z0-9-]+$/i.test(code)) {
        setError("Shortcode must be alphanumeric (dashes allowed)");
        logEvent("Validation failed: shortcode not alphanumeric", "warn", { code });
        return;
      }
      if (links[code] || batch[code]) {
        setError(`Shortcode already exists: ${code}`);
        logEvent("Collision: shortcode already used", "error", { code });
        return;
      }

      const minutes = validity ? parseInt(validity, 10) : 30;
      if (Number.isNaN(minutes) || minutes <= 0) {
        setError("Validity must be a positive integer (minutes)");
        logEvent("Validation failed: invalid validity", "warn", { validity });
        return;
      }

      const expiry = Date.now() + minutes * 60 * 1000;
      batch[code] = { url, expiry, clicks: [] };
      logEvent("Short link created", "info", { code, url, minutes });
    }

    setLinks((prev) => ({ ...prev, ...batch }));
    setInputs([{ url: "", customCode: "", validity: "" }]);
    setError("");
    logEvent("Batch create complete", "info", { count: Object.keys(batch).length });
  };

  return (
    <form onSubmit={handleSubmit}>
      {inputs.map((inp, i) => (
        <Box key={i} sx={{ mb: 2 }}>
          <TextField label="Enter URL" value={inp.url}
            onChange={(e) => handleChange(i, "url", e.target.value)}
            sx={{ mr: 1, width: 300 }} />
          <TextField label="Custom shortcode (optional)" value={inp.customCode}
            onChange={(e) => handleChange(i, "customCode", e.target.value)}
            sx={{ mr: 1, width: 200 }} />
          <TextField type="number" label="Validity (mins, default 30)" value={inp.validity}
            onChange={(e) => handleChange(i, "validity", e.target.value)}
            sx={{ width: 180 }} />
        </Box>
      ))}

      <Box sx={{ mt: 1 }}>
        <Button onClick={addField} disabled={inputs.length >= 5} sx={{ mr: 2 }}>
          Add Another URL
        </Button>
        <Button type="submit" variant="contained">Shorten</Button>
      </Box>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default ShortenForm;
