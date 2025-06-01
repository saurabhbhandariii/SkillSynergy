import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  course: text("course").notNull(), // B.Tech, BBA, B.Sc Biology, etc.
  year: integer("year").notNull(), // 1, 2, 3, 4
  profileComplete: boolean("profile_complete").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Skill categories
export const skillCategories = pgTable("skill_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
});

// Skills
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: integer("category_id").references(() => skillCategories.id),
  description: text("description"),
});

// User assessments
export const userAssessments = pgTable("user_assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  course: text("course").notNull(), // B.Tech Computer Science, BBA, etc.
  year: integer("year").notNull(), // 1, 2, 3, 4
  skillCategoryIds: jsonb("skill_category_ids").$type<number[]>().notNull(),
  experienceLevel: text("experience_level").notNull(), // beginner, intermediate, advanced
  careerGoals: text("career_goals").notNull(),
  timeCommitment: text("time_commitment").notNull(), // part-time, full-time
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Career roadmaps
export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  skillCategoryIds: jsonb("skill_category_ids").$type<number[]>().notNull(),
  steps: jsonb("steps").$type<Array<{
    title: string;
    description: string;
    duration: string;
    status: 'completed' | 'current' | 'upcoming';
  }>>().notNull(),
  estimatedDuration: text("estimated_duration").notNull(),
  salaryRange: text("salary_range").notNull(),
  difficulty: text("difficulty").notNull(), // easy, medium, hard
});

// Jobs
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  requirements: jsonb("requirements").$type<string[]>().notNull(),
  skillTags: jsonb("skill_tags").$type<string[]>().notNull(),
  salaryRange: text("salary_range"),
  experienceLevel: text("experience_level").notNull(),
  jobType: text("job_type").notNull(), // full-time, part-time, internship
  postedAt: timestamp("posted_at").defaultNow(),
});

// Mentors
export const mentors = pgTable("mentors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  experience: integer("experience").notNull(),
  specializations: jsonb("specializations").$type<string[]>().notNull(),
  bio: text("bio").notNull(),
  profileImage: text("profile_image"),
  rating: integer("rating").default(0),
  totalReviews: integer("total_reviews").default(0),
  menteesCount: integer("mentees_count").default(0),
  available: boolean("available").default(true),
});

// Mentor requests
export const mentorRequests = pgTable("mentor_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  mentorId: integer("mentor_id").references(() => mentors.id),
  message: text("message").notNull(),
  status: text("status").default("pending"), // pending, accepted, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

// Community groups
export const communityGroups = pgTable("community_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  memberCount: integer("member_count").default(0),
  whatsappLink: text("whatsapp_link"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema exports for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertUserAssessmentSchema = createInsertSchema(userAssessments).omit({
  id: true,
  createdAt: true,
  userId: true,
});

export const insertMentorRequestSchema = createInsertSchema(mentorRequests).omit({
  id: true,
  createdAt: true,
  userId: true,
  status: true,
});

export const insertCommunityGroupSchema = createInsertSchema(communityGroups).omit({
  id: true,
  createdAt: true,
  memberCount: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SkillCategory = typeof skillCategories.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type UserAssessment = typeof userAssessments.$inferSelect;
export type InsertUserAssessment = z.infer<typeof insertUserAssessmentSchema>;
export type Roadmap = typeof roadmaps.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Mentor = typeof mentors.$inferSelect;
export type MentorRequest = typeof mentorRequests.$inferSelect;
export type InsertMentorRequest = z.infer<typeof insertMentorRequestSchema>;
export type CommunityGroup = typeof communityGroups.$inferSelect;
export type InsertCommunityGroup = z.infer<typeof insertCommunityGroupSchema>;
