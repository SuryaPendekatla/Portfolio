# Surya Pendekatla — Portfolio

Interactive 3D portfolio for **Surya Pendekatla, AI Product Engineer** (LLM applications · agentic workflows · generative AI).

**Live:** https://portfolio-surya-pendekatla.vercel.app

The site is a space-themed WebGL scene: a floating terminal opens the profile, holographic cards open each project, and a HUD handles navigation, sound and achievements.

## Featured projects

| Project | What it is | Links |
| --- | --- | --- |
| **ShotSense** | AI shot analyzer for filmmakers — OpenCV cut detection, a fine-tuned ResNet-18 shot-scale classifier (57% macro-F1 vs a 31% baseline) and LLM shot breakdowns | [Live](https://shotsense.onrender.com) · [Code](https://github.com/SuryaPendekatla/shotsense) |
| **CineFlow AI** | Agentic LangGraph pipeline that turns a one-line idea into a story bible, shot list and prompts for Veo, Kling, Seedance and Wan | [Live](https://cineflow-ai-kp8u.onrender.com) · [Code](https://github.com/SuryaPendekatla/CineFlow-AI) |
| **AI-First Corporate Website Revamp** | Component-driven React + Vite rebuild with Tailwind CSS and Framer Motion | — |

## Tech stack

React 19 · TypeScript · Vite · Three.js via React Three Fiber, Drei and postprocessing

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run lint
```

## Editing content

All text on the site — bio, experience, education, certifications, projects and skills — lives in
[`src/data/portfolioData.ts`](src/data/portfolioData.ts). Components read from it, so updating the
portfolio is a data change only:

- **Projects:** add an object to the `layoutProjects([...])` list. Node positions in the 3D scene are
  arranged automatically. `github` and `live` are optional; their buttons only appear when set.
- **"Months in AI" counter:** computed from `bio.aiCareerStart` (`"YYYY-MM"`), so it stays current.
- **Contact form:** the site has no backend, so the form opens the visitor's mail app with the
  message pre-filled to `social.email`.

## Deploy

Deployed on Vercel as a standard Vite project (build command `npm run build`, output `dist`).
