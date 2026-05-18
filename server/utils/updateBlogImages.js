import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Blog from "../models/Blog.js";

dotenv.config();

const imageMap = [
  ["AI Tools in 2026", "/blog-images/ai.svg"],
  ["Google Interview", "/blog-images/interview.svg"],
  ["Resume Tips", "/blog-images/career.svg"],
  ["Python Roadmap", "/blog-images/programming.svg"],
  ["Full Stack Developer Roadmap", "/blog-images/web-development.svg"],
  ["Remote Jobs", "/blog-images/career.svg"],
  ["DSA Preparation", "/blog-images/placement.svg"],
  ["MERN Stack", "/blog-images/technology.svg"],
  ["Portfolio", "/blog-images/career.svg"],
  ["Frontend System Design", "/blog-images/web-development.svg"],
  ["AI Prompting", "/blog-images/ai.svg"],
  ["Backend Authentication", "/blog-images/technology.svg"],
  ["Placement Preparation", "/blog-images/placement.svg"],
  ["JavaScript", "/blog-images/programming.svg"],
  ["Final Year Project", "/blog-images/career.svg"],
  ["React Performance", "/blog-images/web-development.svg"],
  ["System Design", "/blog-images/interview.svg"],
  ["GitHub Profile", "/blog-images/career.svg"],
  ["Data Structures", "/blog-images/programming.svg"],
  ["Blog Content With AI", "/blog-images/ai.svg"],
  ["Developer Portfolio", "/blog-images/career.svg"],
  ["React Interview", "/blog-images/interview.svg"],
  ["MERN Blog Architecture", "/blog-images/web-development.svg"],
  ["Developer Thinking", "/blog-images/ai.svg"]
];

const updateImages = async () => {
  await connectDB();
  let updated = 0;

  for (const [titlePart, thumbnail] of imageMap) {
    await Blog.updateMany(
      { title: new RegExp(titlePart, "i") },
      { $pull: { contentBlocks: { type: "image" } } }
    );
    const result = await Blog.updateMany(
      { title: new RegExp(titlePart, "i") },
      {
        $set: { thumbnail },
        $push: {
          contentBlocks: { type: "image", value: thumbnail, language: "" }
        }
      }
    );
    updated += result.modifiedCount;
  }

  console.log(`Updated images for ${updated} blogs.`);
  process.exit(0);
};

updateImages().catch((error) => {
  console.error(error);
  process.exit(1);
});
