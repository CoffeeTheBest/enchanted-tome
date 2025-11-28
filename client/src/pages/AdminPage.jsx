import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollReveal } from "@/components/ScrollReveal";
import { OrnateDivider } from "@/components/OrnateSection";
import { PageLoader } from "@/components/LoadingSpinner";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  BookOpen, 
  Shield, 
  Search,
  DollarSign,
  Layers,
  Calendar,
  Tag
} from "lucide-react";

const CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Fantasy",
  "Mystery",
  "Romance",
  "Science Fiction",
  "History",
  "Biography",
  "Poetry",
  "Philosophy",
  "Classic",
  "Adventure",
];

export default function AdminPage() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    category: "Fiction",
    coverUrl: "",
    publishedYear: "",
    pages: "",
    inStock: true,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ["/api/books"],
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/books", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      toast({
        title: "Book Added",
        description: "The tome has been added to your collection.",
      });
      closeForm();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to add book",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiRequest("PUT", `/api/books/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      toast({
        title: "Book Updated",
        description: "The tome has been successfully updated.",
      });
      closeForm();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to update book",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await apiRequest("DELETE", `/api/books/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      toast({
        title: "Book Removed",
        description: "The tome has been removed from your collection.",
      });
      setDeleteConfirm(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to delete book",
        variant: "destructive",
      });
    },
  });

  const openCreateForm = () => {
    setEditingBook(null);
    setFormData({
      title: "",
      author: "",
      description: "",
      price: "",
      category: "Fiction",
      coverUrl: "",
      publishedYear: "",
      pages: "",
      inStock: true,
    });
    setIsFormOpen(true);
  };

  const openEditForm = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description || "",
      price: book.price?.toString() || "",
      category: book.category || "Fiction",
      coverUrl: book.coverUrl || "",
      publishedYear: book.publishedYear?.toString() || "",
      pages: book.pages?.toString() || "",
      inStock: book.inStock ?? true,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBook(null);
    setFormData({
      title: "",
      author: "",
      description: "",
      price: "",
      category: "Fiction",
      coverUrl: "",
      publishedYear: "",
      pages: "",
      inStock: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const bookData = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price) || 0,
      category: formData.category,
      coverUrl: formData.coverUrl.trim() || null,
      publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : null,
      pages: formData.pages ? parseInt(formData.pages) : null,
      inStock: formData.inStock,
    };

    if (editingBook) {
      updateMutation.mutate({ id: editingBook.id, data: bookData });
    } else {
      createMutation.mutate(bookData);
    }
  };

  const filteredBooks = searchQuery
    ? books.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : books;

  if (authLoading) {
    return <PageLoader />;
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Shield className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground font-serif">
          Only keepers of the sacred scrolls may enter this realm.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="font-display text-3xl font-bold">
                  Librarian's Desk
                </h1>
              </div>
              <p className="text-muted-foreground font-serif">
                Manage your collection of enchanted tomes
              </p>
            </div>
            <Button onClick={openCreateForm} className="font-serif gap-2" data-testid="button-add-book">
              <Plus className="h-4 w-4" />
              Add New Book
            </Button>
          </div>
        </ScrollReveal>

        <OrnateDivider className="mb-8" />

        <ScrollReveal delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Books</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-display font-bold text-primary" data-testid="text-total-books">
                  {books.length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">In Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-display font-bold text-green-600 dark:text-green-400">
                  {books.filter(b => b.inStock).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-display font-bold text-primary">
                  {new Set(books.map(b => b.category)).size}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Price</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-display font-bold text-primary">
                  ${books.length > 0 ? (books.reduce((sum, b) => sum + (b.price || 0), 0) / books.length).toFixed(2) : "0.00"}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-serif"
                data-testid="input-admin-search"
              />
            </div>
          </div>
        </ScrollReveal>

        {booksLoading ? (
          <PageLoader />
        ) : filteredBooks.length > 0 ? (
          <div className="grid gap-4">
            {filteredBooks.map((book, index) => (
              <ScrollReveal key={book.id} delay={Math.min(index * 30, 200)}>
                <Card className="hover-elevate" data-testid={`card-admin-book-${book.id}`}>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-start gap-4">
                      <div className="w-16 h-24 rounded bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                        {book.coverUrl ? (
                          <img 
                            src={book.coverUrl} 
                            alt={book.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <BookOpen className="h-6 w-6 text-primary/40" />
                        )}
                      </div>

                      <div className="flex-1 min-w-[200px]">
                        <div className="flex flex-wrap items-start gap-2 mb-1">
                          <h3 className="font-display text-lg font-semibold">{book.title}</h3>
                          <Badge variant="secondary" className="text-xs">{book.category}</Badge>
                          {!book.inStock && (
                            <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground font-serif italic mb-2">
                          by {book.author}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${book.price?.toFixed(2)}
                          </span>
                          {book.pages && (
                            <span className="flex items-center gap-1">
                              <Layers className="h-3 w-3" />
                              {book.pages} pages
                            </span>
                          )}
                          {book.publishedYear && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {book.publishedYear}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => openEditForm(book)}
                          data-testid={`button-edit-book-${book.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setDeleteConfirm(book)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          data-testid={`button-delete-book-${book.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">
              {searchQuery ? "No Matching Books" : "Your Library Awaits"}
            </h3>
            <p className="text-muted-foreground font-serif italic mb-6">
              {searchQuery 
                ? "No books match your search. Try different terms."
                : "Add your first tome to begin building your collection."}
            </p>
            {!searchQuery && (
              <Button onClick={openCreateForm} className="font-serif gap-2" data-testid="button-add-first-book">
                <Plus className="h-4 w-4" />
                Add Your First Book
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={closeForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingBook ? "Edit Book" : "Add New Book"}
            </DialogTitle>
            <DialogDescription className="font-serif">
              {editingBook ? "Update the details of this tome." : "Add a new tome to your enchanted collection."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter book title"
                  required
                  data-testid="input-book-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Enter author name"
                  required
                  data-testid="input-book-author"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter book description..."
                rows={4}
                data-testid="input-book-description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                  data-testid="input-book-price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger data-testid="select-book-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inStock">Availability</Label>
                <Select 
                  value={formData.inStock ? "true" : "false"} 
                  onValueChange={(value) => setFormData({ ...formData, inStock: value === "true" })}
                >
                  <SelectTrigger data-testid="select-book-stock">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">In Stock</SelectItem>
                    <SelectItem value="false">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publishedYear">Published Year</Label>
                <Input
                  id="publishedYear"
                  type="number"
                  min="1000"
                  max={new Date().getFullYear()}
                  value={formData.publishedYear}
                  onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                  placeholder="1850"
                  data-testid="input-book-year"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  type="number"
                  min="1"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                  placeholder="300"
                  data-testid="input-book-pages"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverUrl">Cover Image URL</Label>
                <Input
                  id="coverUrl"
                  type="url"
                  value={formData.coverUrl}
                  onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                  placeholder="https://..."
                  data-testid="input-book-cover"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-book"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  "Saving..."
                ) : editingBook ? (
                  "Update Book"
                ) : (
                  "Add Book"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Remove This Tome?</DialogTitle>
            <DialogDescription className="font-serif">
              Are you certain you wish to remove "{deleteConfirm?.title}" from your collection? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Keep Book
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteMutation.mutate(deleteConfirm.id)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Removing..." : "Remove Book"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
