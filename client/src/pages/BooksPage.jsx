import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookCard } from "@/components/BookCard";
import { BookDetailModal } from "@/components/BookDetailModal";
import { ScrollReveal } from "@/components/ScrollReveal";
import { OrnateDivider } from "@/components/OrnateSection";
import { BookCardSkeleton } from "@/components/LoadingSpinner";
import { Search, Filter, BookOpen, X, SlidersHorizontal } from "lucide-react";

export default function BooksPage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [showFilters, setShowFilters] = useState(false);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["/api/books"],
  });

  const categories = useMemo(() => {
    const cats = [...new Set(books.map(book => book.category))];
    return cats.sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(book => book.category === selectedCategory);
    }

    if (priceRange !== "all") {
      switch (priceRange) {
        case "under10":
          result = result.filter(book => book.price < 10);
          break;
        case "10to25":
          result = result.filter(book => book.price >= 10 && book.price <= 25);
          break;
        case "25to50":
          result = result.filter(book => book.price >= 25 && book.price <= 50);
          break;
        case "over50":
          result = result.filter(book => book.price > 50);
          break;
      }
    }

    switch (sortBy) {
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "author":
        result.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [books, searchQuery, selectedCategory, priceRange, sortBy]);

  const activeFiltersCount = [
    selectedCategory !== "all",
    priceRange !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory("all");
    setPriceRange("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Our Library Collection
            </h1>
            <p className="text-muted-foreground font-serif max-w-xl mx-auto">
              Browse through centuries of literary treasures, 
              each tome waiting to transport you to distant realms.
            </p>
          </div>
        </ScrollReveal>

        <OrnateDivider className="mb-8" />

        <ScrollReveal delay={100}>
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by title, author, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-serif"
                  data-testid="input-search-books"
                />
              </div>
              
              <Button
                variant="outline"
                className="gap-2 font-serif"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] font-serif" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="author">Author (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-4 p-4 rounded-lg bg-card/50 border border-border/50">
                <div className="space-y-2">
                  <label className="text-sm font-medium font-serif">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]" data-testid="select-category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium font-serif">Price Range</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="w-[180px]" data-testid="select-price">
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Price</SelectItem>
                      <SelectItem value="under10">Under $10</SelectItem>
                      <SelectItem value="10to25">$10 - $25</SelectItem>
                      <SelectItem value="25to50">$25 - $50</SelectItem>
                      <SelectItem value="over50">Over $50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {activeFiltersCount > 0 && (
                  <div className="flex items-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="gap-1 font-serif"
                      data-testid="button-clear-filters"
                    >
                      <X className="h-3 w-3" />
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-serif" data-testid="text-results-count">
            Showing {filteredBooks.length} of {books.length} tomes
          </p>
          
          {(searchQuery || selectedCategory !== "all" || priceRange !== "all") && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {priceRange !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {priceRange === "under10" && "Under $10"}
                  {priceRange === "10to25" && "$10 - $25"}
                  {priceRange === "25to50" && "$25 - $50"}
                  {priceRange === "over50" && "Over $50"}
                  <button onClick={() => setPriceRange("all")} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book, index) => (
              <ScrollReveal key={book.id} delay={Math.min(index * 30, 300)}>
                <BookCard 
                  book={book} 
                  index={index}
                  onViewDetails={setSelectedBook}
                />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">No Tomes Found</h3>
            <p className="text-muted-foreground font-serif italic mb-6 max-w-md mx-auto">
              {searchQuery || selectedCategory !== "all" || priceRange !== "all"
                ? "No books match your current search. Perhaps try different terms or clear the filters?"
                : "Our shelves are currently empty. Check back soon for new arrivals."}
            </p>
            {(searchQuery || selectedCategory !== "all" || priceRange !== "all") && (
              <Button variant="outline" onClick={clearFilters} className="font-serif gap-2" data-testid="button-clear-all-filters">
                <X className="h-4 w-4" />
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>

      <BookDetailModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
