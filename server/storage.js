import { users, books } from "@shared/schema.js";
import { db } from "./db.js";
import { eq, desc } from "drizzle-orm";

export class DatabaseStorage {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData) {
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

  async updateUser(id, data) {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllBooks() {
    return db.select().from(books).orderBy(desc(books.createdAt));
  }

  async getBook(id) {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }

  async createBook(bookData) {
    const [book] = await db
      .insert(books)
      .values(bookData)
      .returning();
    return book;
  }

  async updateBook(id, bookData) {
    const [book] = await db
      .update(books)
      .set({ ...bookData, updatedAt: new Date() })
      .where(eq(books.id, id))
      .returning();
    return book;
  }

  async deleteBook(id) {
    const [book] = await db
      .delete(books)
      .where(eq(books.id, id))
      .returning();
    return book;
  }
}

export const storage = new DatabaseStorage();
