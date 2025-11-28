import { users, books, type UpsertUser, type InsertBook } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Storage interface for Replit Auth and Books CRUD
export class DatabaseStorage {
  // User operations for Replit Auth
  async getUser(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser) {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, data: Partial<UpsertUser>) {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Book operations
  async getAllBooks() {
    return db.select().from(books).orderBy(desc(books.createdAt));
  }

  async getBook(id: number) {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }

  async createBook(bookData: InsertBook) {
    const [book] = await db
      .insert(books)
      .values(bookData)
      .returning();
    return book;
  }

  async updateBook(id: number, bookData: Partial<InsertBook>) {
    const [book] = await db
      .update(books)
      .set({ ...bookData, updatedAt: new Date() })
      .where(eq(books.id, id))
      .returning();
    return book;
  }

  async deleteBook(id: number) {
    const [book] = await db
      .delete(books)
      .where(eq(books.id, id))
      .returning();
    return book;
  }
}

export const storage = new DatabaseStorage();
