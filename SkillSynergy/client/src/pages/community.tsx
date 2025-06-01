import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MessageCircle, Users, Plus, Code, Palette, PaintbrushVertical, GraduationCap, ExternalLink } from "lucide-react";
import type { CommunityGroup } from "@shared/schema";

const iconMap = {
  "fas fa-code": Code,
  "fas fa-graduation-cap": GraduationCap,
  "fas fa-paint-brush": PaintbrushVertical,
  "fas fa-palette": Palette,
};

export default function Community() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupCategory, setNewGroupCategory] = useState("");
  const [newGroupIcon, setNewGroupIcon] = useState("fas fa-users");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: communityGroups, isLoading } = useQuery<CommunityGroup[]>({
    queryKey: ["/api/community-groups"],
  });

  const joinGroup = useMutation({
    mutationFn: async (groupId: number) => {
      return apiRequest("POST", `/api/community-groups/${groupId}/join`, {});
    },
    onSuccess: (_, groupId) => {
      toast({
        title: "Joined Group!",
        description: "You'll be redirected to the WhatsApp group shortly.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/community-groups"] });
      
      // Find the group and open WhatsApp link
      const group = communityGroups?.find(g => g.id === groupId);
      if (group?.whatsappLink) {
        window.open(group.whatsappLink, '_blank');
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to join group. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createGroup = useMutation({
    mutationFn: async (groupData: any) => {
      return apiRequest("POST", "/api/community-groups", groupData);
    },
    onSuccess: () => {
      toast({
        title: "Group Created!",
        description: "Your community group has been created successfully.",
      });
      setIsCreateDialogOpen(false);
      setNewGroupName("");
      setNewGroupDescription("");
      setNewGroupCategory("");
      setNewGroupIcon("fas fa-users");
      queryClient.invalidateQueries({ queryKey: ["/api/community-groups"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="py-16 bg-muted min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleJoinGroup = (groupId: number) => {
    joinGroup.mutate(groupId);
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || !newGroupDescription.trim() || !newGroupCategory) return;
    
    createGroup.mutate({
      name: newGroupName.trim(),
      description: newGroupDescription.trim(),
      category: newGroupCategory,
      icon: newGroupIcon,
      active: true,
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technology':
        return 'bg-blue-100 text-blue-800';
      case 'university':
        return 'bg-green-100 text-green-800';
      case 'creative':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Less than an hour ago";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  return (
    <div className="py-16 bg-muted min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Join Peer Support Groups</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with fellow students facing similar challenges. Share experiences, support each other, and grow together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityGroups?.map((group) => {
            const IconComponent = iconMap[group.icon as keyof typeof iconMap] || Users;
            
            return (
              <Card key={group.id} className="bg-white card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-sm text-gray-600">{group.memberCount} members</p>
                      </div>
                    </div>
                    <Badge className={getCategoryColor(group.category)}>
                      {group.category}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{group.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    <span>Last message: {getTimeAgo(group.createdAt)}</span>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(4, Math.floor(group.memberCount / 10)))].map((_, i) => (
                        <img
                          key={i}
                          src={`https://images.unsplash.com/photo-${507003211169 + i}-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32`}
                          alt="Group member"
                          className="w-6 h-6 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      {group.memberCount > 40 && (
                        <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                          +{Math.floor(group.memberCount / 10)}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">Recent members</span>
                  </div>

                  <Button
                    onClick={() => handleJoinGroup(group.id)}
                    disabled={joinGroup.isPending}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Join WhatsApp Group
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {(!communityGroups || communityGroups.length === 0) && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Community Groups</h3>
            <p className="text-gray-600">Be the first to create a community group and connect with fellow students!</p>
          </div>
        )}

        <div className="text-center mt-8">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create New Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Community Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    placeholder="Enter group name..."
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="groupDescription">Description</Label>
                  <Textarea
                    id="groupDescription"
                    placeholder="Describe the purpose and goals of your group..."
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="groupCategory">Category</Label>
                  <Select value={newGroupCategory} onValueChange={setNewGroupCategory}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="University">University</SelectItem>
                      <SelectItem value="Creative">Creative</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateGroup}
                    disabled={!newGroupName.trim() || !newGroupDescription.trim() || !newGroupCategory || createGroup.isPending}
                    className="btn-primary"
                  >
                    {createGroup.isPending ? "Creating..." : "Create Group"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
