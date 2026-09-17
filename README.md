# SIGNAL

**A personal AI operating system for evaluating job opportunities.**

SIGNAL is a four-agent console that runs any job description through a structured evaluation pipeline — fit scoring, resume tailoring, interview prep, and a final go/no-go recommendation — instead of relying on gut feel and scattered notes.

## Why I built this

Job hunting during a career transition produces a lot of noise: dozens of postings, inconsistent notes, and decisions made on vibes. SIGNAL gives every opportunity the same structured pass, grounded in an actual candidate profile, so fit and risk get surfaced *before* a decision gets made, not after.

## How it works

You save your profile (resume + target context) once, stored locally in your browser. Every job description you paste in then runs through four agents in sequence, each building on the previous one's output:

1. **Job Agent** — scores fit (0–100), and lists concrete matching skills and gaps against the specific job description, grounded strictly in the candidate's real background (no overclaiming).
2. **Resume Agent** — takes the Job Agent's findings and produces specific, non-generic resume edits: priority changes, experiences to highlight, and keywords to add for that role.
3. **Interview Agent** — using both prior outputs, predicts likely interview areas, generates realistic interview questions, flags prep gaps, and outputs a focused prep plan.
4. **Decision Agent** — synthesizes all three into a final call: **Apply**, **Apply with Preparation**, or **Don't Prioritise** — with reasoning tied to fit score, gap size, and growth potential relative to the transition goal.

Each stage is retryable independently if a call fails, and every evaluation is saved to history so past decisions stay reviewable.

## Tech

- Single-file HTML/CSS/JS front end, no build step, no framework.
- UI: custom dark console theme (Space Grotesk / IBM Plex Sans / IBM Plex Mono).
- Each agent is a separate call to Claude (`claude-sonnet-4-6`), with a strict JSON-only response schema per agent and defensive parsing (handles truncated output, non-JSON replies, and malformed JSON with clear error messages surfaced in the UI).
- A small serverless function (`api/agent.js`) proxies model calls to the Anthropic API so the API key stays server-side and is never exposed in the browser.
- Profile and evaluation history persist in the browser's `localStorage`.

## Status

Actively used as a personal tool for my own GRC / AI Governance job search. A full case study on the design and iteration process is available on request.
