import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  FileText,
  Target,
  Lock,
  ArrowRight,
  FilePlus,
  Sparkles,
} from "lucide-react";
import { useAuth } from "./AuthPass";

interface ResumeAnalysisPreviewProps {
  onNavigateToResumeBuilder?: () => void;
  onBackToHome?: () => void;
}

export function ResumeAnalysisPreview({
  onNavigateToResumeBuilder,
  onBackToHome,
}: ResumeAnalysisPreviewProps) {
  const { account } = useAuth();
  //const applicantName = "John";

  const previewAnalysis = [
    {
      name: "Experience",
      score: 85,
      status: "excellent",
      recommendation:
        "Strong work history with relevant positions and achievements",
    },
    {
      name: "Overall Skills",
      score: 88,
      status: "excellent",
      recommendation:
        "Well-rounded skill set that matches industry requirements",
    },
    {
      name: "Quality of Description",
      score: 75,
      status: "good",
      recommendation:
        "Good descriptions but could be more detailed and quantified",
    },
    {
      name: "Completeness of Resume",
      score: 82,
      status: "excellent",
      recommendation:
        "Resume contains most essential sections with adequate detail",
    },
  ];

  const previewImprovements = [
    {
      area: "Work Experience Details",
      impact: "High",
      suggestion:
        "Example: Add specific metrics and achievements (e.g., 'Increased sales by 30%' instead of 'Responsible for sales')",
    },
    {
      area: "Professional Certifications",
      impact: "Medium",
      suggestion:
        "Consider obtaining relevant certifications such as TESDA NC II or industry-specific credentials",
    },
    {
      area: "Keywords Optimization",
      impact: "Medium",
      suggestion:
        "Include industry-specific keywords that match job descriptions",
    },
    {
      area: "References Section",
      impact: "Low",
      suggestion:
        "Add professional references with contact information",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-[#17960b] text-white";
      case "good":
        return "bg-[#ffca1a] text-gray-900";
      case "needs-improvement":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-red-500 text-white";
      case "Medium":
        return "bg-[#ffca1a] text-gray-900";
      case "Low":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-gray-900 mb-2 text-xl sm:text-2xl md:text-3xl">
            Hello, {account?.t_applicant?.app_first_name || "User"}!
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Complete your Resume Builder to unlock your Resume
            Analysis.
          </p>
        </div>

        {/* Call to Action Banner */}
        <Card className="mb-6 md:mb-8 border-[#17960b] border-2 bg-gradient-to-br from-[#17960b]/5 to-[#ffca1a]/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffca1a]/20 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#17960b]/20 rounded-full -ml-12 -mb-12"></div>
          <CardContent className="p-4 sm:p-6 md:p-8 relative z-10">
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-[#17960b] rounded-full p-3 flex-shrink-0">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-gray-900 mb-2 text-lg sm:text-xl md:text-2xl">
                    Unlock Your Personalized Resume Analysis
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">
                    Complete your resume to receive instant
                    AI-powered feedback, detailed scoring across
                    multiple categories, and personalized
                    recommendations to help you land your dream
                    job!
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-2 text-[#17960b]">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium">
                        AI-Powered Analysis
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#17960b]">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium">
                        Detailed Scoring
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#17960b]">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium">
                        Expert Recommendations
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <Button
                  className="flex-1 sm:flex-none bg-[#17960b] hover:bg-[#17960b]/90 text-white h-12 text-base font-semibold shadow-lg shadow-[#17960b]/20"
                  onClick={onNavigateToResumeBuilder}
                >
                  <FilePlus className="w-5 h-5 mr-2" />
                  Complete Resume Builder
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none border-gray-300 text-gray-700 hover:bg-gray-50 h-12 text-base font-semibold"
                  onClick={onBackToHome}
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Back to Job Portal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section with Overlay */}
        <div className="relative">
          {/* Blur Overlay */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 rounded-2xl flex items-center justify-center pointer-events-none">
            <div className="bg-white/95 rounded-2xl shadow-2xl border-2 border-[#17960b] p-6 sm:p-8 max-w-md mx-4 text-center pointer-events-auto">
              <div className="bg-[#17960b]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-[#17960b]" />
              </div>
              <h3 className="text-gray-900 mb-3 text-lg sm:text-xl">
                Preview Mode
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Complete your resume in the Resume Builder to
                unlock this detailed analysis and get
                personalized insights!
              </p>
              <Button
                className="w-full bg-[#17960b] hover:bg-[#17960b]/90 text-white h-11 font-semibold shadow-lg"
                onClick={onNavigateToResumeBuilder}
              >
                <FilePlus className="w-4 h-4 mr-2" />
                Go to Resume Builder
              </Button>
            </div>
          </div>

          {/* Preview Content (Blurred Background) */}
          <div className="space-y-6 md:space-y-8 opacity-50">
            {/* Overall Score Card */}
            <Card className="border-[#17960b]/20">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#17960b] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 text-sm sm:text-base">
                        Your resume shows strong potential!
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                        You have a solid foundation with
                        excellent education and communication
                        skills.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffca1a] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 text-sm sm:text-base">
                        Room for improvement
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                        Focus on quantifying achievements and
                        obtaining relevant certifications to
                        boost your score to 90+.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resume Analysis */}
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <FileText className="w-6 h-6 text-[#17960b]" />
                <h2 className="text-gray-900">
                  Resume Analysis
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {previewAnalysis.map((item, index) => (
                  <Card key={index} className="border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <Badge
                            className={getStatusColor(
                              item.status,
                            )}
                          >
                            {item.status === "excellent" &&
                              "Excellent"}
                            {item.status === "good" && "Good"}
                            {item.status ===
                              "needs-improvement" &&
                              "Needs Improvement"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {item.status === "excellent" ? (
                            <TrendingUp className="w-5 h-5 text-[#17960b]" />
                          ) : item.status ===
                            "needs-improvement" ? (
                            <TrendingDown className="w-5 h-5 text-red-500" />
                          ) : (
                            <TrendingUp className="w-5 h-5 text-[#ffca1a]" />
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600">
                        {item.recommendation}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <AlertCircle className="w-6 h-6 text-[#ffca1a]" />
                <h2 className="text-gray-900">
                  Areas for Improvement
                </h2>
              </div>

              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {previewImprovements.map((area, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-start gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                      >
                        <Badge
                          className={`${getImpactColor(area.impact)} shrink-0`}
                        >
                          {area.impact} Impact
                        </Badge>
                        <div className="flex-1">
                          <h3 className="text-gray-900 mb-2">
                            {area.area}
                          </h3>
                          <p className="text-gray-600">
                            {area.suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
