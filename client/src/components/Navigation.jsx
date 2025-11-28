import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, Library, Shield, LogOut, User } from "lucide-react";

export function Navigation() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  const isAdmin = user?.isAdmin;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="wooden-nav-texture absolute inset-0 opacity-10" />
      <div className="container mx-auto px-4 py-3 relative">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <BookOpen className="h-8 w-8 text-primary transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h1 className="font-display text-xl md:text-2xl font-bold tracking-wide text-foreground">
                  Enchanted Tome
                </h1>
                <p className="text-[10px] md:text-xs text-muted-foreground tracking-widest uppercase hidden sm:block">
                  Purveyors of Fine Literature
                </p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/books" data-testid="link-browse-books">
              <Button 
                variant={location === "/books" ? "secondary" : "ghost"}
                className="gap-2 font-serif"
              >
                <Library className="h-4 w-4" />
                <span className="hidden sm:inline">Browse</span>
              </Button>
            </Link>

            {isAdmin && (
              <Link href="/admin" data-testid="link-admin">
                <Button 
                  variant={location === "/admin" ? "secondary" : "ghost"}
                  className="gap-2 font-serif"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
            )}

            <ThemeToggle />

            {isLoading ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                    <Avatar className="h-8 w-8 border-2 border-primary/30">
                      <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                      <AvatarFallback className="bg-primary/20 text-primary font-serif">
                        {user?.firstName?.[0] || user?.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="font-serif font-medium text-sm">
                      {user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer" data-testid="dropdown-admin">
                          <Shield className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <a href="/api/logout" className="flex items-center gap-2 cursor-pointer text-destructive" data-testid="dropdown-logout">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <a href="/api/login" data-testid="link-login">
                <Button className="gap-2 font-serif">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Enter the Tome</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
