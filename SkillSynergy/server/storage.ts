import {
  users, skillCategories, skills, userAssessments, roadmaps, jobs, mentors, mentorRequests, communityGroups,
  type User, type InsertUser, type SkillCategory, type Skill, type UserAssessment, type InsertUserAssessment,
  type Roadmap, type Job, type Mentor, type MentorRequest, type InsertMentorRequest,
  type CommunityGroup, type InsertCommunityGroup
} from "@shared/schema";
import { db } from "./db";
import { eq, and, inArray, ilike, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Skill categories and skills
  getSkillCategories(): Promise<SkillCategory[]>;
  getSkillsByCategory(categoryId: number): Promise<Skill[]>;
  
  // User assessments
  getUserAssessment(userId: number): Promise<UserAssessment | undefined>;
  createUserAssessment(userId: number, assessment: InsertUserAssessment): Promise<UserAssessment>;
  updateUserAssessment(userId: number, updates: Partial<UserAssessment>): Promise<UserAssessment | undefined>;
  
  // Roadmaps
  getRoadmaps(): Promise<Roadmap[]>;
  getRoadmapsBySkillCategories(categoryIds: number[]): Promise<Roadmap[]>;
  getRoadmap(id: number): Promise<Roadmap | undefined>;
  
  // Jobs
  getJobs(filters?: { search?: string; experienceLevel?: string; jobType?: string; location?: string }): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  
  // Mentors
  getMentors(filters?: { specialization?: string }): Promise<Mentor[]>;
  getMentor(id: number): Promise<Mentor | undefined>;
  createMentorRequest(userId: number, request: InsertMentorRequest): Promise<MentorRequest>;
  getMentorRequests(userId: number): Promise<MentorRequest[]>;
  
  // Community groups
  getCommunityGroups(): Promise<CommunityGroup[]>;
  getCommunityGroup(id: number): Promise<CommunityGroup | undefined>;
  createCommunityGroup(group: InsertCommunityGroup): Promise<CommunityGroup>;
  joinCommunityGroup(groupId: number): Promise<CommunityGroup | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private skillCategories: Map<number, SkillCategory> = new Map();
  private skills: Map<number, Skill> = new Map();
  private userAssessments: Map<number, UserAssessment> = new Map();
  private roadmaps: Map<number, Roadmap> = new Map();
  private jobs: Map<number, Job> = new Map();
  private mentors: Map<number, Mentor> = new Map();
  private mentorRequests: Map<number, MentorRequest> = new Map();
  private communityGroups: Map<number, CommunityGroup> = new Map();
  
  private currentId = 1;
  private userAssessmentId = 1;
  private mentorRequestId = 1;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize skill categories
    const categories = [
      { id: 1, name: "Programming & Development", description: "Web dev, mobile apps, software engineering", icon: "fas fa-code" },
      { id: 2, name: "Design & Creative", description: "UI/UX, graphic design, digital art", icon: "fas fa-palette" },
      { id: 3, name: "Data & Analytics", description: "Data science, business intelligence, research", icon: "fas fa-chart-line" },
      { id: 4, name: "Marketing & Communication", description: "Digital marketing, content creation, PR", icon: "fas fa-bullhorn" },
      { id: 5, name: "Business & Finance", description: "Finance, accounting, business strategy", icon: "fas fa-briefcase" },
      { id: 6, name: "Healthcare & Life Sciences", description: "Medical research, biotechnology, healthcare", icon: "fas fa-heart" },
      { id: 7, name: "AI & Machine Learning", description: "Artificial intelligence, deep learning, neural networks", icon: "fas fa-robot" },
      { id: 8, name: "Education & Training", description: "Teaching, course creation, mentoring", icon: "fas fa-graduation-cap" }
    ];
    categories.forEach(cat => this.skillCategories.set(cat.id, cat));

    // Initialize comprehensive roadmaps
    const roadmaps = [
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
    ];
    roadmaps.forEach(roadmap => this.roadmaps.set(roadmap.id, roadmap));

    // Initialize jobs
    const jobs = [
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
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
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
        postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
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
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ];
    jobs.forEach(job => this.jobs.set(job.id, job));

    // Initialize mentors
    const mentors = [
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
    ];
    mentors.forEach(mentor => this.mentors.set(mentor.id, mentor));

    // Initialize community groups
    const groups = [
      {
        id: 1,
        name: "Career Switchers to Tech",
        description: "For students from non-tech backgrounds transitioning to software development, data science, and other tech careers.",
        category: "Technology",
        icon: "fas fa-code",
        memberCount: 248,
        whatsappLink: "https://chat.whatsapp.com/invite-link-1",
        active: true,
        createdAt: new Date()
      },
      {
        id: 2,
        name: "Graphic Era Career Support",
        description: "Official support group for Graphic Era students exploring alternative career paths beyond their current courses.",
        category: "University",
        icon: "fas fa-graduation-cap",
        memberCount: 156,
        whatsappLink: "https://chat.whatsapp.com/invite-link-2",
        active: true,
        createdAt: new Date()
      },
      {
        id: 3,
        name: "Creative Careers Network",
        description: "For students interested in design, content creation, digital marketing, and other creative career paths.",
        category: "Creative",
        icon: "fas fa-paint-brush",
        memberCount: 89,
        whatsappLink: "https://chat.whatsapp.com/invite-link-3",
        active: true,
        createdAt: new Date()
      }
    ];
    groups.forEach(group => this.communityGroups.set(group.id, group));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      profileComplete: false,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getSkillCategories(): Promise<SkillCategory[]> {
    return Array.from(this.skillCategories.values());
  }

  async getSkillsByCategory(categoryId: number): Promise<Skill[]> {
    return Array.from(this.skills.values()).filter(skill => skill.categoryId === categoryId);
  }

  async getUserAssessment(userId: number): Promise<UserAssessment | undefined> {
    return Array.from(this.userAssessments.values()).find(assessment => assessment.userId === userId);
  }

  async createUserAssessment(userId: number, assessment: InsertUserAssessment): Promise<UserAssessment> {
    const id = this.userAssessmentId++;
    const userAssessment: UserAssessment = {
      ...assessment,
      id,
      userId,
      createdAt: new Date()
    };
    this.userAssessments.set(id, userAssessment);
    return userAssessment;
  }

  async updateUserAssessment(userId: number, updates: Partial<UserAssessment>): Promise<UserAssessment | undefined> {
    const assessment = Array.from(this.userAssessments.values()).find(a => a.userId === userId);
    if (!assessment) return undefined;
    
    const updatedAssessment = { ...assessment, ...updates };
    this.userAssessments.set(assessment.id, updatedAssessment);
    return updatedAssessment;
  }

  async getRoadmaps(): Promise<Roadmap[]> {
    return Array.from(this.roadmaps.values());
  }

  async getRoadmapsBySkillCategories(categoryIds: number[]): Promise<Roadmap[]> {
    return Array.from(this.roadmaps.values()).filter(roadmap =>
      roadmap.skillCategoryIds.some(id => categoryIds.includes(id))
    );
  }

  async getRoadmap(id: number): Promise<Roadmap | undefined> {
    return this.roadmaps.get(id);
  }

  async getJobs(filters?: { search?: string; experienceLevel?: string; jobType?: string; location?: string }): Promise<Job[]> {
    let jobs = Array.from(this.jobs.values());
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search) ||
        job.skillTags.some(tag => tag.toLowerCase().includes(search))
      );
    }
    
    if (filters?.experienceLevel) {
      jobs = jobs.filter(job => job.experienceLevel === filters.experienceLevel);
    }
    
    if (filters?.jobType) {
      jobs = jobs.filter(job => job.jobType === filters.jobType);
    }
    
    if (filters?.location) {
      jobs = jobs.filter(job => job.location.toLowerCase().includes(filters.location!.toLowerCase()));
    }
    
    return jobs.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
  }

  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getMentors(filters?: { specialization?: string }): Promise<Mentor[]> {
    let mentors = Array.from(this.mentors.values());
    
    if (filters?.specialization) {
      mentors = mentors.filter(mentor =>
        mentor.specializations.some(spec =>
          spec.toLowerCase().includes(filters.specialization!.toLowerCase())
        )
      );
    }
    
    return mentors.filter(mentor => mentor.available);
  }

  async getMentor(id: number): Promise<Mentor | undefined> {
    return this.mentors.get(id);
  }

  async createMentorRequest(userId: number, request: InsertMentorRequest): Promise<MentorRequest> {
    const id = this.mentorRequestId++;
    const mentorRequest: MentorRequest = {
      ...request,
      id,
      userId,
      status: "pending",
      createdAt: new Date()
    };
    this.mentorRequests.set(id, mentorRequest);
    return mentorRequest;
  }

  async getMentorRequests(userId: number): Promise<MentorRequest[]> {
    return Array.from(this.mentorRequests.values()).filter(request => request.userId === userId);
  }

  async getCommunityGroups(): Promise<CommunityGroup[]> {
    return Array.from(this.communityGroups.values()).filter(group => group.active);
  }

  async getCommunityGroup(id: number): Promise<CommunityGroup | undefined> {
    return this.communityGroups.get(id);
  }

  async createCommunityGroup(group: InsertCommunityGroup): Promise<CommunityGroup> {
    const id = this.currentId++;
    const communityGroup: CommunityGroup = {
      ...group,
      id,
      memberCount: 0,
      createdAt: new Date()
    };
    this.communityGroups.set(id, communityGroup);
    return communityGroup;
  }

  async joinCommunityGroup(groupId: number): Promise<CommunityGroup | undefined> {
    const group = this.communityGroups.get(groupId);
    if (!group) return undefined;
    
    const updatedGroup = { ...group, memberCount: group.memberCount + 1 };
    this.communityGroups.set(groupId, updatedGroup);
    return updatedGroup;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getSkillCategories(): Promise<SkillCategory[]> {
    return await db.select().from(skillCategories);
  }

  async getSkillsByCategory(categoryId: number): Promise<Skill[]> {
    return await db.select().from(skills).where(eq(skills.categoryId, categoryId));
  }

  async getUserAssessment(userId: number): Promise<UserAssessment | undefined> {
    const [assessment] = await db.select().from(userAssessments).where(eq(userAssessments.userId, userId));
    return assessment || undefined;
  }

  async createUserAssessment(userId: number, assessment: InsertUserAssessment): Promise<UserAssessment> {
    const [userAssessment] = await db
      .insert(userAssessments)
      .values({ ...assessment, userId })
      .returning();
    return userAssessment;
  }

  async updateUserAssessment(userId: number, updates: Partial<UserAssessment>): Promise<UserAssessment | undefined> {
    const [assessment] = await db
      .update(userAssessments)
      .set(updates)
      .where(eq(userAssessments.userId, userId))
      .returning();
    return assessment || undefined;
  }

  async getRoadmaps(): Promise<Roadmap[]> {
    return await db.select().from(roadmaps);
  }

  async getRoadmapsBySkillCategories(categoryIds: number[]): Promise<Roadmap[]> {
    return await db.select().from(roadmaps);
  }

  async getRoadmap(id: number): Promise<Roadmap | undefined> {
    const [roadmap] = await db.select().from(roadmaps).where(eq(roadmaps.id, id));
    return roadmap || undefined;
  }

  async getJobs(filters?: { search?: string; experienceLevel?: string; jobType?: string; location?: string }): Promise<Job[]> {
    let query = db.select().from(jobs);
    
    const conditions = [];
    
    if (filters?.search) {
      conditions.push(
        ilike(jobs.title, `%${filters.search}%`)
      );
    }
    
    if (filters?.experienceLevel) {
      conditions.push(eq(jobs.experienceLevel, filters.experienceLevel));
    }
    
    if (filters?.jobType) {
      conditions.push(eq(jobs.jobType, filters.jobType));
    }
    
    if (filters?.location) {
      conditions.push(ilike(jobs.location, `%${filters.location}%`));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(jobs.postedAt));
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async getMentors(filters?: { specialization?: string }): Promise<Mentor[]> {
    let query = db.select().from(mentors).where(eq(mentors.available, true));
    return await query;
  }

  async getMentor(id: number): Promise<Mentor | undefined> {
    const [mentor] = await db.select().from(mentors).where(eq(mentors.id, id));
    return mentor || undefined;
  }

  async createMentorRequest(userId: number, request: InsertMentorRequest): Promise<MentorRequest> {
    const [mentorRequest] = await db
      .insert(mentorRequests)
      .values({ ...request, userId })
      .returning();
    return mentorRequest;
  }

  async getMentorRequests(userId: number): Promise<MentorRequest[]> {
    return await db.select().from(mentorRequests).where(eq(mentorRequests.userId, userId));
  }

  async getCommunityGroups(): Promise<CommunityGroup[]> {
    return await db.select().from(communityGroups).where(eq(communityGroups.active, true));
  }

  async getCommunityGroup(id: number): Promise<CommunityGroup | undefined> {
    const [group] = await db.select().from(communityGroups).where(eq(communityGroups.id, id));
    return group || undefined;
  }

  async createCommunityGroup(group: InsertCommunityGroup): Promise<CommunityGroup> {
    const [communityGroup] = await db
      .insert(communityGroups)
      .values(group)
      .returning();
    return communityGroup;
  }

  async joinCommunityGroup(groupId: number): Promise<CommunityGroup | undefined> {
    const [group] = await db
      .update(communityGroups)
      .set({ memberCount: db.$increment(communityGroups.memberCount, 1) })
      .where(eq(communityGroups.id, groupId))
      .returning();
    return group || undefined;
  }
}

// Use DatabaseStorage for persistent data
export const storage = new DatabaseStorage();
