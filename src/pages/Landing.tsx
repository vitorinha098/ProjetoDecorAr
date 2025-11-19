import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLocation } from "wouter";

const Landing = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center text-center max-w-md mx-auto space-y-8">
        <div className="w-20 h-20 rounded-full bg-icon-bg flex items-center justify-center">
          <Home className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-5xl font-bold text-text-dark tracking-tight">
          App DecorAR
        </h1>

        <p className="text-lg text-text-secondary leading-relaxed">
          A sua porta de entrada para um design de interiores personalizado
        </p>

        <Button
          onClick={() => setLocation("/login")}
          className="w-64 h-12 text-base font-medium"
        >
          Começar
        </Button>
      </div>
    </div>
  );
};

export default Landing;

