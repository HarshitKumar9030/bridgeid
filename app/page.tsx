import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Solution } from "@/components/Solution";
import { AIIntegration } from "@/components/AIIntegration";
import { DemoFlow } from "@/components/DemoFlow";
import { Pitch } from "@/components/Pitch";

export default function Home() {
  return (
    <div className=" bg-background selection:bg-primary/30 min-h-screen">
      <main className="w-full">
        <Hero />
        <Problem />
        <Solution />
        <AIIntegration />
        <DemoFlow />
        <Pitch />
      </main>
    </div>
  );
}
