export const isPdf = (url) => String(url).toLowerCase().endsWith(".pdf");
export const isVideo = (url) => String(url).toLowerCase().endsWith(".mp4");

const media = (glob) => Object.values(glob);

// Media for each project, in file-name order (the first file is the box thumbnail)
const portfolioMedia = media(import.meta.glob("../../assets/images/projects/portfolio/*.{webp,pdf}", { eager: true, import: "default" }));
const stocksMedia = media(import.meta.glob("../../assets/images/projects/stocks/*.{webp,pdf}", { eager: true, import: "default" }));
const ecommerceMedia = media(import.meta.glob("../../assets/images/projects/e-commerce/*.{webp,pdf}", { eager: true, import: "default" }));
const fitnessMedia = media(import.meta.glob("../../assets/images/projects/fitness/*.{webp,pdf}", { eager: true, import: "default" }));
const terpiezMedia = media(import.meta.glob("../../assets/images/projects/terpiez/*.{webp,pdf,mp4}", { eager: true, import: "default" }));
const sleepMedia = media(import.meta.glob("../../assets/images/projects/sleephealth/*.{webp,pdf}", { eager: true, import: "default" }));
// Ledger and job tracker screenshots use sample data, not real accounts
const ledgerMedia = media(import.meta.glob("../../assets/images/projects/ledger/*.{webp,pdf}", { eager: true, import: "default" }));
const jobTrackerMedia = media(import.meta.glob("../../assets/images/projects/job-tracker/*.{webp,pdf}", { eager: true, import: "default" }));
// Game renders and the final report only; no course code is published
const gameMedia = media(import.meta.glob("../../assets/images/projects/game/*.{webp,pdf}", { eager: true, import: "default" }));
// CMSC330 projects show title cards only; no course code is published
const regexMedia = media(import.meta.glob("../../assets/images/projects/regex-engine/*.{webp,pdf}", { eager: true, import: "default" }));
const lambdaMedia = media(import.meta.glob("../../assets/images/projects/lambda-interpreter/*.{webp,pdf}", { eager: true, import: "default" }));
const spellcheckMedia = media(import.meta.glob("../../assets/images/projects/rust-spellcheck/*.{webp,pdf}", { eager: true, import: "default" }));
const ribosomeMedia = media(import.meta.glob("../../assets/images/projects/ribosome/*.{webp,pdf}", { eager: true, import: "default" }));
const dietMedia = media(import.meta.glob("../../assets/images/projects/diet-planner/*.{webp,pdf,mp4}", { eager: true, import: "default" }));
// Title cards only for these class projects; no course code is published
const atmMedia = media(import.meta.glob("../../assets/images/projects/secure-atm/*.{webp,pdf}", { eager: true, import: "default" }));
const aiMedia = media(import.meta.glob("../../assets/images/projects/ai-agents/*.{webp,pdf}", { eager: true, import: "default" }));
const resilienceMedia = media(import.meta.glob("../../assets/images/projects/resilience-study/*.{webp,pdf}", { eager: true, import: "default" }));
const yodaMedia =media(import.meta.glob("../../assets/images/projects/yoda-speak/*.{webp,pdf}", { eager: true, import: "default" }));

export const projectData = [
  {
    id: 1,
    name: "3D Portfolio Website",
    description:
      "My portfolio site, this site. I built it with React and React Three Fiber as well as ThreeJS and styled it after Pokémon: I cut the 3D models from about 56 MB to under 4 MB with Draco and WebP compression so they load fast. AI tools helped facilitate building it.",
    category: "Web Application",
    timeFrame: "2025 – Present",
    skills: ["React", "React Three Fiber", "Three.js", "Tailwind CSS", "Vite", "3D Optimization"],
    status: "Ongoing",
    images: portfolioMedia,
    link: "https://hjang40.github.io/portfolio/",
  },
  {
    id: 8,
    name: "Ledger: Personal Finance Tracker",
    description:
      "A personal finance tracker I built and use for my own money. It has a React and Recharts front end and an Express and MongoDB API, with GitHub sign-in and hosting on Render. It tracks spending against monthly budgets, savings goals and recurring bills, and projects where each month will end up. Money is stored as whole cents so totals never drift, and the database is backed up every week through GitHub Actions. AI tools helped facilitate building it. Screenshots use sample data.",
    category: "Web Application",
    timeFrame: "Oct 2026 – Present",
    skills: ["React", "Vite", "Recharts", "Express", "MongoDB", "OAuth / JWT", "GitHub Actions", "Render"],
    status: "Ongoing",
    images: ledgerMedia,
    link: "",
  },
  {
    id: 9,
    name: "Job Application Tracker",
    description:
      "A tracker I built for my own job search. It logs each application with its status, salary range and posting link, shows the whole pipeline at a glance, and charts response rates and applications per week. It runs on React, Express and MongoDB with GitHub sign-in, rate limiting and security headers, and exports to CSV. AI tools helped facilitate building it. Screenshots use sample data.",
    category: "Web Application",
    timeFrame: "Sep 2026 – Present",
    skills: ["React", "Recharts", "Express", "MongoDB", "OAuth / JWT", "API Security"],
    status: "Ongoing",
    images: jobTrackerMedia,
    link: "",
  },
  {
    id: 2,
    name: "Stock Market Prediction with LSTMs",
    description:
      "A data science final project I built with two classmates. We cleaned a Kaggle dataset of over 100,000 daily prices from 12 stock exchanges going back to 1965, engineered percent-change features, and trained an LSTM in TensorFlow to predict next-day opening and closing prices. We published the whole pipeline as a step-by-step tutorial.",
    category: ["Machine Learning", "School"],
    timeFrame: "Jan – May 2024",
    skills: ["Python", "Pandas", "TensorFlow", "PyTorch", "scikit-learn", "Matplotlib", "Data Visualization"],
    status: "Completed",
    images: stocksMedia,
    link: "https://cyporg53.github.io/320-final-project/",
  },
  {
    id: 17,
    name: "Game-Playing & Learning Agents",
    description:
      "A class project for UMD's artificial intelligence course (CMSC421), in Python. The first half plays Nim with minimax and alpha-beta pruning. The second half trains agents on a Treasure Island grid world modeled as a Markov decision process, using temporal-difference learning and Q-learning. I compared sparse, distance-based and custom reward functions over 1,000 to 10,000 trials and found the distance-based rewards converged on a good policy fastest.",
    category: ["Machine Learning", "School"],
    timeFrame: "Spring 2025",
    skills: ["Python", "Reinforcement Learning", "Q-Learning", "Markov Decision Processes", "Game Search"],
    status: "Completed",
    images: aiMedia,
    link: "",
  },
  {
    id: 3,
    name: "E-Commerce Website",
    description:
      "A fully custom headless Shopify storefront I built for my friends at Brickd Up Studios with Hydrogen, React, and Tailwind CSS. It pulls products and inventory through Shopify's Storefront GraphQL API, and it went from first sketch to launch in four weeks with 120 products. It doesn't rely on any paid Shopify apps.",
    category: "Web Application",
    timeFrame: "Jul 2025 – Jan 2026",
    skills: ["Shopify Hydrogen", "React", "Tailwind CSS", "GraphQL", "Web Performance"],
    status: "Completed",
    images: ecommerceMedia,
    link: "https://brickdupstudios.com",
  },
  {
    id: 15,
    name: "Jedi Pomodoro (Yoda Speak)",
    description:
      "A group project for UMD's web application development course (CMSC335), built with one teammate: a Star Wars–themed Pomodoro timer. You set your focus and break lengths, and motivational quotes cycle on screen in Yoda-speak while you work. Anyone can add a quote, which is translated through the Yoda Translator API and saved to MongoDB. It runs on Node and Express and is deployed on Render. AI tools helped facilitate building it.",
    category: ["Web Application", "School"],
    timeFrame: "Apr – May 2026",
    skills: ["Node.js", "Express", "MongoDB", "REST APIs", "JavaScript", "Render"],
    status: "Completed",
    images: yodaMedia,
    link: "https://yodaspeakwebsite.onrender.com",
  },
  {
    id: 10,
    name: "3C&1J: 3D Bullet Hell Game",
    description:
      "A team project for UMD's game programming class: a 3D bullet-hell roguelike built in Unity with three teammates. You fight through a combat stage, an optional parkour level and a two-phase boss, and after each level you pick a stat upgrade or a new ability. Under the hood it pools bullets instead of creating and destroying them, uses ScriptableObjects for items, and raycasts to fade out walls that block the camera.",
    category: ["Game Development", "School"],
    timeFrame: "Jan – May 2026",
    skills: ["Unity", "C#", "Game Design", "Object Pooling", "Team Collaboration"],
    status: "Completed",
    images: gameMedia,
    link: "",
  },
  {
    id: 18,
    name: "Secure ATM & Bank Protocol",
    description:
      "A team project for UMD's computer and network security course (CMSC414): an ATM and a bank written in C that talk through a router an attacker controls. We designed the protocol ourselves. Every message is encrypted and authenticated with AES-GCM using a fresh random nonce, PINs are stored as salted SHA-256 hashes and compared in constant time, and sequence numbers stop replayed messages. In the second phase I attacked another team's system on my own to find holes in their design.",
    category: ["Security", "School"],
    timeFrame: "Fall 2025",
    skills: ["C", "OpenSSL", "Cryptography", "Protocol Design", "Penetration Testing"],
    status: "Completed",
    images: atmMedia,
    link: "",
  },
  {
    id: 4,
    name: "Health/Fitness App",
    description:
      "A group project for a human-computer interaction class: an Android fitness app built in Java with more than 10 features, including workout logs and meal plans. We focused on accessibility and ran usability tests every week, using what we learned to make the app easier for beginners.",
    category: ["Mobile Application", "School"],
    timeFrame: "Aug – Dec 2024",
    skills: ["Java", "Android Studio", "HCI", "Accessibility", "Usability Testing"],
    status: "Completed",
    images: fitnessMedia,
    link: "",
  },
  {
    id: 6,
    name: "Terpiez App",
    description:
      "A class project for a mobile app development course: a critter-catching game I built on my own in Flutter. It tracks your location with GPS and shows you and nearby critters on a live map. It loads the starting critter data from a university server and saves your progress on the device as JSON.",
    category: ["Mobile Application", "School"],
    timeFrame: "Aug – Dec 2024",
    skills: ["Flutter", "Dart", "Android Studio", "Geolocation", "Maps"],
    status: "Completed",
    images: terpiezMedia,
    link: "",
  },
  {
    id: 16,
    name: "Diet & Workout Planner",
    description:
      "A group project for UMD's mobile app development course (CMSC436), built in Flutter with four teammates. It tracks meals and workouts side by side: you log meals and calories, plan exercises by muscle group with sets and weight, take photos of meals, and see daily and weekly summaries in charts. Data is saved on the device, reminders come through local notifications, and exercise and ingredient lists come from outside APIs.",
    category: ["Mobile Application", "School"],
    timeFrame: "Aug – Dec 2024",
    skills: ["Flutter", "Dart", "Provider", "REST APIs", "Local Storage", "Charts"],
    status: "Completed",
    images: dietMedia,
    link: "",
  },
  {
    id: 11,
    name: "Regular Expression Engine",
    description:
      "A class project for UMD's programming languages course (CMSC330), built twice: first in Python, then again in OCaml. It turns a regular expression into an NFA, converts the NFA into an equivalent DFA with the subset construction, and uses either machine to accept or reject input strings. The OCaml version can also draw the automata with Graphviz.",
    category: ["Programming Languages", "School"],
    timeFrame: "Sep – Oct 2023",
    skills: ["Python", "OCaml", "Automata", "Regular Expressions", "Functional Programming"],
    status: "Completed",
    images: regexMedia,
    link: "",
  },
  {
    id: 12,
    name: "Lambda Calculus Interpreter",
    description:
      "A class project for UMD's programming languages course (CMSC330), written in OCaml. A hand-written lexer and recursive-descent parser turn source text into a syntax tree, both for lambda calculus and for a small English-like language that gets converted into it. The evaluator handles alpha-conversion and can reduce expressions either lazily or eagerly.",
    category: ["Programming Languages", "School"],
    timeFrame: "Nov 2023",
    skills: ["OCaml", "Interpreters", "Parsing", "Functional Programming"],
    status: "Completed",
    images: lambdaMedia,
    link: "",
  },
  {
    id: 13,
    name: "Rust Spell Checker",
    description:
      "A class project for UMD's programming languages course (CMSC330): a command-line spell checker in Rust. It loads a dictionary from a file, scans text with regular expressions to find each word, and either marks unknown words or swaps in a correction. Each correction strategy is its own struct behind a shared trait, and a generic function handles walking the text.",
    category: ["Programming Languages", "School"],
    timeFrame: "Dec 2023",
    skills: ["Rust", "Traits & Generics", "Regular Expressions", "CLI Tools"],
    status: "Completed",
    images: spellcheckMedia,
    link: "",
  },
  {
    id: 14,
    name: "RNA Ribosome Simulator",
    description:
      "A class project for UMD's programming languages course (CMSC330), written in Python. It reads codon definitions and command rules from files, then works through RNA sequences like a ribosome, building amino-acid chains and applying special commands that start, stop, delete or swap parts of the chain as it goes.",
    category: ["Programming Languages", "School"],
    timeFrame: "Sep 2023",
    skills: ["Python", "Parsing", "File I/O"],
    status: "Completed",
    images: ribosomeMedia,
    link: "",
  },
  {
    id: 7,
    name: "Public Health Sleep Research",
    description:
      "A group project for a public health class on how sleep affects mental and physical health. We surveyed UMD students, compared what they reported with published studies, and looked at how health messaging about sleep differs around the world.",
    category: ["Research Project", "School"],
    timeFrame: "Fall 2024",
    skills: ["Research", "Survey Design", "Data Analysis", "Public Health"],
    status: "Completed",
    images: sleepMedia,
    link: "",
  },
  {
    id: 19,
    name: "Childhood Social Interaction & Resilience Study",
    description:
      "A research project for UMD's psychology research methods lab (PSYC300). I designed a 2 × 2 factorial experiment run as a Qualtrics survey, where participants were randomly shown a scenario of playing alone or with friends, and their resilience was measured with the Resilience Scale for Adults. I analyzed the 23 responses with a two-way ANOVA in R and wrote it up as an APA report. The effects weren't significant, and the report discusses why and what a better follow-up would change.",
    category: ["Research Project", "School"],
    timeFrame: "Spring 2025",
    skills: ["R", "Experimental Design", "ANOVA", "Qualtrics", "APA Writing"],
    status: "Completed",
    images: resilienceMedia,
    link: "",
  },
];
