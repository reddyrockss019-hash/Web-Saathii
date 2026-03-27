import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles, Building2, Store, MapPin, Globe } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGenerateWebsite, type GenerateWebsiteRequest } from "@/hooks/use-generate";
import { cn } from "@/lib/utils";

const BUSINESS_TYPES = [
  "Bakery", "Restaurant", "Salon", "Gym", "Retail Shop", 
  "Clinic", "School", "Photography", "Catering", "Other"
];

const SUGGESTED_SERVICES: Record<string, string[]> = {
  "Bakery": ["Cakes", "Pastries", "Cookies", "Bread", "Custom Orders", "Cake Decoration"],
  "Restaurant": ["Dine-In", "Takeaway", "Home Delivery", "Catering", "Special Events", "Party Bookings"],
  "Salon": ["Haircut", "Hair Color", "Facial", "Manicure", "Pedicure", "Bridal Makeup"],
  "Gym": ["Personal Training", "Group Classes", "Yoga", "Zumba", "Strength Training", "Cardio"],
  "Retail Shop": ["Home Delivery", "In-Store Shopping", "Online Ordering", "Gift Wrapping", "Exchange Policy"],
  "Clinic": ["Consultation", "Lab Tests", "Pharmacy", "Home Visits", "Emergency Care", "Specialist Referral"],
  "School": ["Primary Education", "Secondary Education", "After-School Programs", "Online Classes", "Counseling"],
  "Photography": ["Wedding Photography", "Portrait Sessions", "Event Coverage", "Product Photography", "Photo Editing"],
  "Catering": ["Wedding Catering", "Corporate Events", "Birthday Parties", "Home Delivery", "Veg/Non-Veg Options"],
  "Other": ["Our Services", "About Us", "Contact Us", "Portfolio", "Testimonials", "Special Offers"]
};

const LANGUAGES = ["English", "Hindi", "Telugu"] as const;

export default function Builder() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<GenerateWebsiteRequest>>({
    businessName: "",
    businessType: "Other",
    location: "",
    selectedItems: [],
    language: "English"
  });

  const { mutate: generateWebsite, isPending, error } = useGenerateWebsite();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const updateForm = (updates: Partial<GenerateWebsiteRequest>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (step < 4) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const handleGenerate = () => {
    if (
      !formData.businessName || 
      !formData.businessType || 
      !formData.location || 
      !formData.selectedItems?.length || 
      !formData.language
    ) {
      return;
    }

    const request = formData as GenerateWebsiteRequest;
    localStorage.setItem("builderData", JSON.stringify(request));

    generateWebsite(request, {
      onSuccess: (data) => {
        localStorage.setItem("generatedHtml", data.html);
        setLocation("/preview");
      }
    });
  };

  const isStep1Valid = formData.businessName && formData.businessType && formData.location;
  const isStep2Valid = formData.selectedItems && formData.selectedItems.length > 0;
  const isStep3Valid = !!formData.language;

  if (isLoading || !isAuthenticated) return null;

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center space-y-8 max-w-sm w-full"
        >
          <img src="/logo.png" alt="WebSaathii" className="h-28 w-auto drop-shadow-sm animate-pulse" />
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight mb-2">Building your website...</h2>
            <p className="text-muted-foreground">
              Our AI is writing content in <strong>{formData.language}</strong> and designing your site for <strong>{formData.businessName}</strong>.
            </p>
          </div>
          <div className="w-full space-y-2">
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-green-500"
                initial={{ width: "0%" }}
                animate={{ width: "92%" }}
                transition={{ duration: 18, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">This takes about 15–20 seconds</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Progress Bar */}
        <div className="mb-10 mt-4">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col items-center relative z-10">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300",
                  step === i ? "bg-primary text-white shadow-lg shadow-primary/30" : 
                  step > i ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                )}>
                  {step > i ? <Check className="w-5 h-5" /> : i}
                </div>
                <span className="text-xs font-medium mt-2 hidden sm:block text-muted-foreground">
                  {i === 1 ? "Business" : i === 2 ? "Services" : i === 3 ? "Language" : "Review"}
                </span>
              </div>
            ))}
            <div className="absolute left-8 right-8 sm:left-12 sm:right-12 h-1 bg-secondary -z-0 top-14 sm:top-9 -translate-y-1/2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-in-out" 
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden relative border-border/50">
          <CardContent className="flex-1 p-6 sm:p-10 relative">
            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-8 h-full"
                >
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Tell us about your business</h2>
                    <p className="text-muted-foreground">We need a few details to customize your website design and copy.</p>
                  </div>

                  <div className="space-y-6 max-w-lg">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" /> Business Name
                      </label>
                      <Input 
                        placeholder="e.g. Royal Bakes" 
                        value={formData.businessName}
                        onChange={(e) => updateForm({ businessName: e.target.value })}
                        className="h-14 text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <Store className="w-4 h-4 text-primary" /> Business Type
                      </label>
                      <select 
                        className="flex h-14 w-full rounded-xl border border-border bg-white px-4 py-2 text-lg text-foreground shadow-sm shadow-black/5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none"
                        value={formData.businessType}
                        onChange={(e) => {
                          updateForm({ 
                            businessType: e.target.value,
                            selectedItems: [] // reset selections when changing type
                          });
                        }}
                      >
                        {BUSINESS_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" /> Location
                      </label>
                      <Input 
                        placeholder="e.g. Mumbai, India" 
                        value={formData.location}
                        onChange={(e) => updateForm({ location: e.target.value })}
                        className="h-14 text-lg"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-8 h-full"
                >
                  <div>
                    <h2 className="text-3xl font-bold mb-2">What services do you offer?</h2>
                    <p className="text-muted-foreground">Select all that apply. We'll feature these prominently on your site.</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {SUGGESTED_SERVICES[formData.businessType || "Other"].map((service) => {
                      const isSelected = formData.selectedItems?.includes(service);
                      return (
                        <div 
                          key={service}
                          onClick={() => {
                            const current = formData.selectedItems || [];
                            const updated = isSelected 
                              ? current.filter(item => item !== service)
                              : [...current, service];
                            updateForm({ selectedItems: updated });
                          }}
                          className={cn(
                            "cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between",
                            isSelected 
                              ? "border-primary bg-primary/5 text-primary font-medium shadow-sm" 
                              : "border-border bg-white hover:border-primary/30 hover:bg-slate-50 text-foreground"
                          )}
                        >
                          {service}
                          {isSelected && <Check className="w-5 h-5" />}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-8 h-full"
                >
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Choose your website language</h2>
                    <p className="text-muted-foreground">Our AI will generate copy in the selected language natively.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {LANGUAGES.map((lang) => {
                      const isSelected = formData.language === lang;
                      return (
                        <div 
                          key={lang}
                          onClick={() => updateForm({ language: lang })}
                          className={cn(
                            "cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-4 h-40",
                            isSelected 
                              ? "border-primary bg-primary/5 shadow-md scale-105" 
                              : "border-border bg-white hover:border-primary/30 hover:bg-slate-50"
                          )}
                        >
                          <Globe className={cn("w-10 h-10", isSelected ? "text-primary" : "text-muted-foreground")} />
                          <span className={cn("text-xl font-bold", isSelected ? "text-primary" : "text-foreground")}>
                            {lang}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-8 h-full"
                >
                  <div className="text-center max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-4xl font-bold mb-4">Ready to generate!</h2>
                    <p className="text-xl text-muted-foreground mb-10">
                      We have everything we need. Our AI will now build a stunning, custom website for <strong className="text-foreground">{formData.businessName}</strong>.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-border max-w-2xl mx-auto space-y-4">
                    <div className="flex justify-between border-b border-border pb-4">
                      <span className="text-muted-foreground">Business Type</span>
                      <span className="font-semibold">{formData.businessType}</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-4">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-semibold">{formData.location}</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-4">
                      <span className="text-muted-foreground">Services Highlighted</span>
                      <span className="font-semibold text-right max-w-[60%]">{formData.selectedItems?.join(", ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language</span>
                      <span className="font-semibold">{formData.language}</span>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-center max-w-2xl mx-auto font-medium">
                      {error.message || "Failed to generate website. Please try again."}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          {/* Footer Navigation */}
          <div className="p-6 bg-slate-50 border-t border-border flex justify-between items-center mt-auto">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              disabled={step === 1}
              className="w-32"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            
            {step < 4 ? (
              <Button 
                onClick={handleNext} 
                disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)}
                className="w-32"
              >
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleGenerate} 
                size="lg"
                className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 w-48 shadow-lg shadow-primary/25"
              >
                <Sparkles className="w-4 h-4 mr-2" /> Generate
              </Button>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
