export const CATEGORIES = ["All", "Programming", "Design", "Data Science", "Business", "Science", "Literature"]

export const INITIAL_FILTERS = {
  searchQuery: "",
  selectedCategory: "", // Use empty string for 'View All' by default
  viewMode: "grid" as const,
}

export const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  hover: {
    whileHover: { y: -5 },
    transition: { duration: 0.2 },
  },
}
