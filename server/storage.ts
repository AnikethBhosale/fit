import { 
  users, 
  postureRecords, 
  userRewards,
  exerciseProgress,
  userStreaks,
  contactMessages,
  type User, 
  type InsertUser, 
  type PostureRecord,
  type InsertPostureRecord,
  type UserReward,
  type InsertUserReward,
  type ExerciseProgress,
  type InsertExerciseProgress,
  type UserStreak,
  type InsertUserStreak,
  type ContactMessage,
  type InsertContactMessage
} from "@shared/schema";

// Storage interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Posture record methods
  createPostureRecord(record: InsertPostureRecord): Promise<PostureRecord>;
  getPostureRecords(userId: number): Promise<PostureRecord[]>;
  getPostureRecordById(id: number): Promise<PostureRecord | undefined>;
  getLatestPostureRecord(userId: number): Promise<PostureRecord | undefined>;
  
  // User rewards methods
  createUserReward(reward: InsertUserReward): Promise<UserReward>;
  getUserRewards(userId: number): Promise<UserReward[]>;
  updateUserReward(id: number, claimed: boolean): Promise<UserReward | undefined>;
  
  // Exercise progress methods
  createExerciseProgress(progress: InsertExerciseProgress): Promise<ExerciseProgress>;
  getExerciseProgress(userId: number, exerciseId: string): Promise<ExerciseProgress | undefined>;
  updateExerciseProgress(id: number, completedCount: number): Promise<ExerciseProgress | undefined>;
  getAllExerciseProgress(userId: number): Promise<ExerciseProgress[]>;
  
  // User streak methods
  getUserStreak(userId: number): Promise<UserStreak | undefined>;
  createUserStreak(streak: InsertUserStreak): Promise<UserStreak>;
  updateUserStreak(userId: number, currentStreak: number, longestStreak?: number): Promise<UserStreak | undefined>;
  
  // Contact message methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private postureRecords: Map<number, PostureRecord>;
  private userRewards: Map<number, UserReward>;
  private exerciseProgress: Map<number, ExerciseProgress>;
  private userStreaks: Map<number, UserStreak>;
  private contactMessages: Map<number, ContactMessage>;
  
  private userIdCounter: number;
  private postureRecordIdCounter: number;
  private userRewardIdCounter: number;
  private exerciseProgressIdCounter: number;
  private userStreakIdCounter: number;
  private contactMessageIdCounter: number;

  constructor() {
    this.users = new Map();
    this.postureRecords = new Map();
    this.userRewards = new Map();
    this.exerciseProgress = new Map();
    this.userStreaks = new Map();
    this.contactMessages = new Map();
    
    this.userIdCounter = 1;
    this.postureRecordIdCounter = 1;
    this.userRewardIdCounter = 1;
    this.exerciseProgressIdCounter = 1;
    this.userStreakIdCounter = 1;
    this.contactMessageIdCounter = 1;
    
    // Create test user
    this.createUser({
      username: "testuser",
      password: "password123",
      email: "test@example.com"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // Posture record methods
  async createPostureRecord(record: InsertPostureRecord): Promise<PostureRecord> {
    const id = this.postureRecordIdCounter++;
    const now = new Date();
    const postureRecord: PostureRecord = {
      ...record,
      id,
      createdAt: now
    };
    this.postureRecords.set(id, postureRecord);
    
    // Update user streak when posture record is created
    const streak = await this.getUserStreak(record.userId);
    if (streak) {
      const today = new Date();
      const lastDate = streak.lastActivityDate;
      
      // Check if last activity was yesterday
      const isConsecutiveDay = lastDate && 
        today.getDate() - lastDate.getDate() === 1 &&
        today.getMonth() === lastDate.getMonth() &&
        today.getFullYear() === lastDate.getFullYear();
      
      // Check if activity was already done today
      const isSameDay = lastDate && 
        today.getDate() === lastDate.getDate() &&
        today.getMonth() === lastDate.getMonth() &&
        today.getFullYear() === lastDate.getFullYear();
      
      if (!isSameDay) {
        const newStreak = isConsecutiveDay ? streak.currentStreak + 1 : 1;
        const newLongestStreak = Math.max(newStreak, streak.longestStreak);
        await this.updateUserStreak(record.userId, newStreak, newLongestStreak);
      }
    } else {
      // Create first streak
      await this.createUserStreak({
        userId: record.userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: now
      });
    }
    
    return postureRecord;
  }

  async getPostureRecords(userId: number): Promise<PostureRecord[]> {
    return Array.from(this.postureRecords.values())
      .filter(record => record.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPostureRecordById(id: number): Promise<PostureRecord | undefined> {
    return this.postureRecords.get(id);
  }
  
  async getLatestPostureRecord(userId: number): Promise<PostureRecord | undefined> {
    return Array.from(this.postureRecords.values())
      .filter(record => record.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  }

  // User rewards methods
  async createUserReward(reward: InsertUserReward): Promise<UserReward> {
    const id = this.userRewardIdCounter++;
    const now = new Date();
    const userReward: UserReward = {
      ...reward,
      id,
      claimed: reward.claimed || false,
      claimedAt: reward.claimed ? now : null,
      createdAt: now
    };
    this.userRewards.set(id, userReward);
    return userReward;
  }

  async getUserRewards(userId: number): Promise<UserReward[]> {
    return Array.from(this.userRewards.values())
      .filter(reward => reward.userId === userId);
  }

  async updateUserReward(id: number, claimed: boolean): Promise<UserReward | undefined> {
    const reward = this.userRewards.get(id);
    if (!reward) return undefined;
    
    const updatedReward: UserReward = {
      ...reward,
      claimed,
      claimedAt: claimed ? new Date() : null
    };
    
    this.userRewards.set(id, updatedReward);
    return updatedReward;
  }

  // Exercise progress methods
  async createExerciseProgress(progress: InsertExerciseProgress): Promise<ExerciseProgress> {
    const id = this.exerciseProgressIdCounter++;
    const now = new Date();
    const exerciseProgress: ExerciseProgress = {
      ...progress,
      id,
      completedCount: progress.completedCount || 0,
      lastCompleted: progress.lastCompleted || null,
      createdAt: now
    };
    this.exerciseProgress.set(id, exerciseProgress);
    return exerciseProgress;
  }

  async getExerciseProgress(userId: number, exerciseId: string): Promise<ExerciseProgress | undefined> {
    return Array.from(this.exerciseProgress.values())
      .find(progress => progress.userId === userId && progress.exerciseId === exerciseId);
  }

  async updateExerciseProgress(id: number, completedCount: number): Promise<ExerciseProgress | undefined> {
    const progress = this.exerciseProgress.get(id);
    if (!progress) return undefined;
    
    const now = new Date();
    const updatedProgress: ExerciseProgress = {
      ...progress,
      completedCount,
      lastCompleted: now
    };
    
    this.exerciseProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  async getAllExerciseProgress(userId: number): Promise<ExerciseProgress[]> {
    return Array.from(this.exerciseProgress.values())
      .filter(progress => progress.userId === userId);
  }

  // User streak methods
  async getUserStreak(userId: number): Promise<UserStreak | undefined> {
    return Array.from(this.userStreaks.values())
      .find(streak => streak.userId === userId);
  }

  async createUserStreak(streak: InsertUserStreak): Promise<UserStreak> {
    const id = this.userStreakIdCounter++;
    const now = new Date();
    const userStreak: UserStreak = {
      ...streak,
      id,
      currentStreak: streak.currentStreak || 0,
      longestStreak: streak.longestStreak || 0,
      lastActivityDate: streak.lastActivityDate || now,
      updatedAt: now
    };
    this.userStreaks.set(id, userStreak);
    return userStreak;
  }

  async updateUserStreak(userId: number, currentStreak: number, longestStreak?: number): Promise<UserStreak | undefined> {
    const streak = await this.getUserStreak(userId);
    if (!streak) return undefined;
    
    const now = new Date();
    const updatedStreak: UserStreak = {
      ...streak,
      currentStreak,
      longestStreak: longestStreak !== undefined ? longestStreak : streak.longestStreak,
      lastActivityDate: now,
      updatedAt: now
    };
    
    this.userStreaks.set(streak.id, updatedStreak);
    return updatedStreak;
  }

  // Contact message methods
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageIdCounter++;
    const now = new Date();
    const contactMessage: ContactMessage = {
      ...message,
      id,
      createdAt: now
    };
    this.contactMessages.set(id, contactMessage);
    return contactMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
