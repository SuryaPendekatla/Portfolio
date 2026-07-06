export interface Project {
  id: string;
  title: string;
  tag: string;
  description: string;
  details: string;
  tech: string[];
  modelType: 'globe' | 'phone' | 'orb';
  position: [number, number, number];
  github: string;
  live: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface Bio {
  name: string;
  role: string;
  tagline: string;
  experience: string;
  location: string;
  status: string;
  summary: string;
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  description: string;
}

export const portfolioData = {
  bio: {
    name: "SURYA PENDEKATLA",
    role: "AI Product Engineer",
    tagline: "Building intelligent products at the intersection of AI, immersive 3D interfaces, and scalable software systems.",
    experience: "5+ Months Crafting AI Products",
    location: "India",
    status: "Active // Open to Collaborations",
    summary: "I am an AI Product Engineer passionate about crafting intelligent, interactive experiences. I build full-stack applications powered by modern AI tooling, combining React, Three.js, and LLM integrations to create products that are both technically robust and visually stunning."
  } as Bio,

  social: {
    github: "https://github.com/SuryaPendekatla",
    linkedin: "https://www.linkedin.com/in/pendekatla-surya-90158b339",
    twitter: "https://twitter.com/"
  },

  experience: [
    {
      period: "2024 — PRESENT",
      role: "AI Product Engineer",
      company: "Independent / Freelance",
      description: "Building AI-powered products and immersive web experiences using LLMs, React, and Three.js. Focused on bridging intelligent automation with premium UI/UX design."
    },
    {
      period: "2023 — 2024",
      role: "Full-Stack Developer",
      company: "Startup Ecosystem",
      description: "Developed scalable web applications with React and Node.js. Integrated AI APIs to automate workflows and surface insights for end users."
    },
    {
      period: "2022 — 2023",
      role: "Frontend Engineer",
      company: "Product Studio",
      description: "Delivered pixel-perfect UI components, animation systems, and responsive design frameworks. Led the adoption of TypeScript across the codebase."
    }
  ] as Experience[],

  projects: [
    {
      id: "project-1",
      title: "Quantum Core Dashboard",
      tag: "Web App // WebGL",
      description: "A real-time telemetry dashboard visualizing high-throughput distributed server topologies.",
      details: "This application was built to monitor large-scale cloud deployments. It renders network nodes in real-time, mapping over 10,000 active streams. By combining WebSockets with custom WebGL buffer geometries, users can visualize packet transfers and server load changes dynamically without bottlenecking the CPU.",
      tech: ["React", "Three.js", "WebSockets", "Node.js", "TypeScript"],
      modelType: "globe",
      position: [-4.5, 1.2, 0.5],
      github: "https://github.com/",
      live: "https://github.com/"
    },
    {
      id: "project-2",
      title: "HoloFrame Spatial AR",
      tag: "Mobile App // AR",
      description: "An augmented reality mobile interface for spatial mapping and real-time collaborative architecture planning.",
      details: "HoloFrame allows interior designers to map physical rooms and instantly overlay 3D furniture models. It leverages WebXR and React Native wrappers to capture point-cloud data. Design sessions are shared collaboratively over peer-to-peer connections for real-time multiplayer drafting.",
      tech: ["React Native", "Expo", "Three.js", "WebXR", "TypeScript"],
      modelType: "phone",
      position: [0, 2.5, -2],
      github: "https://github.com/",
      live: "https://github.com/"
    },
    {
      id: "project-3",
      title: "Aetherial Nexus Shaders",
      tag: "Graphics // Physics",
      description: "A browser-based WebGL physics engine simulating high-density gravity fields and interactive particle fields.",
      details: "Aetherial Nexus showcases the power of custom GLSL shaders on the web. By moving physics calculations (vector integration, gravity pulls, and boundary collisions) entirely onto the GPU, the engine renders 100,000 particles at a locked 60fps, responding dynamically to cursor gravity pulls.",
      tech: ["WebGL", "GLSL Shaders", "Three.js", "TypeScript", "Vite"],
      modelType: "orb",
      position: [4.5, 1.2, 0.5],
      github: "https://github.com/",
      live: "https://github.com/"
    }
  ] as Project[],

  skills: [
    {
      title: "AI & Product",
      skills: [
        { name: "LLM Integration / Prompt Eng.", level: 90 },
        { name: "AI Product Design", level: 85 },
        { name: "Python / FastAPI", level: 80 },
        { name: "Data Pipelines", level: 70 }
      ]
    },
    {
      title: "Frontend & 3D",
      skills: [
        { name: "React / React Native", level: 95 },
        { name: "Three.js / React Three Fiber", level: 88 },
        { name: "TypeScript", level: 90 },
        { name: "CSS / Animation Systems", level: 85 }
      ]
    },
    {
      title: "Backend & DevOps",
      skills: [
        { name: "Node.js / Express", level: 80 },
        { name: "WebSockets / Realtime", level: 78 },
        { name: "SQL & NoSQL Databases", level: 72 },
        { name: "Git & Deployment", level: 88 }
      ]
    }
  ] as SkillCategory[]
};
