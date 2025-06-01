import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Calendar, Search, Bell } from "lucide-react";
import type { Job } from "@shared/schema";

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [jobType, setJobType] = useState("");

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs", { search: searchTerm, experienceLevel, jobType, location: "Dehradun" }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (experienceLevel) params.append("experienceLevel", experienceLevel);
      if (jobType) params.append("jobType", jobType);
      params.append("location", "Dehradun");
      
      const response = await fetch(`/api/jobs?${params}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="py-16 bg-muted min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Job Opportunities in Dehradun</h1>
            <p className="text-gray-600">Currently showing sample jobs. LinkedIn and Indeed API integration available for real-time job data.</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button className="btn-primary">
              <Bell className="h-4 w-4 mr-2" />
              Set Job Alert
            </Button>
          </div>
        </div>

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">i</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Real Job Integration Available</h3>
              <p className="text-sm text-blue-700 mt-1">
                We can integrate with LinkedIn Jobs API and Indeed API to show real job listings. Contact support to enable live job data for your region.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs, companies, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Experience Levels</SelectItem>
                <SelectItem value="Entry Level">Entry Level</SelectItem>
                <SelectItem value="Mid Level">Mid Level</SelectItem>
                <SelectItem value="Senior Level">Senior Level</SelectItem>
              </SelectContent>
            </Select>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Job Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {jobs?.map((job) => (
            <Card key={job.id} className="bg-white card-hover">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mr-4">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <span className="font-medium">{job.company}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.skillTags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">
                              {tag}
                            </Badge>
                          ))}
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            {job.experienceLevel}
                          </Badge>
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                            {job.jobType}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6 text-right">
                    <p className="text-lg font-semibold text-green-600 mb-1">{job.salaryRange}</p>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                    </div>
                    <Button className="btn-primary w-full lg:w-auto">
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!jobs || jobs.length === 0) && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Jobs Found</h3>
            <p className="text-gray-600">
              {searchTerm || experienceLevel || jobType
                ? "Try adjusting your search filters to find more opportunities."
                : "No job listings are currently available. Check back later for new opportunities."}
            </p>
          </div>
        )}

        {jobs && jobs.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" className="btn-primary">
              Load More Jobs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
