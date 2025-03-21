import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertPostureRecordSchema, 
  insertContactMessageSchema 
} from "@shared/schema";
import { exercises } from "./data/exercises";
import { rewards } from "./data/rewards";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  // All API routes should start with /api
  
  // User routes
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      return res.status(201).json({ 
        id: user.id,
        username: user.username,
        email: user.email
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  // Posture analysis routes
  app.post("/api/posture-records", async (req: Request, res: Response) => {
    try {
      const recordData = insertPostureRecordSchema.parse(req.body);
      const record = await storage.createPostureRecord(recordData);
      return res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid posture record data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create posture record" });
    }
  });
  
  app.get("/api/posture-records/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const records = await storage.getPostureRecords(userId);
      return res.json(records);
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve posture records" });
    }
  });
  
  app.get("/api/posture-stats", async (req: Request, res: Response) => {
    // For demo purposes, we're returning static data
    // In a real app, we would get the userId from the session and return their stats
    const staticStats = {
      score: 92,
      issues: [
        { 
          name: 'Shoulder Alignment', 
          status: 'Excellent', 
          statusType: 'success' 
        },
        { 
          name: 'Head Position', 
          status: 'Slight Forward Tilt', 
          statusType: 'warning' 
        },
        { 
          name: 'Spine Curvature', 
          status: 'Good', 
          statusType: 'success' 
        }
      ],
      suggestions: [
        "Try chin tucks to improve head position",
        "Take a short break every 25 minutes"
      ]
    };
    
    return res.json(staticStats);
  });
  
  // Exercise routes
  app.get("/api/exercises", async (req: Request, res: Response) => {
    return res.json({ exercises });
  });
  
  app.post("/api/exercises/:exerciseId/start", async (req: Request, res: Response) => {
    try {
      const { exerciseId } = req.params;
      // In a real app, we would get the userId from the session
      const userId = 1; // Using test user for demo
      
      const exercise = exercises.find(ex => ex.id === exerciseId);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      
      let progress = await storage.getExerciseProgress(userId, exerciseId);
      
      if (progress) {
        progress = await storage.updateExerciseProgress(
          progress.id,
          progress.completedCount + 1
        );
      } else {
        progress = await storage.createExerciseProgress({
          userId,
          exerciseId,
          completedCount: 1,
          lastCompleted: new Date()
        });
      }
      
      return res.json({ success: true, progress });
    } catch (error) {
      return res.status(500).json({ message: "Failed to start exercise" });
    }
  });
  
  app.get("/api/exercises/progress/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const progressList = await storage.getAllExerciseProgress(userId);
      return res.json({ progressList });
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve exercise progress" });
    }
  });
  
  // Rewards routes
  app.get("/api/rewards", async (req: Request, res: Response) => {
    return res.json({ rewards });
  });
  
  app.get("/api/rewards/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const userRewards = await storage.getUserRewards(userId);
      
      // Combine rewards data with user reward status
      const rewardsWithStatus = rewards.map(reward => {
        const userReward = userRewards.find(ur => ur.rewardId === reward.id);
        return {
          ...reward,
          isUnlocked: userReward ? true : reward.progress.percentage >= 100,
          isClaimed: userReward ? userReward.claimed : false,
          userRewardId: userReward ? userReward.id : undefined
        };
      });
      
      return res.json({ rewards: rewardsWithStatus });
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve rewards" });
    }
  });
  
  app.post("/api/rewards/:rewardId/claim", async (req: Request, res: Response) => {
    try {
      const { rewardId } = req.params;
      // In a real app, we would get the userId from the session
      const userId = 1; // Using test user for demo
      
      const reward = rewards.find(r => r.id === rewardId);
      if (!reward) {
        return res.status(404).json({ message: "Reward not found" });
      }
      
      // Check if user already claimed this reward
      const userRewards = await storage.getUserRewards(userId);
      let userReward = userRewards.find(ur => ur.rewardId === rewardId);
      
      if (userReward) {
        // Update existing reward to claimed
        userReward = await storage.updateUserReward(userReward.id, true);
      } else {
        // Create new reward claim
        userReward = await storage.createUserReward({
          userId,
          rewardId,
          claimed: true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        });
      }
      
      return res.json({ success: true, userReward });
    } catch (error) {
      return res.status(500).json({ message: "Failed to claim reward" });
    }
  });
  
  // Leaderboard routes
  app.get("/api/leaderboard", async (req: Request, res: Response) => {
    try {
      // In a real app, we would calculate this from actual user data
      const leaderboardData = [
        { rank: 1, name: "Sarah J.", score: 98, streak: "14 days", initial: "S", isVip: true },
        { rank: 2, name: "Michael T.", score: 95, streak: "10 days", initial: "M" },
        { rank: 3, name: "Jessica K.", score: 93, streak: "7 days", initial: "J" },
        { rank: 4, name: "Alex W.", score: 91, streak: "5 days", initial: "A" },
        { rank: 5, name: "Ryan L.", score: 89, streak: "4 days", initial: "R" }
      ];
      
      return res.json({ users: leaderboardData });
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve leaderboard" });
    }
  });
  
  app.get("/api/user/progress", async (req: Request, res: Response) => {
    try {
      // In a real app, we would get the userId from the session
      const userId = 1; // Using test user for demo
      
      const userStreak = await storage.getUserStreak(userId);
      const streak = userStreak ? userStreak.currentStreak : 0;
      
      // Demo data for user progress
      const weekDays = [
        { day: 'M', completed: true },
        { day: 'T', completed: true },
        { day: 'W', completed: true },
        { day: 'T', completed: true },
        { day: 'F', completed: true },
        { day: 'S', completed: false },
        { day: 'S', completed: false }
      ];
      
      const userProgress = {
        score: 92,
        weekDays,
        rank: '6th of 42',
        rankPercentage: 85,
        streak
      };
      
      return res.json(userProgress);
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve user progress" });
    }
  });
  
  // Contact route
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      return res.status(201).json({ success: true, messageId: message.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
