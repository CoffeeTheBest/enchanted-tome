import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Calendar, Tag, DollarSign, Layers } from "lucide-react";

export function BookDetailModal({ book, isOpen, onClose }) {
  if (!book) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden border-primary/20 bg-gradient-to-br from-background via-background to-card">
        <div className="absolute inset-0 parchment-texture opacity-5 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-0">
          <div className="relative md:w-2/5 p-6 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="relative w-full max-w-[200px] md:max-w-none aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border-2 border-primary/20">
              {book.coverUrl ? (
                <img 
                  src={book.coverUrl} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                  <BookOpen className="h-16 w-16 text-primary/40" />
                </div>
              )}
            </div>
            
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/20 blur-xl rounded-full" />
          </div>

          <div className="flex-1 p-6 md:p-8">
            <DialogHeader className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="font-serif">{book.category}</Badge>
                {book.inStock ? (
                  <Badge variant="secondary" className="text-green-600 dark:text-green-400">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              
              <DialogTitle className="font-display text-2xl md:text-3xl font-bold leading-tight" data-testid="text-book-title">
                {book.title}
              </DialogTitle>
              
              <p className="text-lg text-muted-foreground font-serif italic">
                by {book.author}
              </p>
            </DialogHeader>

            <ScrollArea className="h-[200px] md:h-[250px] pr-4 mb-6">
              <DialogDescription className="text-base leading-relaxed font-serif" data-testid="text-book-description">
                {book.description || "A mysterious tome awaits to reveal its secrets to the worthy reader..."}
              </DialogDescription>
            </ScrollArea>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {book.publishedYear && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-serif">Published {book.publishedYear}</span>
                  </div>
                )}
                {book.pages && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="font-serif">{book.pages} pages</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="font-display text-3xl font-bold text-primary">
                    {book.price?.toFixed(2)}
                  </span>
                </div>
                
                <Button 
                  size="lg" 
                  className="font-serif gap-2"
                  disabled={!book.inStock}
                  data-testid="button-add-to-cart"
                >
                  <BookOpen className="h-4 w-4" />
                  {book.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
            <path d="M0,0 Q50,20 100,0 L100,20 Q50,40 0,20 Z" fill="currentColor" opacity="0.3"/>
            <path d="M0,0 L0,100 Q20,50 0,0" fill="currentColor" opacity="0.2"/>
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none opacity-30 rotate-180">
          <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
            <path d="M0,0 Q50,20 100,0 L100,20 Q50,40 0,20 Z" fill="currentColor" opacity="0.3"/>
            <path d="M0,0 L0,100 Q20,50 0,0" fill="currentColor" opacity="0.2"/>
          </svg>
        </div>
      </DialogContent>
    </Dialog>
  );
}
