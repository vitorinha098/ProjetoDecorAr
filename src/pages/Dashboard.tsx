import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [, setLocation] = useLocation();

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) {
      setLocation("/login");
    }
  }, [userEmail, setLocation]);

  if (!userEmail) return null;

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    setLocation("/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <h1 className="text-4xl font-bold text-text-dark">
          Bem-vindo ao DecorAR
        </h1>
        <p className="text-lg text-text-secondary">
          Olá, {userEmail}!
        </p>
        <Button onClick={handleLogout} variant="outline" className="mt-4">
          Terminar Sessão
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
