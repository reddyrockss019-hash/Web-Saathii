import { Link } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/90 backdrop-blur-xl shadow-sm shadow-black/[0.03]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <img src="/logo.png" alt="WebSaathii" className="h-9 w-auto" />
          <span className="font-bold text-xl tracking-tight text-foreground hidden sm:block">
            Web<span className="text-green-500">Saathii</span>
          </span>
        </Link>

        {isAuthenticated && user && (
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 sm:flex">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.firstName || "Profile"}
                  className="h-8 w-8 rounded-full border-2 border-border object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {(user.firstName?.[0] || user.email?.[0] || "U").toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-foreground">
                {user.firstName ? `Hi, ${user.firstName}` : user.email}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => logout()} title="Sign out">
              <LogOut className="h-4.5 w-4.5 text-muted-foreground" />
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
