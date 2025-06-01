import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroSection from "@/components/hero-section";
import { ClipboardList, Route, Users, Star, Calendar } from "lucide-react";
import type { Roadmap, Job, Mentor, CommunityGroup } from "@shared/schema";

export default function Home() {
  const { data: roadmaps } = useQuery<Roadmap[]>({
    queryKey: ["/api/roadmaps"],
  });

  const { data: jobs } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const { data: mentors } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors"],
  });

  const { data: communityGroups } = useQuery<CommunityGroup[]>({
    queryKey: ["/api/community-groups"],
  });

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Get Started in 3 Simple Steps</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-20 transition-colors">
                <ClipboardList className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Assess Your Skills</h3>
              <p className="text-gray-600 mb-6">Take our comprehensive skill assessment to discover your strengths and interests.</p>
              <Link href="/assessment">
                <Button variant="link" className="text-primary hover:text-blue-800 font-medium p-0">
                  Take Assessment →
                </Button>
              </Link>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-500 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-20 transition-colors">
                <Route className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Your Roadmap</h3>
              <p className="text-gray-600 mb-6">Receive a personalized career roadmap based on your skills and goals.</p>
              <Link href="/roadmaps">
                <Button variant="link" className="text-green-500 hover:text-green-700 font-medium p-0">
                  View Roadmaps →
                </Button>
              </Link>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-20 transition-colors">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect & Grow</h3>
              <p className="text-gray-600 mb-6">Join peer groups and connect with mentors in your field.</p>
              <Link href="/community">
                <Button variant="link" className="text-secondary hover:text-yellow-600 font-medium p-0">
                  Join Community →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Roadmaps */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Career Roadmaps</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover the most sought-after career paths among students like you.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {roadmaps?.slice(0, 2).map((roadmap) => (
              <Card key={roadmap.id} className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-2">{roadmap.title}</h3>
                      <p className="text-gray-600 text-sm">Based on: {roadmap.skillCategoryIds.length} skill areas</p>
                    </div>
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">Popular</span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {roadmap.steps.slice(0, 3).map((step, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 ${
                          step.status === 'completed' ? 'bg-green-500' :
                          step.status === 'current' ? 'bg-yellow-500' : 'bg-gray-300'
                        }`}></div>
                        <span className="text-sm">{step.title}</span>
                      </div>
                    ))}
                    {roadmap.steps.length > 3 && (
                      <div className="text-sm text-gray-500 ml-7">
                        +{roadmap.steps.length - 3} more steps
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{roadmap.estimatedDuration}</span> • 
                      <span className="ml-1">{roadmap.salaryRange}</span>
                    </div>
                    <Link href="/roadmaps">
                      <Button className="btn-primary text-sm h-auto py-2 px-4">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/roadmaps">
              <Button variant="link" className="text-primary hover:text-blue-800 font-medium">
                Explore All Roadmaps →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Job Opportunities</h2>
              <p className="text-gray-600">Fresh opportunities in Dehradun and nearby areas</p>
            </div>
            <Link href="/jobs">
              <Button className="btn-primary">
                View All Jobs
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {jobs?.slice(0, 3).map((job) => (
              <Card key={job.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mr-4">
                          <span className="text-primary font-semibold">{job.company.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                          <p className="text-gray-600 mb-2">{job.company} • {job.location}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.skillTags.slice(0, 3).map((tag) => (
                              <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {job.experienceLevel}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0 lg:ml-6 text-right">
                      <p className="text-lg font-semibold text-green-600 mb-1">{job.salaryRange}</p>
                      <p className="text-sm text-gray-600 mb-3 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(job.postedAt).toLocaleDateString()}
                      </p>
                      <Button className="btn-primary w-full lg:w-auto">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Students Choose CareerConnect</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Designed specifically for Graphic Era University students facing career uncertainty.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Course-Specific Guidance</h3>
                <p className="text-gray-600 text-sm">
                  Get recommendations tailored to your specific course background - whether you're in B.Tech, BBA, or B.Sc Biology.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-500 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Route className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Year-Based Roadmaps</h3>
                <p className="text-gray-600 text-sm">
                  Different timelines for different years - intensive paths for final year students, comprehensive ones for first years.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-500 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Peer Support Groups</h3>
                <p className="text-gray-600 text-sm">
                  Connect with fellow students facing similar challenges. Share experiences and support each other's journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
