import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { motion } from "framer-motion";
import { Plus, Layout, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.firstName || "Creator"}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your generated websites or create a new one in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card 
              className="h-full group cursor-pointer hover:border-primary/50 transition-colors bg-gradient-to-br from-white to-primary/5"
              onClick={() => setLocation("/builder")}
            >
              <CardContent className="flex flex-col items-center justify-center p-12 h-[300px] text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Create New Website</h3>
                  <p className="text-sm text-muted-foreground">Launch the AI builder wizard</p>
                </div>
                <Button variant="ghost" className="mt-4 group-hover:bg-primary group-hover:text-white">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Placeholder for previously generated websites */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full border-dashed bg-transparent">
              <CardContent className="flex flex-col items-center justify-center p-12 h-[300px] text-center opacity-60">
                <Layout className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium">No sites yet</h3>
                <p className="text-sm text-muted-foreground">Your generated sites will appear here</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
