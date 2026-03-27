import { Link } from "wouter";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md space-y-6">
        <h1 className="text-9xl font-extrabold text-primary/20 font-display">404</h1>
        <h2 className="text-3xl font-bold text-foreground">Page not found</h2>
        <p className="text-muted-foreground text-lg">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <Link href="/" className="inline-block mt-4">
          <Button size="lg" className="w-full sm:w-auto">
            <Home className="mr-2 w-5 h-5" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
