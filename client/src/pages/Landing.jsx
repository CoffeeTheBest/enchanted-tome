import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/BookCard";
import { BookDetailModal } from "@/components/BookDetailModal";
import { ScrollReveal } from "@/components/ScrollReveal";
import { OrnateDivider, OrnateFrame } from "@/components/OrnateSection";
import { BookCardSkeleton } from "@/components/LoadingSpinner";
import { BookOpen, Sparkles, Library, Clock } from "lucide-react";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Landing() {
  const [selectedBook, setSelectedBook] = useState(null);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["/api/books"],
  });

  const featuredBooks = books.slice(0, 4);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // After successful sign-in, the onAuthStateChanged listener in useAuth.js
      // will handle the user state and navigation.
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };


  return (
    <div className="min-h-screen">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
          <div className="candlelight-glow absolute top-1/4 left-1/4 w-96 h-96 opacity-30" />
          <div className="candlelight-glow absolute bottom-1/4 right-1/4 w-64 h-64 opacity-20" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <ScrollReveal>
            <div className="mb-6 flex items-center justify-center gap-3">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-serif">
                Est. MDCCLXIII
              </span>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <OrnateFrame className="inline-block mb-8 px-12 py-8">
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="text-foreground">Enchanted</span>
                <br />
                <span className="text-primary relative">
                  Tome
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                </span>
              </h1>
            </OrnateFrame>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="font-serif text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed italic">
              "Step through our weathered oaken doors and discover treasures 
              penned by candlelight, bound in leather, and waiting 
              to whisper their secrets to worthy souls."
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/books">
                <Button size="lg" className="font-serif gap-2 text-lg px-8" data-testid="button-browse-collection">
                  <Library className="h-5 w-5" />
                  Browse Our Collection
                </Button>
              </Link>
              <Button onClick={handleSignIn} variant="outline" size="lg" className="font-serif gap-2 text-lg px-8 backdrop-blur-sm" data-testid="button-enter-tome">
                <BookOpen className="h-5 w-5" />
                Sign in with Google
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="font-serif">10,000+ Rare Volumes</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-serif">Curated Since 1763</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-serif">First Editions Available</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Featured Tomes
              </h2>
              <p className="text-muted-foreground font-serif max-w-xl mx-auto">
                Hand-selected treasures from our most distinguished shelves
              </p>
            </div>
          </ScrollReveal>

          <OrnateDivider className="mb-12" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <BookCardSkeleton />
                </ScrollReveal>
              ))
            ) : featuredBooks.length > 0 ? (
              featuredBooks.map((book, index) => (
                <ScrollReveal key={book.id} delay={index * 100}>
                  <BookCard 
                    book={book} 
                    index={index}
                    onViewDetails={setSelectedBook}
                  />
                </ScrollReveal>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground font-serif italic">
                  Our shelves await their first treasures...
                </p>
              </div>
            )}
          </div>

          {books.length > 4 && (
            <ScrollReveal delay={500}>
              <div className="text-center mt-12">
                <Link href="/books">
                  <Button variant="outline" size="lg" className="font-serif gap-2" data-testid="button-view-all-books">
                    <Library className="h-4 w-4" />
                    View All {books.length} Books
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      <section className="py-20 bg-card/50 relative">
        <div className="absolute inset-0 wood-grain-texture opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={0}>
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">Curated Collection</h3>
                <p className="text-muted-foreground font-serif text-sm leading-relaxed">
                  Every volume hand-selected by our learned scholars for quality and rarity.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">Enchanted Atmosphere</h3>
                <p className="text-muted-foreground font-serif text-sm leading-relaxed">
                  Experience the magic of a centuries-old bookshop from your study.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Library className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">Timeless Treasures</h3>
                <p className="text-muted-foreground font-serif text-sm leading-relaxed">
                  First editions, rare prints, and tales waiting to be rediscovered.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold">Enchanted Tome</span>
          </div>
          <p className="text-sm text-muted-foreground font-serif">
            &copy; MDCCLXIII - Present. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2 font-serif italic">
            "In books lies the soul of the whole past time."
          </p>
        </div>
      </footer>

      <BookDetailModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
