import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="relative mb-8">
        <BookOpen className="h-24 w-24 text-muted-foreground/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-4xl font-bold text-primary">404</span>
        </div>
      </div>
      
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
        Page Not Found
      </h1>
      
      <p className="text-muted-foreground font-serif max-w-md mb-8 leading-relaxed">
        Alas, the tome you seek has wandered beyond our shelves. 
        Perhaps it was borrowed by a mischievous spirit, 
        or misplaced in the labyrinthine archives.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/">
          <Button className="font-serif gap-2" data-testid="button-go-home">
            <Home className="h-4 w-4" />
            Return Home
          </Button>
        </Link>
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="font-serif gap-2"
          data-testid="button-go-back"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </div>
    </div>
  );
}
