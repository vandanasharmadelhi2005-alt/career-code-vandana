import { ArrowRight, BarChart3, BookOpen, BriefcaseBusiness, Code2, Search, Sparkles, Users } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import api from "../services/api";

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    api.get("/blogs/trending/list", { params: { type: "trending", limit: 8 } })
      .then(({ data }) => setTrending(data.blogs || []))
      .catch(() => setTrending([]));
    api.get("/blogs", { params: { limit: 6, sort: "latest" } })
      .then(({ data }) => setLatest(data.blogs || []))
      .catch(() => setLatest([]));
  }, []);

  const featured = useMemo(() => trending[0] || latest[0], [trending, latest]);

  return (
    <>
      <section className="home startup-home">
        <div className="hero startup-hero">
          <div className="hero-copy">
            <span className="eyebrow">CareerCoded professional blogging platform</span>
            <h1>Discover 2026 tech, career, AI, interview, and placement insights.</h1>
            <p>
              A premium full-stack MERN blogging platform with category search, trending articles,
              bookmarks, comments, analytics, rich publishing, and recruiter-ready project polish.
            </p>
            <div className="hero-actions animated-actions">
              <Link className="primary-btn gradient-btn" to="/blogs">
                Explore Trending Blogs
                <ArrowRight size={18} />
              </Link>
              <Link className="secondary-btn glass-btn" to="/admin/dashboard">
                View Dashboard
              </Link>
            </div>
            <div className="hero-stats">
              <span><strong>20+</strong> 2026 articles</span>
              <span><strong>7</strong> focused categories</span>
              <span><strong>AI</strong> editor helpers</span>
            </div>
          </div>
          <div className="hero-panel premium-panel">
            <div><Sparkles /><strong>AI tools in 2026</strong><span>Summaries, title ideas, content recommendations</span></div>
            <div><BriefcaseBusiness /><strong>Career growth</strong><span>Resume, remote jobs, placements, interviews</span></div>
            <div><Code2 /><strong>Programming roadmaps</strong><span>Python, full-stack, DSA, web development</span></div>
            <div><BarChart3 /><strong>Admin analytics</strong><span>Users, views, likes, comments, trends</span></div>
          </div>
        </div>
      </section>

      {featured && (
        <section className="featured-banner">
          <div>
            <span className="eyebrow">Featured article</span>
            <h2>{featured.title}</h2>
            <p>{featured.description}</p>
            <Link className="primary-btn gradient-btn" to={`/blogs/${featured._id}`}>Read featured</Link>
          </div>
          <div className="featured-insights">
            <span>{featured.category}</span>
            <strong>{featured.likes} likes</strong>
            <strong>{featured.views} views</strong>
            <small>{featured.readTime || 4} min read</small>
          </div>
        </section>
      )}

      <section className="section-band">
        <div className="section-heading split-heading">
          <div>
            <span className="eyebrow">Trending this week</span>
            <h2>Most liked, most viewed, and latest blogs</h2>
          </div>
          <Link className="secondary-btn" to="/blogs">Browse all</Link>
        </div>
        <div className="carousel-row">
          {trending.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      </section>

      <section className="category-showcase">
        {["Technology", "Career", "AI", "Programming", "Interview Tips", "Web Development", "Placement Preparation"].map((item) => (
          <Link to={`/blogs?category=${encodeURIComponent(item)}`} key={item}>
            <Search size={17} />
            {item}
          </Link>
        ))}
      </section>

      <section className="section-band">
        <div className="section-heading">
          <span className="eyebrow">Latest articles</span>
          <h2>Fresh guides for builders and job seekers</h2>
        </div>
        <div className="blog-grid">
          {latest.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      </section>

      <section className="newsletter-section">
        <div>
          <BookOpen />
          <h2>Get weekly career and coding insights</h2>
          <p>Join the CareerCoded newsletter for AI tools, interview prep, placement strategy, and full-stack project ideas.</p>
        </div>
        <form>
          <input type="email" placeholder="Enter your email" />
          <button className="primary-btn gradient-btn" type="button">Subscribe</button>
        </form>
      </section>

      <section className="testimonials-section">
        <div><Users /><p>"This looks like a final-year project that recruiters can actually understand."</p><strong>Frontend Intern</strong></div>
        <div><Users /><p>"The analytics, blog workflow, and rich editor make it feel like a real product."</p><strong>MERN Mentor</strong></div>
        <div><Users /><p>"Great mix of career content, AI topics, and placement preparation."</p><strong>Placement Lead</strong></div>
      </section>
    </>
  );
};

export default Home;
