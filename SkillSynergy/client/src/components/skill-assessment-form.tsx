import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SkillCategory } from "@shared/schema";
import { Code, Palette, BarChart3, Megaphone, Briefcase, GraduationCap } from "lucide-react";

const iconMap = {
  "fas fa-code": Code,
  "fas fa-palette": Palette,
  "fas fa-chart-line": BarChart3,
  "fas fa-bullhorn": Megaphone,
  "fas fa-briefcase": Briefcase,
  "fas fa-graduation-cap": GraduationCap,
};

export default function SkillAssessmentForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [timeCommitment, setTimeCommitment] = useState("");
  
  const totalSteps = 7;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: skillCategories, isLoading } = useQuery<SkillCategory[]>({
    queryKey: ["/api/skill-categories"],
  });

  const submitAssessment = useMutation({
    mutationFn: async (assessmentData: any) => {
      return apiRequest("POST", "/api/assessments", {
        userId: 1, // Mock user ID
        ...assessmentData,
      });
    },
    onSuccess: () => {
      toast({
        title: "Assessment Completed!",
        description: "Your personalized roadmaps are ready.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit assessment
      submitAssessment.mutate({
        course,
        year: parseInt(year),
        skillCategoryIds: selectedCategories,
        experienceLevel,
        careerGoals,
        timeCommitment,
        completed: true,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get course-specific skill categories
  const getCourseSpecificCategories = () => {
    if (!course) return skillCategories || [];
    
    const courseSkillMap = {
      "B.Tech Computer Science": [1, 7, 3], // Programming, AI/ML, Data
      "B.Tech Electronics": [1, 7], // Programming, AI/ML
      "B.Tech Mechanical": [1, 5], // Programming, Business
      "B.Tech Civil": [1, 5], // Programming, Business
      "BBA": [5, 4], // Business/Finance, Marketing
      "B.Sc Biology": [6], // Healthcare/Life Sciences
      "B.Com": [5, 4], // Business/Finance, Marketing
      "Other": skillCategories?.map(c => c.id) || []
    };
    
    const relevantIds = courseSkillMap[course as keyof typeof courseSkillMap] || courseSkillMap["Other"];
    return skillCategories?.filter(cat => relevantIds.includes(cat.id)) || [];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">What course are you studying?</h3>
              <p className="text-gray-600 mb-6">This helps us show relevant career paths based on your academic background.</p>
            </div>

            <div className="space-y-3">
              {[
                "B.Tech Computer Science",
                "B.Tech Electronics",
                "B.Tech Mechanical",
                "B.Tech Civil",
                "BBA",
                "B.Sc Biology",
                "B.Com",
                "Other"
              ].map((courseOption) => (
                <label
                  key={courseOption}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    course === courseOption
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 hover:border-primary hover:bg-blue-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="course"
                    value={courseOption}
                    checked={course === courseOption}
                    onChange={(e) => setCourse(e.target.value)}
                    className="mr-3"
                  />
                  <div className="font-medium">{courseOption}</div>
                </label>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Which year are you in?</h3>
              <p className="text-gray-600 mb-6">This helps us create realistic timelines for your career transition.</p>
            </div>

            <div className="space-y-3">
              {[
                { value: "1", label: "1st Year", desc: "Plenty of time to explore and build skills gradually" },
                { value: "2", label: "2nd Year", desc: "Good time to start focusing on career direction" },
                { value: "3", label: "3rd Year", desc: "Time to intensify skill building and internships" },
                { value: "4", label: "4th Year", desc: "Focus on immediate job-ready skills and quick transitions" }
              ].map((yearOption) => (
                <label
                  key={yearOption.value}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    year === yearOption.value
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 hover:border-primary hover:bg-blue-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="year"
                    value={yearOption.value}
                    checked={year === yearOption.value}
                    onChange={(e) => setYear(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{yearOption.label}</div>
                    <p className="text-sm text-gray-600">{yearOption.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">What career areas interest you?</h3>
              <p className="text-gray-600 mb-6">Based on your {course} background, here are relevant career paths. Select all that interest you.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {getCourseSpecificCategories().map((category) => {
                const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Code;
                const isSelected = selectedCategories.includes(category.id);
                
                return (
                  <label
                    key={category.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "border-primary bg-blue-50"
                        : "border-gray-200 hover:border-primary hover:bg-blue-50"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                      className="mr-3"
                    />
                    <div>
                      <div className="flex items-center">
                        <IconComponent className="text-primary mr-2 h-5 w-5" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">What's your current experience level?</h3>
              <p className="text-gray-600 mb-6">This helps us tailor the roadmap to your starting point.</p>
            </div>

            <div className="space-y-3">
              {[
                { value: "beginner", label: "Complete Beginner", desc: "I'm just starting out" },
                { value: "intermediate", label: "Some Experience", desc: "I have basic knowledge or hobbyist experience" },
                { value: "advanced", label: "Experienced", desc: "I have professional or advanced skills" }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    experienceLevel === option.value
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 hover:border-primary hover:bg-blue-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="experienceLevel"
                    value={option.value}
                    checked={experienceLevel === option.value}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <p className="text-sm text-gray-600">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">What are your career goals?</h3>
              <p className="text-gray-600 mb-6">Understanding your objectives helps us recommend the best path.</p>
            </div>

            <div className="space-y-3">
              {[
                { value: "career-change", label: "Complete Career Change", desc: "I want to switch to a completely different field" },
                { value: "skill-upgrade", label: "Upgrade Current Skills", desc: "I want to enhance my existing career" },
                { value: "freelance", label: "Start Freelancing", desc: "I want to work independently" },
                { value: "startup", label: "Start My Own Business", desc: "I want to become an entrepreneur" }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    careerGoals === option.value
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 hover:border-primary hover:bg-blue-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="careerGoals"
                    value={option.value}
                    checked={careerGoals === option.value}
                    onChange={(e) => setCareerGoals(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <p className="text-sm text-gray-600">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">How much time can you dedicate?</h3>
              <p className="text-gray-600 mb-6">This helps us create a realistic timeline for your learning journey.</p>
            </div>

            <div className="space-y-3">
              {[
                { value: "part-time", label: "Part-time (5-10 hrs/week)", desc: "I have other commitments" },
                { value: "full-time", label: "Full-time (20+ hrs/week)", desc: "I can dedicate most of my time" },
                { value: "intensive", label: "Intensive (40+ hrs/week)", desc: "I want to transition as quickly as possible" }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    timeCommitment === option.value
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 hover:border-primary hover:bg-blue-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="timeCommitment"
                    value={option.value}
                    checked={timeCommitment === option.value}
                    onChange={(e) => setTimeCommitment(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <p className="text-sm text-gray-600">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6 text-center">
            <div>
              <h3 className="text-xl font-semibold mb-4">Review Your Assessment</h3>
              <p className="text-gray-600 mb-6">Please review your responses before submitting.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-left space-y-4">
              <div>
                <strong>Course:</strong> {course}
              </div>
              
              <div>
                <strong>Year:</strong> {year}
              </div>
              
              <div>
                <strong>Selected Interests:</strong>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCategories.map(id => {
                    const category = skillCategories?.find(c => c.id === id);
                    return category ? (
                      <span key={id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {category.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              
              {experienceLevel && (
                <div>
                  <strong>Experience Level:</strong> {experienceLevel}
                </div>
              )}
              
              {careerGoals && (
                <div>
                  <strong>Career Goals:</strong> {careerGoals}
                </div>
              )}
              
              {timeCommitment && (
                <div>
                  <strong>Time Commitment:</strong> {timeCommitment}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return course !== "";
      case 2:
        return year !== "";
      case 3:
        return selectedCategories.length > 0;
      case 4:
        return experienceLevel !== "";
      case 5:
        return careerGoals !== "";
      case 6:
        return timeCommitment !== "";
      case 7:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Skill Assessment</h2>
          
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || submitAssessment.isPending}
              className="btn-primary"
            >
              {currentStep === totalSteps ? "Complete Assessment" : "Next Step"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
