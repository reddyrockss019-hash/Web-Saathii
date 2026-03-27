import { Link } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            WebSaathii
          </span>
        </Link>

        {isAuthenticated && user && (
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-sm font-medium text-foreground">
                {user.firstName ? `Hi, ${user.firstName}` : user.email}
              </span>
              {user.profileImageUrl && (
                <img 
                  src={user.profileImageUrl} 
                  alt={user.firstName || "Profile"} 
                  className="h-8 w-8 rounded-full border border-border"
                />
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
