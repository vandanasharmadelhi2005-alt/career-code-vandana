import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Blog from "../models/Blog.js";
import User from "../models/User.js";

dotenv.config();

const articles = [
  ["AI Tools in 2026 Every Student Developer Should Know", "AI", "A practical 2026 guide to copilots, research agents, resume assistants, and coding workflows.", "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80", ["ai", "tools", "2026"], 42, 720, true],
  ["Google Interview Preparation Roadmap for 2026", "Interview Tips", "How to prepare for Google-style coding, system design, behavioral rounds, and project discussions.", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", ["google", "interview", "dsa"], 38, 680, true],
  ["Resume Tips for Tech Freshers in 2026", "Career", "Build a one-page resume that highlights projects, internships, metrics, and proof of skill.", "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80", ["resume", "freshers", "career"], 35, 610, true],
  ["Python Roadmap 2026: From Basics to AI Projects", "Programming", "A beginner-friendly Python path covering syntax, automation, APIs, data, and AI project building.", "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80", ["python", "roadmap", "ai"], 33, 590, true],
  ["Full Stack Developer Roadmap for 2026", "Web Development", "Learn frontend, backend, databases, auth, deployment, testing, and portfolio-ready projects.", "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80", ["fullstack", "mern", "roadmap"], 40, 750, true],
  ["Remote Jobs for Developers in 2026: Skills That Matter", "Career", "What remote teams expect from junior developers: communication, ownership, async updates, and portfolio proof.", "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80", ["remote", "jobs", "career"], 27, 430, false],
  ["DSA Preparation Strategy for Placements in 2026", "Placement Preparation", "A placement-focused DSA plan with topic order, revision loops, mock contests, and interview practice.", "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80", ["dsa", "placements", "interview"], 37, 640, true],
  ["MERN Stack Project Ideas That Impress Recruiters", "Technology", "Build real products with auth, dashboards, payments, file uploads, analytics, and role-based flows.", "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80", ["mern", "projects", "recruiters"], 30, 520, false],
  ["How to Build a Developer Portfolio That Gets Shortlisted", "Career", "Turn your best projects into proof using case studies, screenshots, live demos, and measurable outcomes.", "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80", ["portfolio", "career", "projects"], 31, 540, true],
  ["Frontend System Design for React Developers", "Web Development", "Learn component boundaries, state ownership, data fetching, error states, accessibility, and performance.", "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80", ["react", "frontend", "system-design"], 28, 470, false],
  ["AI Prompting for Coding Interviews and Learning", "AI", "Use AI to practice interviews, explain DSA patterns, review resumes, and generate project test cases.", "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?auto=format&fit=crop&w=1200&q=80", ["ai", "prompts", "learning"], 29, 490, false],
  ["Backend Authentication Checklist for MERN Projects", "Technology", "JWT, refresh tokens, password reset, email verification, role-based routes, and security defaults.", "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80", ["backend", "auth", "security"], 24, 410, false],
  ["Placement Preparation Calendar: 90 Days to Interview Ready", "Placement Preparation", "A 90-day plan for DSA, aptitude, resume, projects, mock interviews, and company applications.", "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80", ["placement", "calendar", "interview"], 26, 450, false],
  ["JavaScript Concepts You Must Know in 2026", "Programming", "Master closures, async JavaScript, modules, arrays, objects, DOM, fetch, and browser performance basics.", "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=1200&q=80", ["javascript", "programming", "frontend"], 34, 580, false],
  ["How to Explain Your Final Year Project Professionally", "Career", "Use problem, users, architecture, features, database, challenges, and impact to present confidently.", "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80", ["presentation", "project", "career"], 22, 390, false],
  ["React Performance Tips for Blog and Dashboard Apps", "Web Development", "Improve perceived speed with pagination, memoization, code splitting, image optimization, and skeleton states.", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", ["react", "performance", "dashboard"], 21, 370, false],
  ["System Design Basics for Freshers", "Interview Tips", "Learn APIs, databases, caching, queues, scaling vocabulary, and how to discuss tradeoffs clearly.", "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80", ["system-design", "interview", "freshers"], 25, 460, false],
  ["GitHub Profile Optimization for Internships", "Career", "Clean repositories, meaningful READMEs, pinned projects, contribution signals, and issue-based learning.", "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80", ["github", "internship", "portfolio"], 19, 330, false],
  ["Data Structures Patterns for Coding Rounds", "Programming", "Sliding window, two pointers, binary search, stacks, graphs, DP, and when to recognize each pattern.", "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=1200&q=80", ["dsa", "patterns", "coding"], 32, 560, false],
  ["How to Create Blog Content With AI and Still Sound Human", "AI", "Use AI for outlines and summaries while keeping examples, opinions, and project context original.", "https://images.unsplash.com/photo-1676277791608-ac54525aa95d?auto=format&fit=crop&w=1200&q=80", ["ai", "blogging", "content"], 23, 410, false]
];

const buildArticle = ([title, category, description, thumbnail, tags, likes, views, featured], index) => ({
  title,
  thumbnail,
  description,
  content: `${description}\n\nIn 2026, recruiters and teams look for practical proof: projects, communication, consistency, and the ability to learn fast.\nUse this guide as a checklist, then apply it to one portfolio project or interview preparation sprint this week.`,
  contentBlocks: [
    { type: "heading", value: "Why this matters in 2026" },
    { type: "paragraph", value: description },
    { type: "bullet", value: "Focus on practical proof, not only theory." },
    { type: "bullet", value: "Turn the topic into a project, checklist, or interview story." },
    { type: "bullet", value: "Measure your progress weekly and keep improving your portfolio." },
    { type: "code", language: "js", value: "const growth = practice + projects + feedback + consistency;" }
  ],
  author: "CareerCoded Editorial",
  category,
  tags,
  featured,
  likes,
  views,
  readTime: 4 + (index % 5),
  isPublished: true
});

const seedAdmin = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || "admin@careercoded.com";
  const existing = await User.findOne({ email });

  if (!existing) {
    await User.create({
      name: process.env.ADMIN_NAME || "CareerCoded Admin",
      email,
      password: process.env.ADMIN_PASSWORD || "Admin12345",
      role: "admin",
      isEmailVerified: true
    });
    console.log(`Admin created: ${email}`);
  } else {
    console.log(`Admin already exists: ${email}`);
  }

  let inserted = 0;
  for (const [index, item] of articles.entries()) {
    const title = item[0];
    const exists = await Blog.exists({ title });
    if (!exists) {
      await Blog.create(buildArticle(item, index));
      inserted += 1;
    }
  }

  console.log(`Seeded ${inserted} new 2026 CareerCoded blogs.`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
