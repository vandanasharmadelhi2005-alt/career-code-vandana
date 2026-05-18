import { Flame, Search, SlidersHorizontal } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import api from "../services/api";

const fixedCategories = ["Technology", "Career", "AI", "Programming", "Interview Tips", "Web Development", "Placement Preparation"];

const BlogsList = () => {
  const [params, setParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(params.get("search") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [sort, setSort] = useState("trending");
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const allCategories = useMemo(() => Array.from(new Set([...fixedCategories, ...categories])), [categories]);

  const loadBlogs = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/blogs", {
        params: { search, category, page, limit: 12, sort }
      });
      setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
      setCategories(Array.isArray(data.categories) ? data.categories : []);
      setPagination(data.pagination || { page, pages: 1 });
      const nextParams = {};
      if (search) nextParams.search = search;
      if (category) nextParams.category = category;
      setParams(nextParams, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => loadBlogs(1), 250);
    return () => clearTimeout(timer);
  }, [search, category, sort]);

  useEffect(() => {
    api.get("/blogs/trending/list", { params: { limit: 8 } })
      .then(({ data }) => setTrending(data.blogs || []))
      .catch(() => setTrending([]));
  }, []);

  return (
    <section className="page pro-blogs-page">
      <div className="page-heading blog-hero-small">
        <span className="eyebrow">Professional articles</span>
        <h1>Explore blogs by title, category, and keyword</h1>
        <p className="muted">Search AI tools, Google interviews, resume tips, Python roadmap, full-stack roadmap, remote jobs, DSA, and placements.</p>
      </div>

      <div className="trend-strip premium-strip">
        <Flame size={18} />
        <strong>Trending this week</strong>
        {trending.slice(0, 4).map((item) => <span key={item._id}>{item.title}</span>)}
      </div>

      <div className="category-pills">
        <button className={!category ? "active" : ""} onClick={() => setCategory("")} type="button">All</button>
        {allCategories.map((item) => (
          <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)} type="button">{item}</button>
        ))}
      </div>

      <div className="filters professional-filters">
        <label className="search-box">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title, category, or keyword" />
        </label>
        <label className="select-box">
          <SlidersHorizontal size={18} />
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="trending">Trending</option>
            <option value="liked">Most liked</option>
            <option value="viewed">Most viewed</option>
            <option value="latest">Latest</option>
          </select>
        </label>
      </div>
      {error && <p className="alert">{error}</p>}
      {loading ? (
        <p className="muted">Loading blogs...</p>
      ) : (
        <div className="blog-grid pro-blog-grid">
          {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      )}
      {!loading && blogs.length === 0 && <p className="muted">No blogs found.</p>}
      <div className="pagination">
        <button disabled={pagination.page <= 1} onClick={() => loadBlogs(pagination.page - 1)}>Previous</button>
        <span>Page {pagination.page} of {pagination.pages}</span>
        <button disabled={pagination.page >= pagination.pages} onClick={() => loadBlogs(pagination.page + 1)}>Next</button>
      </div>
    </section>
  );
};

export default BlogsList;
