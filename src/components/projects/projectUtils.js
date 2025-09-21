// Simple PDF detection
export const isPdf = (url) => {
  return url && String(url).toLowerCase().includes('.pdf');
};

// Simple video detection
export const isVideo = (url) => {
  return url && String(url).toLowerCase().includes('.mp4');
};

// Get all unique skills from projects
export const getAllSkills = (projects) => {
  return Array.from(new Set(projects.flatMap((p) => p.skills)));
};

// Get all unique categories from projects
export const getAllCategories = (projects) => {
  const allCategories = Array.from(
    new Set(
      projects.flatMap((p) =>
        Array.isArray(p.category) ? p.category : [p.category]
      )
    )
  );
  return ["All", ...allCategories];
};

// Filter projects by category
export const filterProjectsByCategory = (projects, selectedCategory) => {
  if (selectedCategory === "All") {
    return projects;
  }
  return projects.filter((p) =>
    Array.isArray(p.category)
      ? p.category.includes(selectedCategory)
      : p.category === selectedCategory
  );
};

// Get project statistics
export const getProjectStats = (projects) => {
  return [
    {
      label: "Total Projects",
      value: projects.length,
      color: "text-blue-400",
    },
    {
      label: "Completed",
      value: projects.filter((p) => p.status === "Completed").length,
      color: "text-green-400",
    },
    {
      label: "In Progress",
      value: projects.filter((p) => p.status === "In Progress").length,
      color: "text-yellow-400",
    },
    {
      label: "Technologies",
      value: new Set(projects.flatMap((p) => p.skills)).size,
      color: "text-purple-400",
    },
  ];
};

// Get category counts
export const getCategoryCounts = (projects, categories) => {
  return categories.map(category => ({
    category,
    count: category === "All"
      ? projects.length
      : projects.filter((p) =>
          Array.isArray(p.category)
            ? p.category.includes(category)
            : p.category === category
        ).length
  }));
};