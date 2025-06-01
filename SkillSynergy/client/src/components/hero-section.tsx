import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="gradient-primary text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Find Your True Career Path
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Connect with your passions, discover your skills, and build the career you actually want - not what others expect.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/assessment">
            <Button className="bg-secondary hover:bg-secondary/90 text-gray-900 px-8 py-4 text-lg h-auto">
              Start Skill Assessment
            </Button>
          </Link>
          <Link href="/mentors">
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg h-auto"
            >
              Find a Mentor
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
