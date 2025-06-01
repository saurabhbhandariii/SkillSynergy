import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Star, Users, GraduationCap, Eye, MessageCircle } from "lucide-react";
import type { Mentor } from "@shared/schema";

export default function Mentors() {
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mentors, isLoading } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors", { specialization: selectedSpecialization }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedSpecialization) params.append("specialization", selectedSpecialization);
      
      const response = await fetch(`/api/mentors?${params}`);
      if (!response.ok) throw new Error("Failed to fetch mentors");
      return response.json();
    },
  });

  const requestMentorship = useMutation({
    mutationFn: async ({ mentorId, message }: { mentorId: number; message: string }) => {
      return apiRequest("POST", "/api/mentor-requests", {
        userId: 1, // Mock user ID
        mentorId,
        message,
      });
    },
    onSuccess: () => {
      toast({
        title: "Request Sent!",
        description: "Your mentorship request has been sent. The mentor will review it shortly.",
      });
      setIsDialogOpen(false);
      setRequestMessage("");
      setSelectedMentor(null);
      queryClient.invalidateQueries({ queryKey: ["/api/mentor-requests"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send mentorship request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const specializations = ["All", "Development", "Design", "Data Science", "Marketing", "Business"];

  if (isLoading) {
    return (
      <div className="py-16 bg-muted min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="flex gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleRequestMentorship = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsDialogOpen(true);
  };

  const submitRequest = () => {
    if (!selectedMentor || !requestMessage.trim()) return;
    
    requestMentorship.mutate({
      mentorId: selectedMentor.id,
      message: requestMessage.trim(),
    });
  };

  return (
    <div className="py-16 bg-muted min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Connect with Industry Mentors</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get guidance from experienced professionals who understand your journey and can help you navigate career transitions.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {specializations.map((spec) => (
              <Button
                key={spec}
                onClick={() => setSelectedSpecialization(spec === "All" ? "" : spec)}
                variant={selectedSpecialization === (spec === "All" ? "" : spec) ? "default" : "outline"}
                className={
                  selectedSpecialization === (spec === "All" ? "" : spec)
                    ? "btn-primary"
                    : "hover:bg-gray-100"
                }
              >
                {spec}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors?.map((mentor) => (
            <Card key={mentor.id} className="bg-white card-hover border border-gray-100">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <img
                    src={mentor.profileImage || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120`}
                    alt={`${mentor.name} profile photo`}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold mb-1">{mentor.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{mentor.title}</p>
                  <p className="text-gray-500 text-xs">{mentor.company}</p>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm">
                    <GraduationCap className="h-4 w-4 text-primary mr-2" />
                    <span>{mentor.experience}+ years experience</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 text-primary mr-2" />
                    <span>Mentored {mentor.menteesCount}+ students</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-secondary mr-2" />
                    <span>{(mentor.rating / 10).toFixed(1)}/5 rating ({mentor.totalReviews} reviews)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {mentor.specializations.slice(0, 3).map((spec) => (
                    <Badge key={spec} variant="secondary" className="bg-blue-100 text-blue-800">
                      {spec}
                    </Badge>
                  ))}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  "{mentor.bio}"
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleRequestMentorship(mentor)}
                    className="flex-1 btn-primary text-sm h-auto py-2"
                    disabled={!mentor.available}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {mentor.available ? "Request Mentorship" : "Unavailable"}
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!mentors || mentors.length === 0) && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Mentors Found</h3>
            <p className="text-gray-600">
              {selectedSpecialization
                ? `No mentors found for "${selectedSpecialization}". Try selecting a different specialization.`
                : "No mentors are currently available. Please check back later."}
            </p>
          </div>
        )}

        <div className="text-center mt-8">
          <Button variant="outline" className="btn-primary">
            View All Mentors
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Request Mentorship</DialogTitle>
            </DialogHeader>
            {selectedMentor && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedMentor.profileImage || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40`}
                    alt={selectedMentor.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{selectedMentor.name}</p>
                    <p className="text-sm text-gray-600">{selectedMentor.title}</p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="message">Why would you like to connect with this mentor?</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell the mentor about your background, goals, and what specific guidance you're looking for..."
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={submitRequest}
                    disabled={!requestMessage.trim() || requestMentorship.isPending}
                    className="btn-primary"
                  >
                    {requestMentorship.isPending ? "Sending..." : "Send Request"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
