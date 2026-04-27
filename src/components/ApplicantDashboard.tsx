import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  AlertCircle, 
  Briefcase, 
  Award,
  FileText,
  Target,
  Building2,
  ArrowRight,
  UserCircle,
  Bookmark,
  Star,
  MapPin,
  DollarSign,
  Upload,
  FilePlus
} from 'lucide-react';
import logo from '../imports/Landbase-removebg-preview.png';
import { useAuth } from "./AuthPass";
import {supabase} from "./supabaseClient";
import { useState, useEffect } from 'react';

interface SkillAssessment {
  name: string;
  score: number;
  status: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D";
  recommendation: string;
}

interface CompanyRecommendation {
  name: string;
  matchScore: number;
  industry: string;
  openPositions: number;
  salaryRange: string;
  location: string;
  reason: string;
}

interface ApplicantDashboardProps {
  isLoggedIn?: boolean;
  onSignUpRequired?: () => void;
  onBackToHome?: () => void;
  onNavigateToResumeBuilder?: () => void;
  hasResume?: boolean;
}

export function ApplicantDashboard({ 
  isLoggedIn = false, 
  onSignUpRequired, 
  onBackToHome,
  onNavigateToResumeBuilder,
  hasResume = false 
}: ApplicantDashboardProps) {
  const { account } = useAuth();
  const applicantName = "John";
  const overallScore = 78;
  const applicationStatus = "Under Review";

  const [resumeData, setResumeData] = useState<any>(null);
  const [loadingSkills, setLoadingSkills] = useState(true);

  const fetchLatest = async () => {
    const { data } = await supabase
      .from('t_resume')
      .select(`
        res_stability_score,
        res_exp_score,
        res_skills_score,
        res_desc_score,
        res_completeness_score,
        res_complete_score,
        res_last_updated
      `)
      .eq('applicant_id', account.applicant_id)
      .order('res_last_updated', { ascending: false })
      .order('resume_id', { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  };

  useEffect(() => {
    async function loadResumeScores() {
      if (!account?.applicant_id) return;

      setLoadingSkills(true);

      let data = await fetchLatest();

      if (!data?.res_complete_score) {
        await supabase
          .from('t_resume')
          .update({ res_complete_score: '0' })
          .eq('applicant_id', account.applicant_id)
          .order('res_last_updated', { ascending: false })
          .limit(1);

        while (!data?.res_complete_score) {
          await new Promise(resolve => setTimeout(resolve, 10000));
          data = await fetchLatest();
        }
      }

      setResumeData(data);
      setLoadingSkills(false);
    }

    loadResumeScores();
  }, [account?.applicant_id]);

  const recommendedCompanies: CompanyRecommendation[] = [
    {
      name: "Global Tech Solutions",
      matchScore: 92,
      industry: "Technology",
      openPositions: 12,
      salaryRange: "PHP 45,000-65,000",
      location: "Singapore",
      reason: "Your technical skills and education align perfectly with their requirements"
    },
    {
      name: "Healthcare International",
      matchScore: 88,
      industry: "Healthcare",
      openPositions: 8,
      salaryRange: "PHP 50,000-70,000",
      location: "Dubai, UAE",
      reason: "Strong match based on your communication skills and certifications"
    },
    {
      name: "Hospitality Excellence Group",
      matchScore: 85,
      industry: "Hospitality",
      openPositions: 15,
      salaryRange: "PHP 42,000-58,000",
      location: "Doha, Qatar",
      reason: "Your customer service experience matches their current needs"
    },
    {
      name: "Premier Global Recruitment",
      matchScore: 82,
      industry: "Food & Beverage",
      openPositions: 20,
      salaryRange: "PHP 48,000-62,000",
      location: "Croatia",
      reason: "Multiple positions available that match your skill set"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#17960b]';
    if (score >= 60) return 'text-[#ffca1a]';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBorderColor = (score: number) => {
    if (score >= 80) return 'border-[#17960b]';
    if (score >= 60) return 'border-[#ffca1a]';
    if (score >=40) return 'border-orange-500';
    return 'border-red-500';
  };

  const getScoreLabel = (category: string, score: number): { grade: string; label: string } => {
    const rubric: Record<string, { ranges: [number, number, string, string][] }> = {
      experience: {
        ranges: [
          [65, 100, 'A+', 'Excellent'],
          [58, 64,  'A',  'Very Good'],
          [50, 57,  'B+', 'Good'],
          [1,  49,  'B',  'Fair'],
          [-Infinity, 0, 'D', 'Needs Improvement'],
        ]
      },
      skills: {
        ranges: [
          [63, 100, 'A+', 'Excellent'],
          [49, 62,  'A',  'Very Good'],
          [35, 48,  'B+', 'Good'],
          [6,  34,  'B',  'Fair'],
          [-Infinity, 5, 'D', 'Needs Improvement'],
        ]
      },
      description: {
        ranges: [
          [67, 100, 'A+', 'Excellent'],
          [59, 66,  'A',  'Very Good'],
          [47, 58,  'B+', 'Good'],
          [6,  46,  'B',  'Fair'],
          [-Infinity, 5, 'D', 'Needs Improvement'],
        ]
      },
      completeness: {
        ranges: [
          [92, 100, 'A+', 'Excellent'],
          [86, 91,  'A',  'Very Good'],
          [81, 85,  'B+', 'Good'],
          [29, 80,  'B',  'Fair'],
          [-Infinity, 28, 'D', 'Needs Improvement'],
        ]
      },
      stability: {
        ranges: [
          [45, 100, 'A+', 'Excellent'],
          [30, 44,  'A',  'Very Good'],
          [15, 29,  'B+', 'Good'],
          [1,  14,  'B',  'Fair'],
          [-Infinity, 0, 'D', 'Needs Improvement'],
        ]
      },
    };
  
    const found = rubric[category]?.ranges.find(([min, max]) => score >= min && score <= max);
    return found ? { grade: found[2], label: found[3] } : { grade: 'D', label: 'Needs Improvement' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-[#17960b] text-white';
      case 'good':
        return 'bg-[#ffca1a] text-gray-900';
      case 'needs-improvement':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-red-500 text-white';
      case 'Medium':
        return 'bg-[#ffca1a] text-gray-900';
      case 'Low':
        return 'bg-gray-400 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const skillsAssessment: SkillAssessment[] = resumeData ? [
    {
      name: "Career Stability",
      score: parseFloat(resumeData.res_stability_score ?? '0'),
      status: getScoreLabel('stability', parseFloat(resumeData.res_stability_score ?? '0')).grade as any,
      recommendation: getScoreLabel('stability', parseFloat(resumeData.res_stability_score ?? '0')).label,
    },
    {
      name: "Experience Depth",
      score: parseFloat(resumeData.res_exp_score ?? '0'),
      status: getScoreLabel('experience', parseFloat(resumeData.res_exp_score ?? '0')).grade as any,
      recommendation: getScoreLabel('experience', parseFloat(resumeData.res_exp_score ?? '0')).label,
    },
    {
      name: "Skill Relevance",
      score: parseFloat(resumeData.res_skills_score ?? '0'),
      status: getScoreLabel('skills', parseFloat(resumeData.res_skills_score ?? '0')).grade as any,
      recommendation: getScoreLabel('skills', parseFloat(resumeData.res_skills_score ?? '0')).label,
    },
    {
      name: "Description Quality",
      score: parseFloat(resumeData.res_desc_score ?? '0'),
      status: getScoreLabel('description', parseFloat(resumeData.res_desc_score ?? '0')).grade as any,
      recommendation: getScoreLabel('description', parseFloat(resumeData.res_desc_score ?? '0')).label,
    },
    {
      name: "Resume Completeness",
      score: parseFloat(resumeData.res_completeness_score ?? '0'),
      status: getScoreLabel('completeness', parseFloat(resumeData.res_completeness_score ?? '0')).grade as any,
      recommendation: getScoreLabel('completeness', parseFloat(resumeData.res_completeness_score ?? '0')).label,
    },
  ] : [];
  
  const areasForImprovement = [
    {
      area: "Work Experience Details",
      impact: "High",
      suggestion: "Example: Add specific metrics and achievements (e.g., 'Increased sales by 30%' instead of 'Responsible for sales')"
    },
    {
      area: "Professional Certifications",
      impact: "Medium",
      suggestion: "Consider obtaining relevant certifications such as TESDA NC II or industry-specific credentials"
    },
    {
      area: "Keywords Optimization",
      impact: "Medium",
      suggestion: "Include industry-specific keywords that match job descriptions"
    },
    {
      area: "References Section",
      impact: "Low",
      suggestion: "Add professional references with contact information"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Preview Overlay for Non-Logged In Users */}
      {!isLoggedIn && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full border-[#17960b]/20">
            <CardContent className="p-6 md:p-8 text-center">
              <div className="mb-6">
                <UserCircle className="w-20 h-20 mx-auto mb-4 text-[#17960b]" />
                <h2 className="text-gray-900 mb-3">Unlock Your Applicant Dashboard</h2>
                <p className="text-gray-600 mb-6">
                  Sign up now to access your personalized dashboard and discover:
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#17960b]/10 to-[#ffca1a]/10 rounded-lg p-6 mb-6 text-left">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#17960b] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <strong className="text-gray-900">AI Resume Grading:</strong> Get instant feedback on your resume with a detailed score and grade
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#17960b] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <strong className="text-gray-900">Skills Assessment:</strong> Detailed analysis of your strengths and areas for improvement
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#17960b] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <strong className="text-gray-900">Company Recommendations:</strong> Personalized job matches based on your profile
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#17960b] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <strong className="text-gray-900">Application Tracking:</strong> Monitor your job applications in real-time
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  className="w-full bg-[#17960b] hover:bg-[#17960b]/90 text-white"
                  onClick={onSignUpRequired}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Sign Up Free - Get Your Dashboard
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-[#17960b] text-[#17960b] hover:bg-[#17960b]/10"
                  onClick={onBackToHome}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Back to Job Portal
                </Button>
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button 
                    onClick={onSignUpRequired}
                    className="text-[#17960b] hover:underline"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Welcome Section */}
        {isLoggedIn && (
          <div className="mb-6 md:mb-8">
            <h1 className="text-gray-900 mb-2 text-xl sm:text-2xl md:text-3xl">Welcome, {account?.t_applicant?.app_first_name}!</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {hasResume ? "Here's your comprehensive resume analysis report." : "Here's a preview of what your resume analysis will look like."}
            </p>
          </div>
        )}

        {/* Resume Required Section - Integrated Style */}
        {isLoggedIn && !hasResume && (
          <Card className="mb-6 md:mb-8 border-[#17960b]/20 bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-[#17960b]/10 rounded-full p-2 flex-shrink-0">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#17960b]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold text-sm sm:text-base mb-1">Create your resume to unlock full analysis</p>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                      Build your professional resume in minutes and get AI-powered insights, skills assessment, and personalized job matches.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                  <Button 
                    className="flex-1 sm:flex-none bg-[#17960b] hover:bg-[#17960b]/90 text-white h-11 font-semibold"
                    onClick={onNavigateToResumeBuilder}
                  >
                    <FilePlus className="w-4 h-4 mr-2" />
                    Create Resume Now
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 sm:flex-none border-gray-300 text-gray-700 hover:bg-gray-50 h-11 font-semibold"
                    onClick={onBackToHome}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Back to Job Portal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overall Score Card */}
        {isLoggedIn && (
          <Card className="mb-6 md:mb-8 border-[#17960b]/20">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#17960b] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 text-sm sm:text-base">Your resume shows strong potential!</p>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                      You have a solid foundation with excellent education and communication skills.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffca1a] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 text-sm sm:text-base">Room for improvement</p>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                      Focus on quantifying achievements and obtaining relevant certifications to boost your score to 90+.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resume Analysis Content - Show for logged in users */}
        {isLoggedIn && (
          <>
            {/* Resume Analysis */}
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <FileText className="w-6 h-6 text-[#17960b]" />
                <h2 className="text-gray-900">Resume Analysis</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skillsAssessment.map((skill, index) => (
                  <Card key={index} className="border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-gray-900 mb-1">{skill.name}</h3>
                          <Badge className={`${getScoreColor(skill.score)} !bg-transparent border ${getScoreBorderColor(skill.score)}`}>
                            {skill.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {['A+', 'A'].includes(skill.status) ? (
                            <TrendingUp className="w-5 h-5 text-[#17960b]" />
                          ) : ['D', 'C', 'C+'].includes(skill.status) ? (
                            <TrendingDown className="w-5 h-5 text-red-500" />
                          ) : (
                            <TrendingUp className="w-5 h-5 text-[#ffca1a]" />
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600">{skill.recommendation}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <AlertCircle className="w-6 h-6 text-[#ffca1a]" />
                <h2 className="text-gray-900">Areas for Improvement</h2>
              </div>

              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {areasForImprovement.map((area, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-start gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                      >
                        <Badge className={`${getImpactColor(area.impact)} shrink-0`}>
                          {area.impact} Impact
                        </Badge>
                        <div className="flex-1">
                          <h3 className="text-gray-900 mb-2">{area.area}</h3>
                          <p className="text-gray-600">{area.suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Featured Jobs */}
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Star className="w-6 h-6 text-[#ffca1a]" />
                <h2 className="text-gray-900">Featured Jobs</h2>
              </div>

              <Card className="border-[#17960b]/20 bg-gradient-to-br from-[#17960b]/5 to-[#ffca1a]/5">
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center mb-6">
                    <Briefcase className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-[#17960b]" />
                    <h3 className="text-gray-900 mb-2 text-lg sm:text-xl">Explore Opportunities</h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Discover top job openings from leading companies worldwide
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button 
                      onClick={onBackToHome}
                      className="bg-[#17960b] hover:bg-[#17960b]/90 text-white flex items-center justify-center gap-2"
                    >
                      <Briefcase className="w-4 h-4" />
                      All Jobs
                    </Button>
                    <Button 
                      onClick={onBackToHome}
                      variant="outline"
                      className="border-[#17960b] text-[#17960b] hover:bg-[#17960b] hover:text-white flex items-center justify-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Featured
                    </Button>
                    <Button 
                      onClick={onBackToHome}
                      variant="outline"
                      className="border-[#ffca1a] text-gray-900 hover:bg-[#ffca1a] flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      By Location
                    </Button>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Button 
                      onClick={onBackToHome}
                      variant="ghost"
                      className="text-[#17960b] hover:text-[#17960b]/90 hover:bg-[#17960b]/10"
                    >
                      View Job Portal
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
