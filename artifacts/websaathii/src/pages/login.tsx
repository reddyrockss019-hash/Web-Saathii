import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "No coding skills required",
  "AI-powered content generation",
  "Available in English, Hindi & Telugu",
  "Download your site instantly",
];

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

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[15%] -top-[10%] h-[60%] w-[50%] rounded-full bg-primary/5 blur-[140px]" />
        <div className="absolute -right-[10%] top-[35%] h-[55%] w-[45%] rounded-full bg-green-400/5 blur-[140px]" />
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

            {/* LEFT — branding + CTA */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8 flex flex-col items-center gap-3 lg:items-start"
              >
                <img src="/logo.png" alt="WebSaathii" className="h-28 w-auto drop-shadow-sm" />
                <div className="text-center lg:text-left">
                  <h1 className="text-3xl font-extrabold tracking-tight">
                    Web<span className="text-green-500">Saathii</span>
                  </h1>
                  <p className="text-sm font-medium text-muted-foreground">Your AI Website Buddy</p>
                </div>
              </motion.div>

              <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                Build your website in{" "}
                <span className="bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">
                  minutes
                </span>
                .
              </h2>

              <p className="mb-8 max-w-md text-lg text-muted-foreground">
                Tell us about your business, choose your language, and let our AI write, design, and deliver a complete website — no tech skills needed.
              </p>

              <ul className="mb-10 space-y-3.5 self-start">
                {features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.08 }}
                    className="flex items-center gap-3 text-sm font-medium text-foreground"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <Button
                size="lg"
                onClick={() => login()}
                className="group h-13 w-full gap-2 px-8 text-base shadow-lg shadow-primary/20 sm:w-auto"
              >
                Sign in with Google
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <p className="mt-4 text-xs text-muted-foreground">
                Free to use · No credit card required
              </p>
            </motion.div>

            {/* RIGHT — animated preview card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="hidden lg:flex flex-col gap-4"
            >
              <div className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-border/50 bg-white shadow-2xl shadow-primary/8">
                <img
                  src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
                  alt="WebSaathii preview"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Glass overlay */}
                <div className="absolute inset-x-6 bottom-6 rounded-xl border border-white/50 bg-white/85 p-5 shadow-xl backdrop-blur-md">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Generating your website...</p>
                      <p className="text-xs text-muted-foreground">Applying custom design</p>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-green-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  <div className="mt-3 flex gap-2">
                    {["Writing content", "Designing layout", "Adding images"].map((step, i) => (
                      <motion.span
                        key={step}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.4, repeat: Infinity, repeatDelay: 2.8 }}
                        className="rounded-full bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary"
                      >
                        {step}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}
