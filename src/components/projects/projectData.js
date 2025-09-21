// Import both .png and .pdf from portfolio folder
const portfolioMedia = Object.values(
  import.meta.glob("../../assets/images/projects/portfolio/*.{png,pdf}", {
    eager: true,
    import: "default",
  })
);

const stocksMedia = Object.values(
  import.meta.glob("../../assets/images/projects/stocks/*.{png,pdf}", {
    eager: true,
    import: "default",
  })
);

const ecommerceMedia = Object.values(
  import.meta.glob("../../assets/images/projects/e-commerce/*.{png,pdf}", {
    eager: true,
    import: "default",
  })
);

const fitnessMedia = Object.values(
  import.meta.glob("../../assets/images/projects/fitness/*.{png,pdf}", {
    eager: true,
    import: "default",
  })
);

const terpiezMedia = Object.values(
  import.meta.glob("../../assets/images/projects/terpiez/*.{png,pdf,mp4}", {
    eager: true,
    import: "default",
  })
);

const sleepMedia = Object.values(
  import.meta.glob("../../assets/images/projects/sleephealth/*.{png,pdf}", {
    eager: true,
    import: "default",
  })
);

// Sample project data
export const projectData = [
  {
    id: 1,
    name: "3D Portfolio Website",
    description:
      "A visually engaging, Pokémon-inspired 3D portfolio website designed and built using React Three Fiber. This project showcases my web development and 3D design skills by integrating interactive 3D models, smooth navigation, and custom UI components. The aesthetic and user experience are influenced by classic Pokémon themes, blending nostalgia with modern web technologies. Blender was used to design and export 3D assets, while TailwindCSS provided a clean, responsive layout.",
    category: "Web Application",
    timeFrame: "2025",
    skills: [
      "React",
      "Three.js",
      "React Three Fiber",
      "TailwindCSS",
      "Blender",
      "UI/UX Design",
    ],
    status: "Completed",
    images: portfolioMedia,
    link: "https://hjang40.github.io/portfolio/",
  },
  {
    id: 2,
    name: "Stock Prediction Tutorial & Model",
    description:
      "Developed a comprehensive, end-to-end tutorial on the data science pipeline using a machine learning approach to stock market prediction. The project showcased technical proficiency in data preprocessing, feature engineering, model training, and evaluation using Python and TensorFlow. Also emphasized collaboration, research, and effective communication of complex ML and AI concepts.",
    category: "Machine Learning",
    timeFrame: "Aug 2024 – Dec 2024",
    skills: [
      "Python",
      "TensorFlow",
      "Pandas",
      "Scikit-learn",
      "Data Visualization",
      "Team Collaboration",
      "Data Analysis",
      "SQL",
    ],
    status: "Completed",
    images: stocksMedia,
    link: "https://cyporg53.github.io/320-final-project/",
  },
  {
    id: 3,
    name: "E-Commerce Website & Business",
    description:
      "Co-Founder & Lead Developer at Brickd Up Studios. Delivered a headless e-commerce site from concept to launch in 4 weeks using Shopify Hydrogen and React. Scored 99 on Google Lighthouse. Eliminated reliance on expensive third-party apps and supported an initial catalog of 120 products.",
    category: "Web Application",
    timeFrame: "Jul 2025 – Present",
    skills: ["Shopify Hydrogen", "React", "Web Performance", "E-Commerce"],
    status: "Ongoing",
    images: ecommerceMedia,
    link: "https://brickdupstudios.com",
  },
  {
    id: 4,
    name: "Health/Fitness App Development",
    description:
      "Co-developed a mobile fitness app using Java & Android Studio, featuring 10+ functions including exercise logs and meal planning. Conducted weekly usability tests with a focus on accessibility and beginner-friendly design.",
    category: "Mobile Application",
    timeFrame: "Aug 2024 – Dec 2024",
    skills: ["Java", "Android Studio", "Mobile Development", "UX Testing"],
    status: "Completed",
    images: fitnessMedia,
    link: "",
  },
  {
    id: 6,
    name: "Terpiez App",
    description:
      "Developed a critter-catching app with real-time location and an interactive map interface using Flutter and Dart. Enhanced interactivity with location-based user engagement features.",
    category: "Mobile Application",
    timeFrame: "Aug 2024 – Dec 2024",
    skills: ["Flutter", "Dart", "Android Studio", "Geolocation"],
    status: "Completed",
    images: terpiezMedia,
    link: "",
  },
  {
    id: 7,
    name: "Public Health Sleep Research",
    description:
      "Explored the effects of sleep on mental and physical health through surveys and analysis of scholarly articles. Conducted real-world data collection among UMD students and examined health message exposure in a global context.",
    category: "Research Project",
    timeFrame: "Sept 12, 2024",
    skills: ["Research", "Survey Design", "Data Analysis", "Public Health"],
    status: "Completed",
    images: sleepMedia,
    link: "",
  },
];

export const MAX_SLOTS = 30;
