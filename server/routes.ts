import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { insertBookSchema, updateBookSchema } from "@shared/schema";

export async function registerRoutes(httpServer: Server, app: Express) {
  // Setup Replit Auth
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public route - Get all books
  app.get("/api/books", async (req, res) => {
    try {
      const books = await storage.getAllBooks();
      res.json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Failed to fetch books" });
    }
  });

  // Public route - Get single book
  app.get("/api/books/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const book = await storage.getBook(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(book);
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({ message: "Failed to fetch book" });
    }
  });

  // Admin route - Create book
  app.post("/api/books", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const result = insertBookSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: result.error.flatten() 
        });
      }
      
      const book = await storage.createBook(result.data);
      res.status(201).json(book);
    } catch (error) {
      console.error("Error creating book:", error);
      res.status(500).json({ message: "Failed to create book" });
    }
  });

  // Admin route - Update book
  app.put("/api/books/:id", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const existing = await storage.getBook(id);
      if (!existing) {
        return res.status(404).json({ message: "Book not found" });
      }

      const result = updateBookSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: result.error.flatten() 
        });
      }
      
      const book = await storage.updateBook(id, result.data);
      res.json(book);
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({ message: "Failed to update book" });
    }
  });

  // Admin route - Delete book
  app.delete("/api/books/:id", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const existing = await storage.getBook(id);
      if (!existing) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      await storage.deleteBook(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting book:", error);
      res.status(500).json({ message: "Failed to delete book" });
    }
  });

  // Admin route - Make user admin (for initial setup)
  app.post("/api/admin/make-admin", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check if this is the first user or if user already exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Make the user an admin
      const updatedUser = await storage.updateUser(userId, { isAdmin: true });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error making admin:", error);
      res.status(500).json({ message: "Failed to make admin" });
    }
  });

  return httpServer;
}
