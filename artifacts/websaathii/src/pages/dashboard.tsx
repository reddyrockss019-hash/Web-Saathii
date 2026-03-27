import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { motion } from "framer-motion";
import { Plus, LayoutTemplate, ArrowRight, Globe } from "lucide-react";
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

  const hasRecentSite = !!localStorage.getItem("generatedHtml");

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-sm font-medium text-primary mb-1">Dashboard</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome{user?.firstName ? `, ${user.firstName}` : ""}! 👋
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Create a new website in minutes using AI — no coding, no design skills needed.
          </p>
        </motion.div>

        {/* Quick action cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {/* Create new */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card
              className="group cursor-pointer border-2 border-dashed border-border hover:border-primary/60 hover:shadow-md hover:shadow-primary/8 transition-all duration-200 bg-white h-full"
              onClick={() => setLocation("/builder")}
            >
              <CardContent className="flex flex-col items-center justify-center py-12 px-8 text-center h-full gap-5 min-h-[260px]">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-200">
                  <Plus className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-foreground">Create New Website</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Answer a few questions and get a full website in under 2 minutes
                  </p>
                </div>
                <Button
                  size="sm"
                  className="gap-2 group-hover:gap-3 transition-all"
                  onClick={(e) => { e.stopPropagation(); setLocation("/builder"); }}
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Last generated site */}
          {hasRecentSite ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card
                className="group cursor-pointer border-border hover:border-primary/40 hover:shadow-md transition-all duration-200 bg-white h-full"
                onClick={() => setLocation("/preview")}
              >
                <CardContent className="flex flex-col items-center justify-center py-12 px-8 text-center h-full gap-5 min-h-[260px]">
                  <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Globe className="h-7 w-7 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-foreground">Last Generated Site</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Preview, edit or download your most recent website
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    Open Preview <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border bg-white/60 h-full">
                <CardContent className="flex flex-col items-center justify-center py-12 px-8 text-center h-full gap-4 min-h-[260px]">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <LayoutTemplate className="h-7 w-7 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1 text-muted-foreground">No websites yet</h3>
                    <p className="text-sm text-muted-foreground/70">
                      Your generated sites will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-white p-6 sm:p-8"
        >
          <h2 className="font-bold text-lg mb-6 text-foreground">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Tell us about your business", desc: "Business name, type, location and services you offer" },
              { step: "2", title: "Choose your language", desc: "English, Hindi, or Telugu — we'll write all content natively" },
              { step: "3", title: "Download your website", desc: "Get a complete HTML file ready to go live anywhere" },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground mb-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
