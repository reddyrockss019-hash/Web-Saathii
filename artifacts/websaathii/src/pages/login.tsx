import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const features = [
    "No coding skills required",
    "AI-powered content generation",
    "Beautiful modern templates",
    "Ready in under 2 minutes"
  ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-400/5 blur-[120px]" />
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI Website Builder</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-foreground mb-6">
              Create your website in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">minutes</span>.
            </h1>
            
            <p className="text-lg text-muted-foreground mb-10 max-w-lg">
              WebSaathii uses advanced AI to generate a fully functional, beautifully designed website for your business. Just tell us what you do.
            </p>

            <ul className="space-y-4 mb-10">
              {features.map((feature, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="flex items-center gap-3 text-foreground font-medium"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  {feature}
                </motion.li>
              ))}
            </ul>

            <Button 
              size="lg" 
              onClick={() => login()}
              className="group text-lg px-8 h-14 w-full sm:w-auto"
            >
              Sign in with Google
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/50 bg-white"
          >
            <img 
              src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
              alt="WebSaathii AI Generation"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Glass overlay card */}
            <div className="absolute bottom-8 left-8 right-8 rounded-xl bg-white/80 backdrop-blur-md border border-white/40 p-6 shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Generating Design...</h3>
                  <p className="text-sm text-muted-foreground">Applying custom theme</p>
                </div>
              </div>
              <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
