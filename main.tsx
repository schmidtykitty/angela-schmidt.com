import { Component, StrictMode, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import "./index.css";

class ErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  componentDidCatch(err: Error, info: ErrorInfo) { try { console.error("App crashed:", err, info); } catch { /* ignore */ } }
  render() {
    if (!this.state.crashed) return this.props.children;
    return (
      <main style={{ maxWidth: 560, margin: "80px auto", padding: "0 24px", fontFamily: "system-ui, sans-serif", color: "#111" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px" }}>Angela Schmidt</h1>
        <p style={{ fontSize: 17, lineHeight: 1.5, margin: "0 0 20px" }}>Something went wrong loading the interactive portfolio. You can still reach me by email, or reload the page.</p>
        <p><a style={{ color: "#111" }} href="mailto:aschmidty.kitty@gmail.com">aschmidty.kitty@gmail.com</a> · <a style={{ color: "#111" }} href="https://www.linkedin.com/in/angela-schmidt-poetsofgesture/" target="_blank" rel="noreferrer">LinkedIn ↗</a></p>
        <p><button style={{ marginTop: 16, padding: "8px 16px", border: "1px solid #111", background: "none", cursor: "pointer" }} onClick={() => { try { location.reload(); } catch {} }}>Reload</button></p>
      </main>
    );
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
