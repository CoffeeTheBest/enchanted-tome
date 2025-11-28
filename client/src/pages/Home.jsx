import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookCard } from "@/components/BookCard";
import { BookDetailModal } from "@/components/BookDetailModal";
import { ScrollReveal } from "@/components/ScrollReveal";
import { OrnateDivider } from "@/components/OrnateSection";
import { BookCardSkeleton } from "@/components/LoadingSpinner";
import { BookOpen, Library, Shield, Sparkles, Clock, Heart } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [selectedBook, setSelectedBook] = useState(null);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["/api/books"],
  });

  const recentBooks = books.slice(0, 6);
  const isAdmin = user?.isAdmin;

  return (
    <div className="min-h-screen">
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="candlelight-glow absolute top-0 right-1/4 w-96 h-96 opacity-20" />
        
        <div className="container mx-auto px-4 relative">
          <ScrollReveal>
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm tracking-widest uppercase text-muted-foreground font-serif">
                  Welcome back, dear reader
                </span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Good {getTimeOfDay()}, 
                <span className="text-primary ml-2">
                  {user?.firstName || "Traveler"}
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground font-serif mb-8 max-w-xl leading-relaxed">
                The candles are lit, the shelves await your exploration. 
                What literary adventure shall we embark upon today?
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/books">
                  <Button size="lg" className="font-serif gap-2" data-testid="button-explore-library">
                    <Library className="h-5 w-5" />
                    Explore the Library
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" size="lg" className="font-serif gap-2" data-testid="button-admin-dashboard">
                      <Shield className="h-5 w-5" />
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal delay={0}>
              <Card className="hover-elevate">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-display text-lg">Your Collection</CardTitle>
                  <CardDescription className="font-serif">
                    Books you've discovered and saved
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-display font-bold text-primary">0</p>
                  <p className="text-xs text-muted-foreground font-serif">books saved</p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <Card className="hover-elevate">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-display text-lg">Reading Time</CardTitle>
                  <CardDescription className="font-serif">
                    Hours spent in enchantment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-display font-bold text-primary">0</p>
                  <p className="text-xs text-muted-foreground font-serif">hours this month</p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <Card className="hover-elevate">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-display text-lg">Wishlist</CardTitle>
                  <CardDescription className="font-serif">
                    Tomes awaiting your attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-display font-bold text-primary">0</p>
                  <p className="text-xs text-muted-foreground font-serif">books wished</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                  Recently Added
                </h2>
                <p className="text-muted-foreground font-serif">
                  Fresh arrivals to our enchanted shelves
                </p>
              </div>
              <Link href="/books">
                <Button variant="outline" className="font-serif gap-2" data-testid="button-view-all">
                  <Library className="h-4 w-4" />
                  View All
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          <OrnateDivider className="mb-8" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <ScrollReveal key={i} delay={i * 50}>
                  <BookCardSkeleton />
                </ScrollReveal>
              ))
            ) : recentBooks.length > 0 ? (
              recentBooks.map((book, index) => (
                <ScrollReveal key={book.id} delay={index * 50}>
                  <BookCard 
                    book={book} 
                    index={index}
                    onViewDetails={setSelectedBook}
                  />
                </ScrollReveal>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">No Books Yet</h3>
                <p className="text-muted-foreground font-serif italic mb-6">
                  The shelves await their first treasures...
                </p>
                {isAdmin && (
                  <Link href="/admin">
                    <Button className="font-serif gap-2" data-testid="button-add-first-book">
                      <Shield className="h-4 w-4" />
                      Add Your First Book
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <BookDetailModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}
