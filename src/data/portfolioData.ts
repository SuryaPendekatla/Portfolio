export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  tag: string;
  description: string;
  details: string;
  highlights: string[];
  metrics?: ProjectMetric[];
  tech: string[];
  modelType: 'globe' | 'phone' | 'orb';
  position: [number, number, number];
  // Optional — the "Source Code" / "Live Demo" buttons only render when a link is present
  github?: string;
  live?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface Bio {
  name: string;
  role: string;
  focusAreas: string[];
  tagline: string;
  currentCompany: string;
  // "YYYY-MM" — the hero's "Months Building AI" counter is computed from this, so it never goes stale
  aiCareerStart: string;
  location: string;
  status: string;
  summary: string;
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  points: string[];
}

export interface Education {
  period: string;
  title: string;
  institution: string;
  note?: string;
}

type ProjectInput = Omit<Project, 'position'>;

// Arranges project nodes along a shallow crescent (derived from the original 3 hand-placed
// nodes: edges closer to camera + lower, center further back + higher) so the scene scales to
// any project count without manual coordinates. The whole arc is shifted left so it clears the
// "CORE DIAGNOSTICS" HUD sidebar docked on the right.
function layoutProjects(inputs: ProjectInput[]): Project[] {
  const maxSpan = 11;
  const sidebarClearanceOffsetX = -1.3;

  return inputs.map((project, index) => {
    const spacing = inputs.length > 1 ? Math.min(4.5, maxSpan / (inputs.length - 1)) : 0;
    const localX = (index - (inputs.length - 1) / 2) * spacing;
    const z = 0.1235 * localX * localX - 2;
    const y = 2.5 - 0.0642 * localX * localX;

    return {
      ...project,
      position: [localX + sidebarClearanceOffsetX, y, z] as [number, number, number]
    };
  });
}

// Whole months elapsed since a "YYYY-MM" start month (minimum 1)
export function monthsSince(startMonth: string, now: Date = new Date()): number {
  const [year, month] = startMonth.split('-').map(Number);
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  return Math.max(1, months);
}

export const portfolioData = {
  bio: {
    name: "SURYA PENDEKATLA",
    role: "AI Product Engineer",
    focusAreas: ["LLM Applications", "Agentic Workflows", "Generative AI"],
    tagline: "Building LLM-powered features and agentic workflows that turn creative briefs into structured storyboards and prompts for image and video generation.",
    currentCompany: "Induce AI",
    aiCareerStart: "2026-03",
    location: "India",
    status: "Active // Open to Opportunities",
    summary: "AI Product Engineer at Induce AI, an AI filmmaking startup, building LLM-powered features and agentic workflows that transform creative briefs into structured storyboards and prompts for image and video generation. Hands-on experience with Python, LangGraph, OpenAI and Anthropic APIs, alongside PyTorch, scikit-learn, pandas, FastAPI and React. Focused on prototyping, testing, debugging and deploying AI-powered product features."
  } as Bio,

  social: {
    github: "https://github.com/SuryaPendekatla",
    linkedin: "https://www.linkedin.com/in/pendekatla-surya-90158b339",
    email: "pendekatlasurya@gmail.com"
  },

  experience: [
    {
      period: "MAR 2026 — PRESENT",
      role: "AI Product Engineer",
      company: "Induce AI · AI filmmaking startup",
      points: [
        "Build AI-powered product features in Python using OpenAI and Anthropic APIs, working across prototyping, testing, debugging and deployment.",
        "Develop a cinematic AI pipeline that converts creative briefs into structured, shot-by-shot prompts for image and video generation models, including Veo, Kling, Seedance and Wan.",
        "Design multi-step, stateful workflows in LangGraph to break complex creative tasks into manageable stages that are easier to control and debug.",
        "Improve response consistency using structured output formats, reusable prompt templates and iterative testing on practical use cases.",
        "Collaborate with product and engineering teammates to scope features, prototype solutions and iterate on feedback."
      ]
    },
    {
      period: "APR 2024 — MAR 2025",
      role: "Electrical Design Engineer Intern",
      company: "Athul Power Tech Services",
      points: [
        "Designed load banks used to discharge batteries under controlled electrical loads for battery testing.",
        "Contributed to electrical circuit design, applying Electronics and Communication Engineering fundamentals to hardware systems."
      ]
    }
  ] as Experience[],

  education: [
    {
      period: "MAY 2025 — DEC 2025",
      title: "Full Stack Python Development",
      institution: "Codegnan",
      note: "7-month professional training program"
    },
    {
      period: "MAY 2024",
      title: "B.Tech, Electronics and Communication Engineering",
      institution: "Ponnaiyah Ramajayam Institute of Science and Technology (PRIST)",
      note: "CGPA: 7.49 / 10"
    }
  ] as Education[],

  certifications: [
    "Claude course certifications — Anthropic Academy",
    "Prompt Engineering — DeepLearning.AI"
  ],

  projects: layoutProjects([
    {
      id: "shotsense",
      title: "ShotSense",
      tag: "Computer Vision // Full-Stack",
      description: "An AI shot analyzer for filmmakers: detects cuts, classifies shot scale and writes shot breakdowns with video-generation prompts.",
      details: "ShotSense helps filmmakers break down footage: upload a clip and it finds every cut, labels each shot's scale and writes a structured shot breakdown with prompts ready for video-generation models.",
      highlights: [
        "Fine-tuned an ImageNet-pretrained ResNet-18 in PyTorch to classify 7 cinematic shot scales, reaching 57% macro-F1 on a held-out, human-labelled test set — nearly double a scikit-learn HOG + logistic-regression baseline (31%).",
        "Built and deployed a full-stack app that detects cuts in uploaded videos with OpenCV, classifies each shot via ONNX Runtime and uses an LLM to generate structured shot breakdowns and video-generation prompts.",
        "Deployed with JWT auth and one-time demo accounts."
      ],
      metrics: [
        { value: "57%", label: "Macro-F1" },
        { value: "31%", label: "HOG + LR baseline" },
        { value: "7", label: "Shot scales" }
      ],
      tech: ["PyTorch", "scikit-learn", "OpenCV", "ONNX Runtime", "FastAPI", "PostgreSQL", "React", "Docker"],
      modelType: "phone",
      github: "https://github.com/SuryaPendekatla/shotsense",
      live: "https://shotsense.onrender.com"
    },
    {
      id: "cineflow-ai",
      title: "CineFlow AI",
      tag: "Agentic AI // LLM Pipeline",
      description: "An agentic LangGraph pipeline that turns a one-line idea into a story bible, shot list and ready-to-paste video-generation prompts.",
      details: "CineFlow AI takes a one-line idea and expands it, stage by stage, into a story bible, a scene breakdown, a detailed shot list and ready-to-paste video-generation prompts — streaming each stage to the browser as it runs.",
      highlights: [
        "Built a LangGraph pipeline that turns a one-line idea into a story bible, scene breakdown and shot list (shot type, camera movement, lens, lighting, sound), then compiles ready-to-paste prompts for Veo, Kling, Seedance and Wan.",
        "Planned every scene's shots in parallel with LangGraph's Send API, added a reviewer loop that sends flagged scenes back for one revision, and routed stages across Claude, GPT and Gemini with Pydantic structured outputs and graceful fallbacks.",
        "Deployed with real-time stage streaming and a 26-test suite."
      ],
      metrics: [
        { value: "4", label: "Video models" },
        { value: "3", label: "LLM providers" },
        { value: "26", label: "Tests" }
      ],
      tech: ["Python", "LangGraph", "FastAPI", "Pydantic", "Claude API", "GPT API", "Gemini API"],
      modelType: "orb",
      github: "https://github.com/SuryaPendekatla/CineFlow-AI",
      live: "https://cineflow-ai-kp8u.onrender.com"
    },
    {
      id: "corporate-website-revamp",
      title: "AI-First Corporate Website Revamp",
      tag: "Frontend // Web",
      description: "A corporate website rebuilt on a component-driven React and Vite architecture with an animated, responsive interface.",
      details: "A ground-up rebuild of a corporate website around reusable components, smooth motion and fast page loads across devices.",
      highlights: [
        "Rebuilt a corporate website using a component-driven React and Vite architecture with reusable UI components.",
        "Created a responsive animated interface with Framer Motion and worked on page-load performance across devices."
      ],
      tech: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
      modelType: "globe"
    }
    // Add as many more projects here as you like — positions are auto-arranged in layoutProjects()
    // above, no manual coordinates needed. modelType can be "globe" | "phone" | "orb" (repeatable).
  ]),

  skills: [
    {
      title: "AI & LLM",
      skills: [
        "LLM Application Development",
        "Prompt Engineering",
        "Agentic Workflows",
        "LangGraph",
        "OpenAI API",
        "Anthropic (Claude) API",
        "Structured Outputs",
        "Vector Databases"
      ]
    },
    {
      title: "Machine Learning & Data",
      skills: ["PyTorch", "scikit-learn", "pandas", "NumPy", "OpenCV"]
    },
    {
      title: "Generative Video Models",
      skills: ["Veo", "Kling", "Seedance", "Wan"]
    },
    {
      title: "Languages",
      skills: ["Python", "JavaScript", "SQL", "HTML", "CSS"]
    },
    {
      title: "Backend",
      skills: ["FastAPI", "Flask", "REST APIs"]
    },
    {
      title: "Frontend",
      skills: ["React.js", "Vite", "Tailwind CSS", "Framer Motion"]
    },
    {
      title: "Tools",
      skills: ["n8n", "Git", "GitHub", "Postman", "VS Code", "Vercel"]
    }
  ] as SkillCategory[]
};
