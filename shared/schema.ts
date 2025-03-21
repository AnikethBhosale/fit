import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Posture records table - stores posture analysis data
export const postureRecords = pgTable("posture_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  score: integer("score").notNull(),
  issues: json("issues").$type<{
    name: string,
    description: string,
    severity: 'none' | 'mild' | 'moderate' | 'high',
    score: number
  }[]>(),
  sessionDuration: integer("session_duration").notNull(), // in seconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPostureRecordSchema = createInsertSchema(postureRecords).pick({
  userId: true,
  score: true,
  issues: true,
  sessionDuration: true,
});

// User rewards table
export const userRewards = pgTable("user_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  rewardId: text("reward_id").notNull(),
  claimed: boolean("claimed").default(false),
  claimedAt: timestamp("claimed_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserRewardSchema = createInsertSchema(userRewards).pick({
  userId: true,
  rewardId: true,
  claimed: true,
  expiresAt: true,
});

// Exercise progress table
export const exerciseProgress = pgTable("exercise_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  exerciseId: text("exercise_id").notNull(),
  completedCount: integer("completed_count").default(0),
  lastCompleted: timestamp("last_completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertExerciseProgressSchema = createInsertSchema(exerciseProgress).pick({
  userId: true,
  exerciseId: true,
  completedCount: true,
  lastCompleted: true,
});

// User streaks table
export const userStreaks = pgTable("user_streaks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivityDate: timestamp("last_activity_date"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserStreakSchema = createInsertSchema(userStreaks).pick({
  userId: true,
  currentStreak: true,
  longestStreak: true,
  lastActivityDate: true,
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  message: true,
});

// Types export
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPostureRecord = z.infer<typeof insertPostureRecordSchema>;
export type PostureRecord = typeof postureRecords.$inferSelect;

export type InsertUserReward = z.infer<typeof insertUserRewardSchema>;
export type UserReward = typeof userRewards.$inferSelect;

export type InsertExerciseProgress = z.infer<typeof insertExerciseProgressSchema>;
export type ExerciseProgress = typeof exerciseProgress.$inferSelect;

export type InsertUserStreak = z.infer<typeof insertUserStreakSchema>;
export type UserStreak = typeof userStreaks.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
