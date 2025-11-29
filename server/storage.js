import { db } from "./db.js";
import { ref, get, set, child, push, update, remove } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';

export class DatabaseStorage {
  async getUser(id) {
    const userRef = ref(db, `users/${id}`);
    const snapshot = await get(userRef);
    return snapshot.val();
  }

  async upsertUser(userData) {
    const userRef = ref(db, `users/${userData.id}`);
    await set(userRef, {
      ...userData,
      updatedAt: new Date().toISOString(),
    });
    return this.getUser(userData.id);
  }

  async updateUser(id, data) {
    const userRef = ref(db, `users/${id}`);
    await update(userRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return this.getUser(id);
  }

  async getAllBooks() {
    const booksRef = ref(db, 'books');
    const snapshot = await get(booksRef);
    const booksData = snapshot.val();
    if (!booksData) {
      return [];
    }
    return Object.values(booksData).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getBook(id) {
    const bookRef = ref(db, `books/${id}`);
    const snapshot = await get(bookRef);
    return snapshot.val();
  }

  async createBook(bookData) {
    const newBookId = uuidv4();
    const bookRef = ref(db, `books/${newBookId}`);
    const newBook = {
      ...bookData,
      id: newBookId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    await set(bookRef, newBook);
    return newBook;
  }

  async updateBook(id, bookData) {
    const bookRef = ref(db, `books/${id}`);
    await update(bookRef, {
      ...bookData,
      updatedAt: new Date().toISOString(),
    });
    return this.getBook(id);
  }

  async deleteBook(id) {
    const bookRef = ref(db, `books/${id}`);
    const book = await this.getBook(id);
    await remove(bookRef);
    return book;
  }
}

export const storage = new DatabaseStorage();