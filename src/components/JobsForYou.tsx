import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase, 
  Star,
  Building2,
  TrendingUp,
  Bookmark,
  X
} from 'lucide-react';
import { useState } from "react";

interface JobData {
  id: number;
  title: string;
  company: string;
  location: string;
  country: string;
  salary: string;
  type: string;
  posted: string;
  matchScore: number;
  tags: string[];
  reason: string;
  description: string;
}

interface JobsForYouProps {
  onApply?: (job: { title: string; company: string; location: string }) => void;
  onSaveJob?: (job: JobData) => void;
  savedJobIds?: number[];
  onNavigateToResume?: () => void;
}

export function JobsForYou({ onApply, onSaveJob, savedJobIds, onNavigateToResume, onNavigateToPositions }: JobsForYouProps) {
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const recommendedJobs: JobData[] = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Tech Innovations Inc.",
      location: "Singapore",
      country: "Singapore",
      salary: "PHP 120,000 - 160,000",
      type: "Full-time",
      posted: "1 day ago",
      matchScore: 95,
      tags: ["React", "Node.js", "TypeScript"],
      reason: "Your technical skills match this position perfectly",
      description: "..."
    },
    {
      id: 2,
      title: "Registered Nurse - ICU",
      company: "Healthcare International",
      location: "Dubai, UAE",
      salary: "PHP 85,000 - 110,000",
      type: "Full-time",
      posted: "2 days ago",
      matchScore: 92,
      tags: ["Nursing", "Healthcare", "ICU"],
      reason:
        "Your healthcare certifications align with requirements",
      description: "Join our world-class healthcare facility in Dubai as an ICU Registered Nurse. You will provide critical care to patients, work with advanced medical equipment, and collaborate with international medical teams. We offer tax-free salary, accommodation, annual flights home, and comprehensive health insurance for you and your family.",
    },
    {
      id: 3,
      title: "Hotel Operations Manager",
      company: "Marriott International",
      location: "Doha, Qatar",
      salary: "PHP 95,000 - 130,000",
      type: "Full-time",
      posted: "3 days ago",
      matchScore: 88,
      tags: ["Hospitality", "Management", "Operations"],
      reason: "Your management experience is a great fit",
      description: "Marriott International is seeking an experienced Hotel Operations Manager to oversee daily operations of our luxury property in Doha. You will manage staff, ensure exceptional guest experiences, and maintain operational excellence. Benefits include competitive salary, performance bonuses, accommodation, and career advancement within the Marriott network.",
    },
    {
      id: 4,
      title: "Mechanical Engineer",
      company: "Saudi Aramco",
      location: "Riyadh, Saudi Arabia",
      salary: "PHP 100,000 - 140,000",
      type: "Full-time",
      posted: "4 days ago",
      matchScore: 85,
      tags: ["Engineering", "Mechanical", "Oil & Gas"],
      reason:
        "Your engineering qualifications meet their standards",
      description: "Saudi Aramco, the world's leading oil and gas company, is hiring Mechanical Engineers for our Riyadh operations. You will work on major infrastructure projects, perform system design and analysis, and ensure operational efficiency. Excellent package includes tax-free salary, housing allowance, family benefits, and professional development opportunities.",
    },
    {
      id: 5,
      title: "Executive Chef",
      company: "Royal Caribbean Cruises",
      location: "Cruise Ship",
      salary: "PHP 75,000 - 95,000",
      type: "Contract",
      posted: "5 days ago",
      matchScore: 82,
      tags: ["Culinary", "Leadership", "Hospitality"],
      reason: "Your culinary expertise is highly sought after",
      description: "Royal Caribbean is looking for an experienced Executive Chef to lead our culinary operations aboard luxury cruise ships. You will manage kitchen operations, create innovative menus, and lead a diverse culinary team. This contract position includes all accommodations, meals, and the opportunity to travel the world while practicing your craft.",
    },
    {
      id: 6,
      title: "Financial Controller",
      company: "KPMG Middle East",
      location: "Abu Dhabi, UAE",
      salary: "PHP 110,000 - 150,000",
      type: "Full-time",
      posted: "1 week ago",
      matchScore: 80,
      tags: ["Finance", "Accounting", "CPA"],
      reason: "Your financial background matches perfectly",
      description: "KPMG Middle East seeks a qualified Financial Controller to manage financial operations for our Abu Dhabi office. Responsibilities include financial reporting, budget management, and compliance oversight. We offer competitive tax-free compensation, professional certification support, housing allowance, and exceptional career growth within a global organization.",
    },
    {
      id: 7,
      title: "Construction Supervisor",
      company: "Emirates Construction",
      location: "Dubai, UAE",
      salary: "PHP 65,000 - 85,000",
      type: "Full-time",
      posted: "1 week ago",
      matchScore: 75,
      tags: ["Construction", "Supervision", "Safety"],
      reason: "Your construction experience is relevant",
      description: "Emirates Construction is hiring Construction Supervisors for major development projects in Dubai. You will oversee site operations, ensure safety compliance, and coordinate with subcontractors. Package includes competitive salary, accommodation, transportation, medical insurance, and annual leave with flight tickets home.",
    },
    {
      id: 8,
      title: "Customer Service Representative",
      company: "BPO Solutions Inc.",
      location: "Kuala Lumpur, Malaysia",
      salary: "PHP 35,000 - 45,000",
      type: "Full-time",
      posted: "2 weeks ago",
      matchScore: 60,
      tags: ["Customer Service", "Communication", "BPO"],
      reason: "Basic communication skills match",
      description: "Join our BPO team in Kuala Lumpur as a Customer Service Representative. You will handle customer inquiries, resolve issues, and provide excellent service to international clients. We provide comprehensive training, performance incentives, and opportunities for career progression within the organization.",
    },
  ];

   const getMatchCategory = (score: number) => {
    if (score >= 75) return "Top Matches";
    if (score >= 65) return "Strong Fits";
    if (score >= 55) return "Good Opportunities";
    return "Worth Exploring";
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Top Matches":
        return "text-[#0a5e06]";
      case "Strong Fits":
        return "text-[#17960b]";
      case "Good Opportunities":
        return "text-[#ffca1a]";
      default:
        return "text-gray-600";
    }
  };

  const getStarCount = (category: string) => {
    switch (category) {
      case "Top Matches":
        return 5;
      case "Strong Fits":
        return 4;
      case "Good Opportunities":
        return 3;
      default:
        return 2;
    }
  };

  const getStarColor = (category: string) => {
    switch (category) {
      case "Top Matches":
        return "fill-[#0a5e06] text-[#0a5e06]";
      case "Strong Fits":
        return "fill-[#17960b] text-[#17960b]";
      case "Good Opportunities":
        return "fill-[#ffca1a] text-[#ffca1a]";
      default:
        return "fill-gray-400 text-gray-400";
    }
  };

  const groupedJobs = recommendedJobs.reduce(
    (acc, job) => {
      const category = getMatchCategory(job.matchScore);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(job);
      return acc;
    },
    {} as Record<string, JobData[]>,
  );

  const categoryOrder  = [
    "Top Matches",
    "Strong Fits",
    "Good Opportunities",
    "Worth Exploring",
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Jobs Recommended for You</h1>
          <p className="text-base md:text-lg text-gray-600">
            Based on your profile, skills, and preferences, we've curated these job opportunities specially for you.
          </p>
        </div>

        {/* Recommended Jobs by Category */}
        <div className="space-y-8">
          {categoryOrder.map((category) => {
            const jobs = groupedJobs[category];
            if (!jobs || jobs.length === 0) return null;

            return (
              <div key={category}>
                {/* Category Header */}
                <h2
                  className={`text-xl md:text-2xl font-bold mb-4 ${getCategoryColor(category)}`}
                >
                  {category}
                </h2>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <Card
                      key={job.id}
                      className="border-gray-200 hover:shadow-lg transition-all bg-white"
                    >
                      <CardContent className="p-6">
                        {/* Job Header */}
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-gray-900 mb-2 font-bold text-xl">
                              {job.title}
                            </h3>
                            <p className="text-gray-600 mb-2 font-medium">
                              {job.company}
                            </p>
                          </div>
                          {/* Star Rating */}
                          <div className="flex gap-0.5">
                            {Array.from({
                              length: getStarCount(category),
                            }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${getStarColor(category)}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Job Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Briefcase className="w-4 h-4" />
                            <span>{job.type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>Posted {job.posted}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-gray-300 text-gray-700"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                          <Button
                            className="w-full bg-[#ffca1a] hover:bg-[#e6b617] text-gray-900 font-semibold"
                            onClick={() => setSelectedJob(job)}
                          >
                            View Full Details
                          </Button>
                          <div className="flex gap-3">
                            <Button
                              className="flex-1 bg-[#17960b] hover:bg-[#17960b]/90 text-white font-semibold"
                              onClick={() =>
                                onApply?.({
                                  title: job.title,
                                  company: job.company,
                                  location: job.location,
                                })
                              }
                            >
                              Apply Now
                            </Button>
                            <Button
                              variant="outline"
                              className="border-gray-300"
                              onClick={() => onSaveJob?.(job)}
                            >
                              <Bookmark className="w-4 h-4 mr-1" />
                              {savedJobIds?.includes(job.id)
                                ? "Saved"
                                : "Save"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State if no recommendations */}
        {recommendedJobs.length === 0 && (
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No Recommendations Yet</h3>
              <p className="text-gray-600 mb-6">
                Complete your profile and upload your resume to get personalized job recommendations.
              </p>
              <Button className="bg-[#17960b] hover:bg-[#17960b]/90 text-white" onClick={onNavigateToResume}>
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <Card className="mt-8 bg-white border-gray-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-gray-900 mb-4">Want More Personalized Recommendations?</h3>
            <p className="text-gray-600 mb-6">
              Update your profile, add more skills, and upload your latest resume to get even better job matches.
            </p>
            <div className="flex justify-center">
              <Button 
                className="bg-[#ffca1a] hover:bg-[#e6b617] text-gray-900"
                onClick={onNavigateToResume}
              >
                Update Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
       {/* Full Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setSelectedJob(null)}
          ></div>

          {/* Modal Content */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8">
              {/* Close Button */}
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {selectedJob.title}
                </h2>
                <p className="text-lg text-gray-600 font-medium mb-4">
                  {selectedJob.company}
                </p>

                {/* Match Score */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const category = getMatchCategory(selectedJob.matchScore);
                      const starCount = getStarCount(category);
                      return (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < starCount ? getStarColor(category) : 'text-gray-300'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {selectedJob.matchScore}% Match
                  </span>
                </div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-[#17960b]" />
                    <span className="text-sm font-medium">{selectedJob.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <DollarSign className="w-5 h-5 text-[#17960b]" />
                    <span className="text-sm font-medium">{selectedJob.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Briefcase className="w-5 h-5 text-[#17960b]" />
                    <span className="text-sm font-medium">{selectedJob.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5 text-[#17960b]" />
                    <span className="text-sm font-medium">Posted {selectedJob.posted}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedJob.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-gray-300 text-gray-700"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Why You're a Match */}
              <div className="mb-6 bg-[#17960b]/5 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Why You're a Great Match
                </h3>
                <p className="text-gray-700">
                  {selectedJob.reason}
                </p>
              </div>

              {/* Job Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Job Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300"
                  onClick={() => {
                    onSaveJob?.(selectedJob);
                  }}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  {savedJobIds?.includes(selectedJob.id) ? "Saved" : "Save Job"}
                </Button>
                <Button
                  className="flex-1 bg-[#17960b] hover:bg-[#17960b]/90 text-white font-semibold"
                  onClick={() => {
                    onApply?.({
                      title: selectedJob.title,
                      company: selectedJob.company,
                      location: selectedJob.location,
                    });
                    setSelectedJob(null);
                  }}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
