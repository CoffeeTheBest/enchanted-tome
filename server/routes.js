import { storage } from "./storage.js";
import { setupAuth, isAuthenticated, isAdmin } from "./auth.js";

export async function registerRoutes(httpServer, app) {
  await setupAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.uid;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/books", async (req, res) => {
    try {
      const books = await storage.getAllBooks();
      res.json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Failed to fetch books" });
    }
  });

  app.get("/api/books/:id", async (req, res) => {
    try {
      const id = req.params.id;
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

  app.post("/api/books", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const book = await storage.createBook(req.body);
      res.status(201).json(book);
    } catch (error) {
      console.error("Error creating book:", error);
      res.status(500).json({ message: "Failed to create book" });
    }
  });

  app.put("/api/books/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const existing = await storage.getBook(id);
      if (!existing) {
        return res.status(404).json({ message: "Book not found" });
      }

      const book = await storage.updateBook(id, req.body);
      res.json(book);
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({ message: "Failed to update book" });
    }
  });

  app.delete("/api/books/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = req.params.id;
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

  app.post("/api/admin/make-admin", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.uid;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await storage.updateUser(userId, { isAdmin: true });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error making admin:", error);
      res.status(500).json({ message: "Failed to make admin" });
    }
  });

  return httpServer;
}