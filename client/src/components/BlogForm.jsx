import { Bot, Code, Heading2, Image, ListPlus, Pilcrow, Save, Sparkles } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";

const emptyBlog = {
  title: "",
  thumbnail: "",
  description: "",
  content: "",
  author: "",
  category: "",
  tags: "",
  readTime: 4,
  featured: false,
  contentBlocks: [],
  isPublished: true
};

const BlogForm = ({ initialBlog, onSubmit, submitting }) => {
  const [form, setForm] = useState(emptyBlog);

  useEffect(() => {
    if (initialBlog) {
      setForm({
        title: initialBlog.title || "",
        thumbnail: initialBlog.thumbnail || "",
        description: initialBlog.description || "",
        content: initialBlog.content || "",
        author: initialBlog.author || "",
        category: initialBlog.category || "",
        tags: initialBlog.tags?.join(", ") || "",
        readTime: initialBlog.readTime || 4,
        featured: initialBlog.featured || false,
        contentBlocks: initialBlog.contentBlocks || [],
        isPublished: initialBlog.isPublished ?? true
      });
    }
  }, [initialBlog]);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  const addBlock = (type) => {
    setForm((current) => ({
      ...current,
      contentBlocks: [...current.contentBlocks, { type, value: "", language: type === "code" ? "js" : "" }]
    }));
  };

  const updateBlock = (index, key, value) => {
    setForm((current) => ({
      ...current,
      contentBlocks: current.contentBlocks.map((block, blockIndex) => (
        blockIndex === index ? { ...block, [key]: value } : block
      ))
    }));
  };

  const removeBlock = (index) => {
    setForm((current) => ({
      ...current,
      contentBlocks: current.contentBlocks.filter((_, blockIndex) => blockIndex !== index)
    }));
  };

  const askAi = async (kind) => {
    if (kind === "title") {
      const topic = form.title || form.category || form.description || "developer career";
      const response = await fetch(`${import.meta.env.VITE_API_URL || "/api"}/blogs/ai/titles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("cc_token")}`
        },
        body: JSON.stringify({ topic })
      });
      const data = await response.json();
      if (data.titles?.[0]) setForm((current) => ({ ...current, title: data.titles[0] }));
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL || "/api"}/blogs/ai/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("cc_token")}`
      },
      body: JSON.stringify({ title: form.title, content: form.content })
    });
    const data = await response.json();
    if (data.summary) setForm((current) => ({ ...current, description: data.summary.slice(0, 280) }));
  };

  return (
    <form className="editor-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          Title
          <input name="title" value={form.title} onChange={update} required minLength="3" />
        </label>
        <label>
          Author
          <input name="author" value={form.author} onChange={update} required />
        </label>
        <label>
          Category
          <input name="category" value={form.category} onChange={update} required />
        </label>
        <label>
          Tags
          <input name="tags" value={form.tags} onChange={update} placeholder="React, Careers, Interview" />
        </label>
        <label>
          Read Time
          <input name="readTime" type="number" min="1" value={form.readTime} onChange={update} />
        </label>
      </div>
      <div className="ai-toolbar">
        <button type="button" onClick={() => askAi("title")}><Sparkles size={16} />AI title suggestion</button>
        <button type="button" onClick={() => askAi("summary")}><Bot size={16} />AI summary</button>
      </div>
      <label>
        Thumbnail Image URL
        <input name="thumbnail" type="url" value={form.thumbnail} onChange={update} required />
      </label>
      <label>
        Short Description
        <textarea name="description" rows="3" value={form.description} onChange={update} maxLength="280" required />
      </label>
      <label>
        Content
        <textarea name="content" rows="12" value={form.content} onChange={update} required minLength="20" />
      </label>
      <div className="rich-editor">
        <div className="rich-toolbar">
          <button type="button" onClick={() => addBlock("heading")}><Heading2 size={16} />Heading</button>
          <button type="button" onClick={() => addBlock("paragraph")}><Pilcrow size={16} />Paragraph</button>
          <button type="button" onClick={() => addBlock("bullet")}><ListPlus size={16} />Bullet</button>
          <button type="button" onClick={() => addBlock("code")}><Code size={16} />Code</button>
          <button type="button" onClick={() => addBlock("image")}><Image size={16} />Image</button>
        </div>
        {form.contentBlocks.map((block, index) => (
          <div className="block-editor" key={`${block.type}-${index}`}>
            <strong>{block.type}</strong>
            {block.type === "code" && (
              <input value={block.language} onChange={(event) => updateBlock(index, "language", event.target.value)} placeholder="Language" />
            )}
            <textarea
              rows={block.type === "code" ? 5 : 3}
              value={block.value}
              onChange={(event) => updateBlock(index, "value", event.target.value)}
              placeholder={block.type === "image" ? "Image URL" : "Write block content"}
            />
            <button type="button" onClick={() => removeBlock(index)}>Remove</button>
          </div>
        ))}
      </div>
      <label className="checkbox-row">
        <input name="featured" type="checkbox" checked={form.featured} onChange={update} />
        Mark as trending/featured
      </label>
      <label className="checkbox-row">
        <input name="isPublished" type="checkbox" checked={form.isPublished} onChange={update} />
        Publish this blog
      </label>
      <button className="primary-btn" type="submit" disabled={submitting}>
        <Save size={18} />
        {submitting ? "Saving..." : "Save Blog"}
      </button>
    </form>
  );
};

export default BlogForm;
