import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { Download, Edit3, RotateCcw, ArrowLeft, Monitor, Smartphone, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGenerateWebsite } from "@/hooks/use-generate";

export default function Preview() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  const builderData = (() => {
    try {
      return JSON.parse(localStorage.getItem("builderData") || "null");
    } catch {
      return null;
    }
  })();

  const { mutate: regenerate, isPending: isRegenerating } = useGenerateWebsite();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setLocation("/");
      return;
    }
    const storedHtml = localStorage.getItem("generatedHtml");
    if (storedHtml) {
      setHtmlContent(storedHtml);
      setEditValue(storedHtml);
    } else {
      setLocation("/builder");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "websaathii-site.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveEdit = () => {
    setHtmlContent(editValue);
    localStorage.setItem("generatedHtml", editValue);
    setIsEditing(false);
  };

  const handleRegenerate = () => {
    if (!builderData) {
      setLocation("/builder");
      return;
    }
    regenerate(builderData, {
      onSuccess: (data) => {
        setHtmlContent(data.html);
        setEditValue(data.html);
        localStorage.setItem("generatedHtml", data.html);
      },
    });
  };

  if (isLoading || !isAuthenticated) return null;
  if (!htmlContent && !isRegenerating) return null;

  if (isRegenerating) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-xl animate-pulse">
            <RefreshCw className="h-8 w-8 text-white animate-spin" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Regenerating your website...</h2>
            <p className="text-muted-foreground">This may take a few seconds.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-background overflow-hidden">
      {/* LEFT PANEL */}
      <div className="w-full md:w-[340px] lg:w-[380px] border-b md:border-b-0 md:border-r border-border bg-white flex flex-col z-10 shadow-xl shadow-black/5">
        <div className="px-5 py-3 border-b border-border bg-slate-50/80 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")} title="Back to dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <img src="/logo.png" alt="WebSaathii" className="h-8 w-auto" />
          <span className="font-bold text-base">
            Web<span className="text-green-500">Saathii</span>
          </span>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
          <div>
            <h2 className="text-lg font-bold mb-1">Your site is ready!</h2>
            <p className="text-sm text-muted-foreground">
              Review, edit, or download your generated website.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant="outline"
              className="justify-start h-12 px-4"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              <RefreshCw className="mr-3 h-5 w-5 text-primary" />
              Regenerate Website
            </Button>

            <Button
              variant="outline"
              className="justify-start h-12 px-4"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="mr-3 h-5 w-5 text-primary" />
              {isEditing ? "Cancel Editing" : "Edit HTML Content"}
            </Button>

            <Button
              className="justify-start h-12 px-4"
              onClick={handleDownload}
            >
              <Download className="mr-3 h-5 w-5" />
              Download HTML File
            </Button>
          </div>

          <div className="mt-auto pt-4 border-t border-border">
            <Button
              variant="secondary"
              className="w-full h-11"
              onClick={() => setLocation("/builder")}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Start Over
            </Button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - PREVIEW */}
      <div className="flex-1 flex flex-col relative bg-slate-100">
        <div className="h-14 border-b border-border bg-white flex items-center justify-center gap-2 px-4 shadow-sm">
          <Button
            variant={viewMode === "desktop" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("desktop")}
          >
            <Monitor className="h-4 w-4 mr-2" /> Desktop
          </Button>
          <Button
            variant={viewMode === "mobile" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("mobile")}
          >
            <Smartphone className="h-4 w-4 mr-2" /> Mobile
          </Button>
        </div>

        <div className="flex-1 overflow-hidden flex items-center justify-center p-4 sm:p-8">
          {isEditing ? (
            <div className="w-full h-full bg-white rounded-xl shadow-lg border border-border flex flex-col overflow-hidden">
              <div className="bg-slate-900 px-4 py-2 flex justify-between items-center text-white">
                <span className="text-sm font-mono font-semibold text-slate-300">index.html</span>
                <Button size="sm" onClick={handleSaveEdit} className="h-8">Save Changes</Button>
              </div>
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 w-full p-4 font-mono text-sm bg-slate-950 text-slate-100 focus:outline-none resize-none"
                spellCheck={false}
              />
            </div>
          ) : (
            <div className={`transition-all duration-300 ease-in-out ${
              viewMode === "mobile"
                ? "w-[375px] h-[812px] rounded-3xl border-[8px] border-slate-800 shadow-2xl overflow-hidden"
                : "w-full h-full rounded-xl border border-border shadow-lg bg-white overflow-hidden"
            }`}>
              <iframe
                title="Generated Website Preview"
                srcDoc={htmlContent}
                className="w-full h-full border-none bg-white"
                sandbox="allow-scripts"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
