import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye } from "lucide-react";

export function BookCard({ book, onViewDetails, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);

  const animationDelay = index * 50;

  return (
    <Card
      className="book-card group relative overflow-visible cursor-pointer transition-all duration-500"
      style={{
        animationDelay: `${animationDelay}ms`,
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(book)}
      data-testid={`card-book-${book.id}`}
    >
      <div 
        className="book-spine absolute left-0 top-0 bottom-0 w-4 rounded-l-xl"
        style={{
          background: `linear-gradient(to right, 
            hsl(var(--primary) / 0.8), 
            hsl(var(--primary) / 0.4)
          )`,
          transform: isHovered ? "rotateY(-15deg)" : "rotateY(0deg)",
          transformOrigin: "left",
          transition: "transform 0.4s ease-out",
        }}
      />
      
      <div className="relative p-4 md:p-6 pl-6 md:pl-8">
        <div className="aspect-[2/3] relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          {book.coverUrl ? (
            <img 
              src={book.coverUrl} 
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-primary/40" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 backdrop-blur-sm bg-background/70"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(book);
            }}
            data-testid={`button-view-book-${book.id}`}
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <Badge variant="secondary" className="text-xs font-serif">
              {book.category}
            </Badge>
            <span className="font-display text-lg font-bold text-primary">
              ${book.price?.toFixed(2)}
            </span>
          </div>

          <h3 className="font-display text-lg font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>

          <p className="text-sm text-muted-foreground font-serif italic">
            by {book.author}
          </p>

          {book.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {book.description}
            </p>
          )}
        </div>
      </div>

      <div 
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: isHovered 
            ? "8px 8px 20px rgba(0,0,0,0.2), -2px -2px 10px rgba(255,255,255,0.1)" 
            : "4px 4px 10px rgba(0,0,0,0.1)",
          transition: "box-shadow 0.4s ease-out",
        }}
      />
    </Card>
  );
}
