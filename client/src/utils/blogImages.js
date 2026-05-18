export const fallbackImages = {
  AI: "/blog-images/ai.svg",
  "AI for Developers": "/blog-images/ai.svg",
  Career: "/blog-images/career.svg",
  "Career Growth": "/blog-images/career.svg",
  "Interview Tips": "/blog-images/interview.svg",
  "Interview Prep": "/blog-images/interview.svg",
  "MERN Stack": "/blog-images/web-development.svg",
  "Placement Preparation": "/blog-images/placement.svg",
  Programming: "/blog-images/programming.svg",
  Technology: "/blog-images/technology.svg",
  "Web Development": "/blog-images/web-development.svg",
  default: "/blog-images/technology.svg"
};

export const imageForBlog = (blog) => blog?.thumbnail || fallbackImages[blog?.category] || fallbackImages.default;

export const handleImageError = (event, category) => {
  const fallback = fallbackImages[category] || fallbackImages.default;
  if (event.currentTarget.src !== fallback) {
    event.currentTarget.src = fallback;
  }
};
