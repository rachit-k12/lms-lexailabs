// ============================================================================
// Mock Data for LexAI Labs LMS
// ============================================================================

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "article" | "quiz";
  isPreview?: boolean;
  videoUrl?: string;
  content?: string; // Markdown content
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  category: "engineering" | "non-engineering";
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  studentsCount: number;
  modules: Module[];
  learningOutcomes: string[];
  includes: { icon: string; label: string }[];
  instructor: {
    name: string;
    role: string;
    bio: string;
    avatar?: string;
  };
}

export interface Instructor {
  name: string;
  role: string;
  bio: string;
  bioPoints?: string[];
  avatar: string;
  credentials: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

// ============================================================================
// Instructor Data
// ============================================================================

export const instructor: Instructor = {
  name: "Puru Kathuria",
  role: "Founder, Lex AI | Former Software Engineer at Google",
  bio: "Former Backend Engineer at Google working on Distributed Systems and AI",
  bioPoints: [
    "At Google, worked on Backend Engineering, Distributed Systems, and AI for Cloud Security products",
    "Teaches Applied AI (Machine Learning, Deep Learning, LLMs) at Lex AI",
    "Previously at MathWorks, focused on self-driving cars, motion planning, and speech recognition",
    "Founded a Deep Learning Book Club, fostering a community of learners",
  ],
  avatar: "https://media.licdn.com/dms/image/v2/D4D03AQGQtno9QlQ5ug/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1715758859402?e=1772064000&v=beta&t=GOyIYDDytPLCRWdXEWX_4s5XF4RBY9WtlpxIdeBwg7g",
  credentials: [
    "Computer Science Engineering with ML & AI focus",
    "Former Software Engineer at Google",
    "Former SWE at MathWorks",
    "Trained 500+ students",
  ],
  socialLinks: {
    linkedin: "https://linkedin.com/in/purukathuria",
    twitter: "https://twitter.com/purukathuria",
    github: "https://github.com/purukathuria",
  },
};

// ============================================================================
// Course Data
// ============================================================================

export const courses: Course[] = [
  // Engineering Courses
  {
    id: "ml-fundamentals",
    title: "Machine Learning Fundamentals",
    description: "Learn the core concepts of machine learning, from linear regression to neural networks and deep learning.",
    longDescription: "This comprehensive course covers everything you need to know to get started with machine learning. From understanding the mathematical foundations to implementing real-world models, you'll gain practical skills that are in high demand across industries.",
    thumbnail: "https://media.gettyimages.com/id/1973239712/photo/digital-brain-connections.jpg?s=612x612&w=0&k=20&c=y8dGTyvzEIk19DzvGbgaekiWqy6aQj_9QFvHXGkAYS4=",
    category: "engineering",
    level: "Intermediate",
    duration: "24 hours",
    studentsCount: 8900,
    learningOutcomes: [
      "Understand supervised and unsupervised learning algorithms",
      "Implement linear regression, decision trees, and neural networks",
      "Apply machine learning to real-world problems",
      "Evaluate and optimize model performance",
      "Work with popular ML libraries like scikit-learn and TensorFlow",
    ],
    includes: [
      { icon: "play", label: "24 hours of video" },
      { icon: "docs", label: "45 lessons" },
      { icon: "code", label: "12 coding exercises" },
      { icon: "checkbox", label: "5 quizzes" },
      { icon: "award", label: "Certificate of completion" },
    ],
    instructor,
    modules: [
      {
        id: "mod-1",
        title: "Getting Started",
        description: "Introduction to machine learning concepts",
        lessons: [
          { id: "l-1", title: "Welcome to the Course", duration: "5 min", type: "video", isPreview: true },
          { id: "l-2", title: "What is Machine Learning?", duration: "15 min", type: "video", isPreview: true },
          { id: "l-3", title: "Setting Up Your Environment", duration: "20 min", type: "article" },
        ],
      },
      {
        id: "mod-2",
        title: "Supervised Learning",
        description: "Learn regression and classification techniques",
        lessons: [
          { id: "l-4", title: "Linear Regression Explained", duration: "25 min", type: "video" },
          { id: "l-5", title: "Implementing Linear Regression", duration: "30 min", type: "video" },
          { id: "l-6", title: "Classification Algorithms", duration: "20 min", type: "article" },
          { id: "l-7", title: "Module Quiz", duration: "15 min", type: "quiz" },
        ],
      },
      {
        id: "mod-3",
        title: "Neural Networks",
        description: "Deep dive into neural network architecture",
        lessons: [
          { id: "l-8", title: "Introduction to Neural Networks", duration: "20 min", type: "video" },
          { id: "l-9", title: "Building Your First Neural Network", duration: "35 min", type: "video" },
          { id: "l-10", title: "Training and Optimization", duration: "25 min", type: "video" },
        ],
      },
    ],
  },
  {
    id: "python-data-science",
    title: "Python for Data Science",
    description: "Master Python programming for data analysis, visualization, and machine learning applications.",
    longDescription: "From basics to advanced data manipulation, this course teaches you Python in the context of data science. Learn pandas, numpy, matplotlib, and more.",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=600&fit=crop",
    category: "engineering",
    level: "Beginner",
    duration: "20 hours",
    studentsCount: 12400,
    learningOutcomes: [
      "Write clean and efficient Python code",
      "Manipulate data with pandas and numpy",
      "Create stunning visualizations with matplotlib and seaborn",
      "Perform exploratory data analysis",
    ],
    includes: [
      { icon: "play", label: "20 hours of video" },
      { icon: "docs", label: "38 lessons" },
      { icon: "code", label: "15 coding exercises" },
      { icon: "checkbox", label: "4 quizzes" },
      { icon: "award", label: "Certificate of completion" },
    ],
    instructor,
    modules: [
      {
        id: "mod-1",
        title: "Python Basics",
        description: "Learn Python fundamentals",
        lessons: [
          { id: "l-1", title: "Introduction to Python", duration: "10 min", type: "video", isPreview: true },
          { id: "l-2", title: "Variables and Data Types", duration: "20 min", type: "video" },
          { id: "l-3", title: "Control Flow", duration: "25 min", type: "video" },
        ],
      },
      {
        id: "mod-2",
        title: "Data Manipulation",
        description: "Work with pandas and numpy",
        lessons: [
          { id: "l-4", title: "Introduction to Pandas", duration: "30 min", type: "video" },
          { id: "l-5", title: "DataFrames Deep Dive", duration: "35 min", type: "video" },
          { id: "l-6", title: "NumPy for Numerical Computing", duration: "25 min", type: "video" },
        ],
      },
    ],
  },
  {
    id: "deep-learning",
    title: "Deep Learning Specialization",
    description: "Advanced deep learning techniques including CNNs, RNNs, transformers, and generative models.",
    longDescription: "Take your AI skills to the next level with this advanced deep learning course covering state-of-the-art architectures.",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop",
    category: "engineering",
    level: "Advanced",
    duration: "32 hours",
    studentsCount: 5600,
    learningOutcomes: [
      "Build convolutional neural networks for computer vision",
      "Implement recurrent neural networks for sequence data",
      "Understand and apply transformer architectures",
      "Create generative models like GANs and VAEs",
    ],
    includes: [
      { icon: "play", label: "32 hours of video" },
      { icon: "docs", label: "52 lessons" },
      { icon: "code", label: "20 projects" },
      { icon: "checkbox", label: "8 quizzes" },
      { icon: "award", label: "Certificate of completion" },
    ],
    instructor,
    modules: [
      {
        id: "mod-1",
        title: "Convolutional Neural Networks",
        description: "Computer vision fundamentals",
        lessons: [
          { id: "l-1", title: "CNN Architecture", duration: "25 min", type: "video", isPreview: true },
          { id: "l-2", title: "Image Classification", duration: "35 min", type: "video" },
          { id: "l-3", title: "Object Detection", duration: "40 min", type: "video" },
        ],
      },
    ],
  },
  {
    id: "ai-ethics",
    title: "AI Ethics & Responsible AI",
    description: "Understand the ethical implications of AI and learn to build responsible AI systems.",
    longDescription: "As AI becomes more prevalent, understanding ethics and responsibility is crucial for every practitioner.",
    thumbnail: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
    category: "engineering",
    level: "Beginner",
    duration: "12 hours",
    studentsCount: 3200,
    learningOutcomes: [
      "Identify ethical concerns in AI systems",
      "Implement fairness and bias detection",
      "Design transparent and explainable AI",
      "Navigate AI regulations and compliance",
    ],
    includes: [
      { icon: "play", label: "12 hours of video" },
      { icon: "docs", label: "24 lessons" },
      { icon: "checkbox", label: "6 quizzes" },
      { icon: "award", label: "Certificate of completion" },
    ],
    instructor,
    modules: [
      {
        id: "mod-1",
        title: "Introduction to AI Ethics",
        lessons: [
          { id: "l-1", title: "Why AI Ethics Matters", duration: "15 min", type: "video", isPreview: true },
          { id: "l-2", title: "Historical Context", duration: "20 min", type: "video" },
        ],
      },
    ],
  },
  {
    id: "mlops-production",
    title: "MLOps & Production ML",
    description: "Learn to deploy, monitor, and scale machine learning models in production environments.",
    longDescription: "Master the art of taking ML models from notebooks to production. Learn CI/CD for ML, model monitoring, feature stores, and scaling strategies.",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
    category: "engineering",
    level: "Advanced",
    duration: "28 hours",
    studentsCount: 4200,
    learningOutcomes: [
      "Deploy ML models using Docker and Kubernetes",
      "Implement CI/CD pipelines for machine learning",
      "Monitor model performance and detect drift",
      "Build and manage feature stores",
    ],
    includes: [
      { icon: "play", label: "28 hours of video" },
      { icon: "docs", label: "42 lessons" },
      { icon: "code", label: "15 projects" },
      { icon: "checkbox", label: "6 quizzes" },
      { icon: "award", label: "Certificate of completion" },
    ],
    instructor,
    modules: [
      {
        id: "mod-1",
        title: "Introduction to MLOps",
        description: "Understanding the MLOps landscape",
        lessons: [
          { id: "l-1", title: "What is MLOps?", duration: "15 min", type: "video", isPreview: true },
          { id: "l-2", title: "ML Lifecycle Management", duration: "25 min", type: "video" },
          { id: "l-3", title: "Setting Up Your MLOps Stack", duration: "30 min", type: "article" },
        ],
      },
    ],
  },
  // Non-Engineering Courses
  {
    id: "ai-product-management",
    title: "AI Product Management",
    description: "Learn to build and manage AI-powered products from ideation to launch.",
    longDescription: "Bridge the gap between technical AI capabilities and business value. Learn to lead AI product initiatives successfully.",
    thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop",
    category: "non-engineering",
    level: "Intermediate",
    duration: "18 hours",
    studentsCount: 4500,
    learningOutcomes: [
      "Define AI product strategy and roadmaps",
      "Work effectively with data science teams",
      "Prioritize AI features based on business impact",
      "Measure and optimize AI product performance",
    ],
    includes: [
      { icon: "play", label: "18 hours of video" },
      { icon: "docs", label: "32 lessons" },
      { icon: "checkbox", label: "5 quizzes" },
      { icon: "award", label: "Certificate of completion" },
    ],
    instructor,
    modules: [
      {
        id: "mod-1",
        title: "AI Product Strategy",
        lessons: [
          { id: "l-1", title: "Introduction to AI PM", duration: "15 min", type: "video", isPreview: true },
          { id: "l-2", title: "Identifying AI Opportunities", duration: "25 min", type: "video" },
        ],
      },
    ],
  },
  {
    id: "ai-for-leaders",
    title: "AI for Business Leaders",
    description: "Strategic AI knowledge for executives and business leaders to drive digital transformation.",
    longDescription: "Make informed decisions about AI investments and lead your organization through AI transformation.",
    thumbnail: "https://images.unsplash.com/photo-1552664688-cf412ec27db2?w=800&h=600&fit=crop",
    category: "non-engineering",
    level: "Beginner",
    duration: "10 hours",
    studentsCount: 6800,
    learningOutcomes: [
      "Understand AI capabilities and limitations",
      "Identify AI opportunities in your organization",
      "Build and lead AI teams",
      "Evaluate AI vendors and solutions",
    ],
    includes: [
      { icon: "play", label: "10 hours of video" },
      { icon: "docs", label: "20 lessons" },
      { icon: "checkbox", label: "4 quizzes" },
      { icon: "award", label: "Certificate of completion" },
    ],
    instructor,
    modules: [
      {
        id: "mod-1",
        title: "AI Fundamentals for Leaders",
        lessons: [
          { id: "l-1", title: "What Every Leader Should Know", duration: "20 min", type: "video", isPreview: true },
          { id: "l-2", title: "AI Use Cases Across Industries", duration: "30 min", type: "video" },
        ],
      },
    ],
  },
  {
    id: "ai-design",
    title: "AI-Powered Design",
    description: "Learn to leverage AI tools and techniques in your design workflow.",
    longDescription: "From generative design to AI-assisted prototyping, discover how AI is revolutionizing the design industry.",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    category: "non-engineering",
    level: "Intermediate",
    duration: "16 hours",
    studentsCount: 3900,
    learningOutcomes: [
      "Use AI tools for design ideation",
      "Create AI-generated assets and graphics",
      "Design intuitive AI-powered interfaces",
      "Prototype with AI assistance",
    ],
    includes: [
      { icon: "play", label: "16 hours of video" },
      { icon: "docs", label: "28 lessons" },
      { icon: "code", label: "8 projects" },
      { icon: "award", label: "Certificate of completion" },
    ],
    instructor,
    modules: [
      {
        id: "mod-1",
        title: "AI Design Tools",
        lessons: [
          { id: "l-1", title: "Introduction to AI in Design", duration: "15 min", type: "video", isPreview: true },
          { id: "l-2", title: "Generative Design Basics", duration: "25 min", type: "video" },
        ],
      },
    ],
  },
  {
    id: "ai-marketing",
    title: "AI Marketing Mastery",
    description: "Leverage AI to supercharge your marketing campaigns and customer engagement.",
    longDescription: "Learn to use AI for personalization, content creation, analytics, and campaign optimization.",
    thumbnail: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=600&fit=crop",
    category: "non-engineering",
    level: "Beginner",
    duration: "14 hours",
    studentsCount: 5200,
    learningOutcomes: [
      "Implement AI-powered personalization",
      "Use AI for content creation and optimization",
      "Build predictive marketing models",
      "Automate marketing workflows with AI",
    ],
    includes: [
      { icon: "play", label: "14 hours of video" },
      { icon: "docs", label: "26 lessons" },
      { icon: "checkbox", label: "5 quizzes" },
      { icon: "award", label: "Certificate of completion" },
    ],
    instructor,
    modules: [
      {
        id: "mod-1",
        title: "AI in Marketing",
        lessons: [
          { id: "l-1", title: "The AI Marketing Revolution", duration: "15 min", type: "video", isPreview: true },
          { id: "l-2", title: "AI Tools for Marketers", duration: "25 min", type: "video" },
        ],
      },
    ],
  },
];

// Helper functions
export function getCourseById(id: string): Course | undefined {
  return courses.find(course => course.id === id);
}

export function getCoursesByCategory(category: "engineering" | "non-engineering"): Course[] {
  return courses.filter(course => course.category === category);
}

export function getFeaturedCourses(count: number = 3): Course[] {
  return courses.slice(0, count);
}

export function getLessonById(courseId: string, lessonId: string): Lesson | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;

  for (const module of course.modules) {
    const lesson = module.lessons.find(l => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getAdjacentLessons(courseId: string, lessonId: string): { prev?: Lesson; next?: Lesson } {
  const course = getCourseById(courseId);
  if (!course) return {};

  const allLessons: Lesson[] = [];
  for (const module of course.modules) {
    allLessons.push(...module.lessons);
  }

  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  if (currentIndex === -1) return {};

  return {
    prev: currentIndex > 0 ? allLessons[currentIndex - 1] : undefined,
    next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : undefined,
  };
}

// Sample markdown content for lessons
export const lessonContent: Record<string, string> = {
  "l-1": `# Welcome to Machine Learning Fundamentals

Welcome to this comprehensive course on Machine Learning! In this course, you'll learn everything you need to know to get started with ML. Whether you're a software engineer looking to add ML skills to your toolkit, or a data analyst wanting to understand predictive modeling, this course will give you a solid foundation.

## What You'll Learn

In this course, we'll cover a wide range of topics that form the foundation of modern machine learning:

- Core machine learning concepts and terminology
- How to prepare and process data for ML models
- Building and training various types of models
- Evaluating and improving model performance
- Best practices for deploying models in production
- Common pitfalls and how to avoid them

## Course Structure

This course is divided into three main modules:

1. **Getting Started** - Introduction and setup
2. **Supervised Learning** - Regression and classification
3. **Neural Networks** - Deep learning fundamentals

Each module contains video lessons, hands-on coding exercises, and quizzes to test your understanding. We recommend completing the modules in order, as each one builds on the concepts from the previous sections.

## Why Machine Learning Matters

Machine learning is transforming every industry. From healthcare to finance, retail to manufacturing, organizations are using ML to:

- **Automate decision-making** - Reduce manual effort and increase consistency
- **Discover patterns** - Find insights that humans might miss
- **Personalize experiences** - Tailor products and services to individual users
- **Predict outcomes** - Forecast trends and behaviors with greater accuracy

## Prerequisites

Before starting this course, you should have:

- Basic Python programming knowledge
- Understanding of basic mathematics (algebra, statistics)
- A computer with Python 3.8+ installed
- Familiarity with data structures like lists, dictionaries, and arrays
- Some experience with pandas or similar data manipulation tools is helpful but not required

## How to Get the Most Out of This Course

Here are some tips for success:

1. **Code along** - Don't just watch the videos, actually type out the code yourself
2. **Take notes** - Write down key concepts in your own words
3. **Ask questions** - Use the community forums to get help when stuck
4. **Practice daily** - Even 30 minutes a day is better than occasional long sessions
5. **Build projects** - Apply what you learn to your own datasets and problems

## Resources and Support

Throughout this course, you'll have access to:

- Downloadable Jupyter notebooks for each lesson
- Sample datasets for hands-on practice
- Community discussion forums
- Weekly live Q&A sessions with instructors

Let's get started on your machine learning journey!
`,
  "l-2": `# What is Machine Learning?

Machine learning is a subset of artificial intelligence that enables computers to learn from data without being explicitly programmed.

## Types of Machine Learning

### Supervised Learning

In supervised learning, the algorithm learns from labeled training data. Examples include:

- **Regression** - Predicting continuous values
- **Classification** - Predicting categories

\`\`\`python
from sklearn.linear_model import LinearRegression

# Create a simple linear regression model
model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
\`\`\`

### Unsupervised Learning

Unsupervised learning works with unlabeled data to find patterns:

- **Clustering** - Grouping similar data points
- **Dimensionality Reduction** - Reducing features

### Reinforcement Learning

The agent learns by interacting with an environment and receiving rewards.

## Real-World Applications

Machine learning is used in many applications:

| Application | Type | Example |
|------------|------|---------|
| Spam Detection | Classification | Email filtering |
| Stock Prediction | Regression | Financial forecasting |
| Customer Segmentation | Clustering | Marketing |
| Recommendation Systems | Collaborative Filtering | Netflix, Amazon |

## Key Takeaways

> Machine learning is about finding patterns in data and using those patterns to make predictions or decisions.
`,
  "l-3": `# Setting Up Your Environment

This guide will help you set up your development environment for machine learning.

## Installing Python

First, make sure you have Python 3.8 or later installed:

\`\`\`bash
python --version
\`\`\`

## Creating a Virtual Environment

It's best practice to use a virtual environment:

\`\`\`bash
# Create a virtual environment
python -m venv ml-env

# Activate it (Linux/Mac)
source ml-env/bin/activate

# Activate it (Windows)
ml-env\\Scripts\\activate
\`\`\`

## Installing Required Packages

Install the essential packages:

\`\`\`bash
pip install numpy pandas scikit-learn matplotlib jupyter
\`\`\`

## Package Overview

| Package | Purpose |
|---------|---------|
| NumPy | Numerical computing |
| Pandas | Data manipulation |
| Scikit-learn | ML algorithms |
| Matplotlib | Visualization |
| Jupyter | Interactive notebooks |

## Verifying Installation

Run this Python script to verify everything works:

\`\`\`python
import numpy as np
import pandas as pd
import sklearn
import matplotlib.pyplot as plt

print(f"NumPy version: {np.__version__}")
print(f"Pandas version: {pd.__version__}")
print(f"Scikit-learn version: {sklearn.__version__}")
print("All packages installed successfully!")
\`\`\`

## Next Steps

Now that your environment is ready, you can proceed to the next lesson where we'll start building our first model!
`,
};
