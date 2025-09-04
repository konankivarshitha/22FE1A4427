import React, { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from "@mui/material";
import { getLogs, clearLogs, logEvent } from "./logger";

function StatsPage({ links }) {
  const logs = getLogs();

  useEffect(() => {
    logEvent("Opened Stats page", "info");
  }, []);

  return (
    <div>
      <h2>📊 URL Statistics</h2>

      {/* links table (existing) */}
      {Object.keys(links).length === 0 ? (
        <p>No links created yet</p>
      ) : (
        <Table sx={{ mb: 4 }}>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Expiry</TableCell>
              <TableCell>Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(links).map(([code, { url, expiry, clicks }]) => (
              <TableRow key={code}>
                <TableCell>{window.location.origin + "/" + code}</TableCell>
                <TableCell>{url}</TableCell>
                <TableCell>{new Date(expiry).toLocaleString()}</TableCell>
                <TableCell>{clicks.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* simple logs viewer */}
      <h3>🧾 Logs (from middleware)</h3>
      <Button onClick={() => { clearLogs(); window.location.reload(); }} sx={{ mb: 1 }}>
        Clear Logs
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Level</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Context</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.slice().reverse().map((l, i) => (
            <TableRow key={i}>
              <TableCell>{new Date(l.ts).toLocaleString()}</TableCell>
              <TableCell>{l.level}</TableCell>
              <TableCell>{l.message}</TableCell>
              <TableCell>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(l.context || {}, null, 2)}
                </pre>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default StatsPage;
