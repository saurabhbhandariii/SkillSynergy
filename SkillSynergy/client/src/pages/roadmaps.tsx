import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, BarChart3 } from "lucide-react";
import type { Roadmap } from "@shared/schema";

export default function Roadmaps() {
  const { data: roadmaps, isLoading } = useQuery<Roadmap[]>({
    queryKey: ["/api/roadmaps"],
  });

  if (isLoading) {
    return (
      <div className="py-16 bg-muted min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-muted min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Career Roadmaps</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive learning paths designed to help you transition into your dream career. Each roadmap is carefully crafted with step-by-step guidance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {roadmaps?.map((roadmap) => {
            const gradientClass = roadmap.id % 2 === 0 
              ? "from-green-50 to-emerald-100 border-green-200" 
              : "from-blue-50 to-indigo-100 border-blue-200";
            
            const buttonClass = roadmap.id % 2 === 0 
              ? "btn-success" 
              : "btn-primary";

            return (
              <Card key={roadmap.id} className={`bg-gradient-to-br ${gradientClass} card-hover`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{roadmap.title}</h3>
                      <p className="text-gray-600 text-sm">{roadmap.description}</p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {roadmap.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {roadmap.steps.map((step, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 ${
                          step.status === 'completed' ? 'bg-green-500' :
                          step.status === 'current' ? 'bg-yellow-500' : 'bg-gray-300'
                        }`}></div>
                        <span className="text-sm flex-1">{step.title}</span>
                        <span className="text-xs text-gray-500">{step.duration}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span>{roadmap.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                      <span>{roadmap.salaryRange}</span>
                    </div>
                  </div>

                  <Button className={`w-full ${buttonClass}`}>
                    Start This Roadmap
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {(!roadmaps || roadmaps.length === 0) && (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Roadmaps Available</h3>
            <p className="text-gray-600">Complete your skill assessment to get personalized roadmap recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
