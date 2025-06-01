import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserAssessmentSchema, insertMentorRequestSchema, insertCommunityGroupSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Skill categories
  app.get("/api/skill-categories", async (req, res) => {
    try {
      const categories = await storage.getSkillCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch skill categories" });
    }
  });

  // User assessments
  app.get("/api/assessments/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const assessment = await storage.getUserAssessment(userId);
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user assessment" });
    }
  });

  app.post("/api/assessments", async (req, res) => {
    try {
      const { userId, ...assessmentData } = req.body;
      const validatedData = insertUserAssessmentSchema.parse(assessmentData);
      const assessment = await storage.createUserAssessment(userId, validatedData);
      res.status(201).json(assessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid assessment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create assessment" });
      }
    }
  });

  app.put("/api/assessments/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const updates = req.body;
      const assessment = await storage.updateUserAssessment(userId, updates);
      if (!assessment) {
        res.status(404).json({ message: "Assessment not found" });
        return;
      }
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update assessment" });
    }
  });

  // Roadmaps
  app.get("/api/roadmaps", async (req, res) => {
    try {
      const { skillCategories } = req.query;
      if (skillCategories) {
        const categoryIds = (skillCategories as string).split(',').map(id => parseInt(id));
        const roadmaps = await storage.getRoadmapsBySkillCategories(categoryIds);
        res.json(roadmaps);
      } else {
        const roadmaps = await storage.getRoadmaps();
        res.json(roadmaps);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch roadmaps" });
    }
  });

  app.get("/api/roadmaps/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const roadmap = await storage.getRoadmap(id);
      if (!roadmap) {
        res.status(404).json({ message: "Roadmap not found" });
        return;
      }
      res.json(roadmap);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch roadmap" });
    }
  });

  // Jobs
  app.get("/api/jobs", async (req, res) => {
    try {
      const { search, experienceLevel, jobType, location } = req.query;
      const filters = {
        search: search as string,
        experienceLevel: experienceLevel as string,
        jobType: jobType as string,
        location: location as string
      };
      const jobs = await storage.getJobs(filters);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const job = await storage.getJob(id);
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  // Mentors
  app.get("/api/mentors", async (req, res) => {
    try {
      const { specialization } = req.query;
      const filters = specialization ? { specialization: specialization as string } : undefined;
      const mentors = await storage.getMentors(filters);
      res.json(mentors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentors" });
    }
  });

  app.get("/api/mentors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const mentor = await storage.getMentor(id);
      if (!mentor) {
        res.status(404).json({ message: "Mentor not found" });
        return;
      }
      res.json(mentor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentor" });
    }
  });

  // Mentor requests
  app.post("/api/mentor-requests", async (req, res) => {
    try {
      const { userId, ...requestData } = req.body;
      const validatedData = insertMentorRequestSchema.parse(requestData);
      const request = await storage.createMentorRequest(userId, validatedData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create mentor request" });
      }
    }
  });

  app.get("/api/mentor-requests/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const requests = await storage.getMentorRequests(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentor requests" });
    }
  });

  // Community groups
  app.get("/api/community-groups", async (req, res) => {
    try {
      const groups = await storage.getCommunityGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community groups" });
    }
  });

  app.get("/api/community-groups/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const group = await storage.getCommunityGroup(id);
      if (!group) {
        res.status(404).json({ message: "Community group not found" });
        return;
      }
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community group" });
    }
  });

  app.post("/api/community-groups", async (req, res) => {
    try {
      const validatedData = insertCommunityGroupSchema.parse(req.body);
      const group = await storage.createCommunityGroup(validatedData);
      res.status(201).json(group);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid group data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create community group" });
      }
    }
  });

  app.post("/api/community-groups/:id/join", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const group = await storage.joinCommunityGroup(id);
      if (!group) {
        res.status(404).json({ message: "Community group not found" });
        return;
      }
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: "Failed to join community group" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
