import { db } from "./db";
import { skillCategories, roadmaps, jobs, mentors, communityGroups } from "@shared/schema";

async function seedDatabase() {
  console.log("Seeding database...");

  try {
    // Seed skill categories
    await db.insert(skillCategories).values([
      { id: 1, name: "Programming & Development", description: "Web dev, mobile apps, software engineering", icon: "fas fa-code" },
      { id: 2, name: "Design & Creative", description: "UI/UX, graphic design, digital art", icon: "fas fa-palette" },
      { id: 3, name: "Data & Analytics", description: "Data science, business intelligence, research", icon: "fas fa-chart-line" },
      { id: 4, name: "Marketing & Communication", description: "Digital marketing, content creation, PR", icon: "fas fa-bullhorn" },
      { id: 5, name: "Business & Finance", description: "Finance, accounting, business strategy", icon: "fas fa-briefcase" },
      { id: 6, name: "Healthcare & Life Sciences", description: "Medical research, biotechnology, healthcare", icon: "fas fa-heart" },
      { id: 7, name: "AI & Machine Learning", description: "Artificial intelligence, deep learning, neural networks", icon: "fas fa-robot" },
      { id: 8, name: "Education & Training", description: "Teaching, course creation, mentoring", icon: "fas fa-graduation-cap" }
    ]).onConflictDoNothing();

    // Seed roadmaps
    await db.insert(roadmaps).values([
      {
        id: 1,
        title: "Full-Stack Web Developer",
        description: "Comprehensive path to becoming a full-stack developer",
        skillCategoryIds: [1],
        steps: [
          { title: "HTML, CSS, JavaScript Fundamentals", description: "Master web basics", duration: "2 months", status: "upcoming" as const },
          { title: "React.js Framework", description: "Modern frontend development", duration: "2 months", status: "upcoming" as const },
          { title: "Node.js & Express.js", description: "Backend development", duration: "2 months", status: "upcoming" as const },
          { title: "Database Management", description: "SQL and NoSQL databases", duration: "1 month", status: "upcoming" as const },
          { title: "Deploy & DevOps", description: "Production deployment", duration: "1 month", status: "upcoming" as const }
        ],
        estimatedDuration: "6-12 months",
        salaryRange: "₹4-8 LPA starting",
        difficulty: "medium"
      },
      {
        id: 2,
        title: "Python Developer",
        description: "Backend development and automation with Python",
        skillCategoryIds: [1],
        steps: [
          { title: "Python Fundamentals", description: "Core programming concepts", duration: "1.5 months", status: "upcoming" as const },
          { title: "Django/Flask Framework", description: "Web application development", duration: "2 months", status: "upcoming" as const },
          { title: "API Development", description: "REST APIs and microservices", duration: "1.5 months", status: "upcoming" as const },
          { title: "Database Integration", description: "PostgreSQL, MongoDB", duration: "1 month", status: "upcoming" as const },
          { title: "Testing & Deployment", description: "Unit testing and CI/CD", duration: "1 month", status: "upcoming" as const }
        ],
        estimatedDuration: "5-9 months",
        salaryRange: "₹3.5-7 LPA starting",
        difficulty: "medium"
      },
      {
        id: 3,
        title: "Mobile App Developer",
        description: "Cross-platform mobile application development",
        skillCategoryIds: [1],
        steps: [
          { title: "Mobile Development Fundamentals", description: "iOS/Android basics", duration: "2 months", status: "upcoming" as const },
          { title: "React Native/Flutter", description: "Cross-platform framework", duration: "3 months", status: "upcoming" as const },
          { title: "API Integration", description: "Backend connectivity", duration: "1 month", status: "upcoming" as const },
          { title: "App Store Deployment", description: "Publishing to stores", duration: "1 month", status: "upcoming" as const },
          { title: "Performance Optimization", description: "App optimization", duration: "1 month", status: "upcoming" as const }
        ],
        estimatedDuration: "6-10 months",
        salaryRange: "₹4-9 LPA starting",
        difficulty: "medium"
      },
      {
        id: 4,
        title: "AI/ML Engineer",
        description: "Artificial Intelligence and Machine Learning specialist",
        skillCategoryIds: [7, 3],
        steps: [
          { title: "Python & Mathematics", description: "Programming and math foundations", duration: "2 months", status: "upcoming" as const },
          { title: "Machine Learning Basics", description: "Algorithms and concepts", duration: "3 months", status: "upcoming" as const },
          { title: "Deep Learning", description: "Neural networks and frameworks", duration: "3 months", status: "upcoming" as const },
          { title: "Computer Vision/NLP", description: "Specialization areas", duration: "2 months", status: "upcoming" as const },
          { title: "MLOps & Deployment", description: "Production ML systems", duration: "2 months", status: "upcoming" as const }
        ],
        estimatedDuration: "8-15 months",
        salaryRange: "₹6-15 LPA starting",
        difficulty: "hard"
      },
      {
        id: 5,
        title: "Data Scientist",
        description: "Extract insights from data and build predictive models",
        skillCategoryIds: [3, 7],
        steps: [
          { title: "Statistics & Mathematics", description: "Statistical foundations", duration: "2 months", status: "upcoming" as const },
          { title: "Python for Data Science", description: "Pandas, NumPy, Matplotlib", duration: "2 months", status: "upcoming" as const },
          { title: "Machine Learning", description: "Supervised and unsupervised learning", duration: "3 months", status: "upcoming" as const },
          { title: "Data Visualization", description: "Tableau, Power BI, Plotly", duration: "1.5 months", status: "upcoming" as const },
          { title: "Big Data Tools", description: "Spark, Hadoop, cloud platforms", duration: "2 months", status: "upcoming" as const }
        ],
        estimatedDuration: "7-12 months",
        salaryRange: "₹5-12 LPA starting",
        difficulty: "hard"
      },
      {
        id: 6,
        title: "Digital Marketing Specialist",
        description: "Comprehensive digital marketing and growth strategy",
        skillCategoryIds: [4],
        steps: [
          { title: "Digital Marketing Fundamentals", description: "SEO, SEM, social media basics", duration: "1.5 months", status: "upcoming" as const },
          { title: "Content Marketing", description: "Content strategy and creation", duration: "2 months", status: "upcoming" as const },
          { title: "Google Ads & Analytics", description: "Paid advertising and analytics", duration: "2 months", status: "upcoming" as const },
          { title: "Social Media Marketing", description: "Platform-specific strategies", duration: "1.5 months", status: "upcoming" as const },
          { title: "Marketing Automation", description: "Tools and campaign optimization", duration: "1 month", status: "upcoming" as const }
        ],
        estimatedDuration: "4-8 months",
        salaryRange: "₹2.5-6 LPA starting",
        difficulty: "easy"
      },
      {
        id: 7,
        title: "Financial Analyst",
        description: "Corporate finance and investment analysis",
        skillCategoryIds: [5],
        steps: [
          { title: "Financial Fundamentals", description: "Accounting and finance basics", duration: "2 months", status: "upcoming" as const },
          { title: "Excel & Financial Modeling", description: "Advanced Excel and modeling", duration: "2 months", status: "upcoming" as const },
          { title: "Investment Analysis", description: "Valuation and portfolio management", duration: "2 months", status: "upcoming" as const },
          { title: "Risk Management", description: "Financial risk assessment", duration: "1.5 months", status: "upcoming" as const },
          { title: "Financial Software", description: "Bloomberg, SQL, Python", duration: "1.5 months", status: "upcoming" as const }
        ],
        estimatedDuration: "6-10 months",
        salaryRange: "₹3-8 LPA starting",
        difficulty: "medium"
      },
      {
        id: 8,
        title: "Biotechnology Researcher",
        description: "Research and development in life sciences",
        skillCategoryIds: [6],
        steps: [
          { title: "Research Methodology", description: "Scientific research principles", duration: "2 months", status: "upcoming" as const },
          { title: "Laboratory Techniques", description: "Molecular biology and biochemistry", duration: "3 months", status: "upcoming" as const },
          { title: "Bioinformatics", description: "Computational biology tools", duration: "2 months", status: "upcoming" as const },
          { title: "Data Analysis", description: "Statistical analysis for research", duration: "2 months", status: "upcoming" as const },
          { title: "Industry Applications", description: "Pharmaceutical and biotech industry", duration: "2 months", status: "upcoming" as const }
        ],
        estimatedDuration: "8-12 months",
        salaryRange: "₹3-7 LPA starting",
        difficulty: "hard"
      },
      {
        id: 9,
        title: "UX/UI Designer",
        description: "User experience and interface design",
        skillCategoryIds: [2],
        steps: [
          { title: "Design Fundamentals", description: "Color theory, typography, layout", duration: "1.5 months", status: "upcoming" as const },
          { title: "Figma & Design Tools", description: "Professional design software", duration: "2 months", status: "upcoming" as const },
          { title: "User Research", description: "User interviews and testing", duration: "1.5 months", status: "upcoming" as const },
          { title: "Prototyping", description: "Interactive prototypes", duration: "1.5 months", status: "upcoming" as const },
          { title: "Portfolio Development", description: "Professional portfolio", duration: "1 month", status: "upcoming" as const }
        ],
        estimatedDuration: "4-8 months",
        salaryRange: "₹3-7 LPA starting",
        difficulty: "medium"
      },
      {
        id: 10,
        title: "Business Analyst",
        description: "Business process analysis and optimization",
        skillCategoryIds: [5, 3],
        steps: [
          { title: "Business Analysis Fundamentals", description: "Requirements gathering and analysis", duration: "2 months", status: "upcoming" as const },
          { title: "Data Analysis Tools", description: "Excel, SQL, Tableau", duration: "2 months", status: "upcoming" as const },
          { title: "Process Mapping", description: "Business process documentation", duration: "1.5 months", status: "upcoming" as const },
          { title: "Project Management", description: "Agile and project management skills", duration: "1.5 months", status: "upcoming" as const },
          { title: "Business Intelligence", description: "BI tools and reporting", duration: "2 months", status: "upcoming" as const }
        ],
        estimatedDuration: "6-9 months",
        salaryRange: "₹3.5-7 LPA starting",
        difficulty: "medium"
      }
    ]).onConflictDoNothing();

    // Seed jobs
    await db.insert(jobs).values([
      {
        id: 1,
        title: "Junior Web Developer",
        company: "TechStartup Solutions",
        location: "Dehradun, Uttarakhand",
        description: "Looking for a passionate developer to join our growing team. Perfect for recent graduates or career changers.",
        requirements: ["React.js experience", "JavaScript proficiency", "HTML/CSS skills", "Problem-solving abilities"],
        skillTags: ["React.js", "JavaScript", "HTML/CSS"],
        salaryRange: "₹3-5 LPA",
        experienceLevel: "Entry Level",
        jobType: "full-time",
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        title: "Data Analyst Intern",
        company: "Analytics Hub",
        location: "Dehradun, Uttarakhand",
        description: "6-month internship with potential for full-time conversion. Great learning opportunity in data analytics.",
        requirements: ["Excel proficiency", "Basic Python knowledge", "SQL understanding", "Analytical mindset"],
        skillTags: ["Excel", "Python", "SQL"],
        salaryRange: "₹20k/month",
        experienceLevel: "Entry Level",
        jobType: "internship",
        postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        title: "UI/UX Designer",
        company: "Creative Agency Plus",
        location: "Dehradun, Uttarakhand",
        description: "Join our creative team to design digital experiences for clients across various industries.",
        requirements: ["Figma proficiency", "Adobe Creative Suite", "User research skills", "Portfolio required"],
        skillTags: ["Figma", "Adobe Creative Suite", "User Research"],
        salaryRange: "₹4-7 LPA",
        experienceLevel: "Mid Level",
        jobType: "full-time",
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ]).onConflictDoNothing();

    // Seed mentors
    await db.insert(mentors).values([
      {
        id: 1,
        name: "Rajesh Kumar",
        title: "Senior Software Engineer",
        company: "TCS, Dehradun",
        experience: 5,
        specializations: ["React", "Node.js", "Career Switch"],
        bio: "Helping students transition from college to tech careers. I understand the struggle - I changed from mechanical to software!",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
        rating: 48,
        totalReviews: 120,
        menteesCount: 25,
        available: true
      },
      {
        id: 2,
        name: "Priya Sharma",
        title: "UX Design Lead",
        company: "Wipro, Dehradun",
        experience: 8,
        specializations: ["UI/UX", "Figma", "Portfolio Review"],
        bio: "From engineering to design - I'll help you build an amazing portfolio and break into the design industry.",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
        rating: 49,
        totalReviews: 85,
        menteesCount: 40,
        available: true
      },
      {
        id: 3,
        name: "Arjun Patel",
        title: "Data Scientist",
        company: "Amazon, Remote (Dehradun)",
        experience: 6,
        specializations: ["Python", "ML", "SQL"],
        bio: "From mechanical engineering graduate to FAANG data scientist. Let me guide your data science journey!",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
        rating: 47,
        totalReviews: 95,
        menteesCount: 30,
        available: true
      }
    ]).onConflictDoNothing();

    // Seed community groups
    await db.insert(communityGroups).values([
      {
        id: 1,
        name: "Career Switchers to Tech",
        description: "For students from non-tech backgrounds transitioning to software development, data science, and other tech careers.",
        category: "Technology",
        icon: "fas fa-code",
        memberCount: 248,
        whatsappLink: "https://chat.whatsapp.com/invite-link-1",
        active: true
      },
      {
        id: 2,
        name: "Graphic Era Career Support",
        description: "Official support group for Graphic Era students exploring alternative career paths beyond their current courses.",
        category: "University",
        icon: "fas fa-graduation-cap",
        memberCount: 156,
        whatsappLink: "https://chat.whatsapp.com/invite-link-2",
        active: true
      },
      {
        id: 3,
        name: "Creative Careers Network",
        description: "For students interested in design, content creation, digital marketing, and other creative career paths.",
        category: "Creative",
        icon: "fas fa-paint-brush",
        memberCount: 89,
        whatsappLink: "https://chat.whatsapp.com/invite-link-3",
        active: true
      }
    ]).onConflictDoNothing();

    console.log("Database seeded successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("Seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };