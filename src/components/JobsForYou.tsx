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
  Bookmark,
  X,
  Upload,
  AlertCircle
} from 'lucide-react';
import { useState, useEffect } from "react";
import { useAuth } from "./AuthPass";
import { supabase } from "./supabaseClient";

// ✅ Replace old JobData interface with one matching the  edge function response
interface JobData {
  position_id: number;
  job_title: string;
  job_description: string;
  job_category: string;
  job_salary_range: string;
  job_number_needed: number;
  job_filled_count: number;
  job_contract_length: string;
  location: string;
  deadline: string | null;
  posted_date: string | null;
  placement_fee: number;
  jo_phone_number: string;
  jo_email: string;
  company_name: string;
  company_contact: string;
  company_email: string;
  company_representative: string;
  score: number;
  raw_score: number;
}

interface JobsForYouProps {
  onApply?: (job: { title: string; company: string; location: string; position_id?: number }) => void;
  onSaveJob?: (job: any) => void;
  savedJobIds?: number[];
  onNavigateToResume?: () => void;
}

export function JobsForYou({ onApply, onSaveJob, savedJobIds = [], onNavigateToResume }: JobsForYouProps) {
  const { account } = useAuth();
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasResume, setHasResume] = useState<boolean | null>(null); // null = still checking
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [appliedIds, setAppliedIds] = useState<number[]>([]);

  const fetchSavedJobs = async () => {
    const { data } = await supabase
      .from('t_saved_jobs')
      .select('position_id')
      .eq('applicant_id', account!.applicant_id);
    
    if (data) {
      setSavedIds(data.map(d => d.position_id));
    }
  };

  const fetchAppliedJobs = async () => {
    if (!account) return;
    const { data } = await supabase
      .from('t_applications')
      .select('position_id')
      .eq('applicant_id', account.applicant_id);
    if (data) setAppliedIds(data.map((d: any) => d.position_id));
  };
  
  useEffect(() => {
    if (!account) return;
    checkResumeAndFetch();
    fetchSavedJobs();
    fetchAppliedJobs();
  }, [account]);

  const checkResumeAndFetch = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Check if applicant has a resume
      const { data: resumeData, error: resumeError } = await supabase
        .from('t_resume')
        .select('resume_id')
        .eq('applicant_id', account!.applicant_id)
        .maybeSingle();

      if (resumeError) throw resumeError;

      if (!resumeData) {
        // No resume found — show upload prompt
        setHasResume(false);
        setLoading(false);
        return;
      }

      setHasResume(true);

      // ✅ Add this to verify the correct ID is being sent
    console.log('account object:', account);
    console.log('sending applicant_id:', account!.applicant_id);

      /// Step 2: Call the edge function via supabase client
     const { data: result, error: fnError } = await supabase.functions.invoke(
      'quick-service',
      {
        body: { applicant_id: account!.applicant_id },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

      // ✅ Add the console.logs RIGHT HERE, on the next two lines
      console.log('Edge function result:', result);
      console.log('Edge function error:', fnError);
      
      if (fnError) throw fnError;
      
      // ✅ Add this — check if the function returned an error in the response body
      if (result?.error) {
        // Handle specific known errors gracefully
        if (
          result.error.includes('No resume embedding') ||
          result.error.includes('resume embedder')
        ) {
          // Resume exists in t_resume but hasn't been embedded yet
          setHasResume(false);
          setLoading(false);
          return;
        }
      
        if (
          result.error.includes('No active jobs') ||
          result.error.includes('job embedder')
        ) {
          // Jobs exist but haven't been embedded yet
          setRecommendedJobs([]);
          setLoading(false);
          return;
        }
      
        throw new Error(result.error);
      }
      
      setRecommendedJobs(result?.scores || []);

    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Match score category based on edge function score (0-1 range after transmutation)
  const getMatchCategory = (score: number) => {
    if (score >= 0.85) return "Top Matches";
    if (score >= 0.75) return "Strong Fits";
    if (score >= 0.65) return "Good Opportunities";
    return "Worth Exploring";
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Top Matches": return "text-[#0a5e06]";
      case "Strong Fits": return "text-[#17960b]";
      case "Good Opportunities": return "text-[#ffca1a]";
      default: return "text-gray-600";
    }
  };

  const getStarCount = (category: string) => {
    switch (category) {
      case "Top Matches": return 5;
      case "Strong Fits": return 4;
      case "Good Opportunities": return 3;
      default: return 2;
    }
  };

  const getStarColor = (category: string) => {
    switch (category) {
      case "Top Matches": return "fill-[#0a5e06] text-[#0a5e06]";
      case "Strong Fits": return "fill-[#17960b] text-[#17960b]";
      case "Good Opportunities": return "fill-[#ffca1a] text-[#ffca1a]";
      default: return "fill-gray-400 text-gray-400";
    }
  };

  const formatPostedDate = (dateStr: string | null): string => {
    if (!dateStr) return 'Recently posted';
    const posted = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const groupedJobs = recommendedJobs.reduce((acc, job) => {
    const category = getMatchCategory(job.score);
    if (!acc[category]) acc[category] = [];
    acc[category].push(job);
    return acc;
  }, {} as Record<string, JobData[]>);

  const categoryOrder = ["Top Matches", "Strong Fits", "Good Opportunities", "Worth Exploring"];

  const handleToggleSave = async (positionId: number) => {
    console.log('positionId received:', positionId)
    const isSaved = savedIds.includes(positionId);
  
    if (isSaved) {
      // Unsave
      await supabase
        .from('t_saved_jobs')
        .delete()
        .eq('applicant_id', account!.applicant_id)
        .eq('position_id', positionId);
  
      setSavedIds(prev => prev.filter(id => id !== positionId));
    } else {
      // Save
      await supabase
        .from('t_saved_jobs')
        .insert({
          applicant_id: account!.applicant_id,
          position_id: positionId,
        });
  
      setSavedIds(prev => [...prev, positionId]);
    }
  };

  // ─── No resume state ───────────────────────────────────────────────────────
  if (!loading && hasResume === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <Card className="border-gray-200 max-w-lg w-full">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-[#ffca1a]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Resume Not Ready Yet
            </h3>
            <p className="text-gray-600 mb-6">
              To get personalized job recommendations, your resume needs to be built and processed first. 
              Go to the Resume Builder to get started.
            </p>
            <Button
              className="bg-[#17960b] hover:bg-[#0d5e06] text-white font-semibold px-8"
              onClick={onNavigateToResume}
            >
              Go to Resume Builder
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-12 h-12 animate-spin text-[#17960b] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p className="text-gray-600 font-medium text-lg">Finding your best matches...</p>
          <p className="text-gray-400 text-sm mt-1">Analyzing your resume against available positions</p>
        </div>
      </div>
    );
  }

  // ─── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <Card className="border-gray-200 max-w-lg w-full">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Something Went Wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              className="bg-[#17960b] hover:bg-[#0d5e06] text-white font-semibold"
              onClick={checkResumeAndFetch}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Jobs Recommended for You
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Based on your resume and preferences, we've curated these job opportunities specially for you.
          </p>
          {recommendedJobs.length > 0 && (
            <p className="text-sm text-[#17960b] font-medium mt-1">
              {recommendedJobs.length} position{recommendedJobs.length !== 1 ? 's' : ''} matched
            </p>
          )}
        </div>

        {/* Recommended Jobs by Category */}
        <div className="space-y-8">
          {categoryOrder.map((category) => {
            const jobs = groupedJobs[category];
            if (!jobs || jobs.length === 0) return null;

            return (
              <div key={category}>
                <h2 className={`text-xl md:text-2xl font-bold mb-4 ${getCategoryColor(category)}`}>
                  {category}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {jobs.map((job) => {
                    const category = getMatchCategory(job.score);
                    return (
                      <Card key={job.position_id} className="border-gray-200 hover:shadow-lg transition-all bg-white">
                        <CardContent className="p-6">
                          {/* Job Header */}
                          <div className="mb-4 flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-gray-900 mb-1 font-bold text-xl">{job.job_title}</h3>
                              <p className="text-gray-600 font-medium">{job.company_name}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex gap-0.5">
                                {Array.from({ length: getStarCount(category) }).map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${getStarColor(category)}`} />
                                ))}
                              </div>
                              <span className="text-xs font-semibold text-gray-500">
                                {Math.round(job.score * 100)}% match
                              </span>
                            </div>
                          </div>

                          {/* Job Details */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4 shrink-0" />
                              <span className="text-sm">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <DollarSign className="w-4 h-4 shrink-0" />
                              <span className="text-sm">{job.job_salary_range || 'Competitive'}</span>
                            </div>
                            {job.job_contract_length && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Briefcase className="w-4 h-4 shrink-0" />
                                <span className="text-sm">{job.job_contract_length}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-500">
                              <Clock className="w-4 h-4 shrink-0" />
                              <span className="text-sm">Posted {formatPostedDate(job.posted_date)}</span>
                            </div>
                          </div>

                          {/* Category Badge */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.job_category && (
                              <Badge variant="outline" className="border-gray-300 text-gray-700">
                                {job.job_category}
                              </Badge>
                            )}
                            {job.placement_fee === 0 && (
                              <Badge className="bg-red-500 text-white border-0">
                                No Placement Fee
                              </Badge>
                            )}
                          </div>

                          {/* Vacancies */}
                          <p className="text-xs text-gray-500 mb-4">
                            {job.job_number_needed - job.job_filled_count} of {job.job_number_needed} vacancies remaining
                          </p>

                          {/* Actions */}
                          <div className="flex flex-col gap-3">
                            <Button
                              className="w-full bg-[#ffca1a] hover:bg-[#e6b617] text-gray-900 font-semibold"
                              onClick={() => setSelectedJob(job)}
                            >
                              View Full Details
                            </Button>
                            <div className="flex gap-3">
                              <<Button
                                disabled={appliedIds.includes(job.position_id)}
                                className={`flex-1 font-semibold ${
                                  appliedIds.includes(job.position_id)
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-[#17960b] hover:bg-[#17960b]/90 text-white'
                                }`}
                                onClick={() => {
                                  if (!appliedIds.includes(job.position_id)) {
                                    onApply?.({
                                      title: job.job_title,
                                      company: job.company_name,
                                      location: job.location,
                                      position_id: job.position_id,
                                    });
                                  }
                                }}
                              >
                                {appliedIds.includes(job.position_id) ? 'Already Applied' : 'Apply Now'}
                              </Button>
                              <Button
                                variant="outline"
                                className="border-gray-300"
                                onClick={() => handleToggleSave(job.position_id)}
                              >
                                <Bookmark className={`w-4 h-4 mr-1 ${savedIds.includes(job.position_id) ? 'fill-current' : ''}`} />
                                {savedIds.includes(job.position_id) ? 'Saved' : 'Save'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state — resume exists but no matches */}
        {recommendedJobs.length === 0 && hasResume && (
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Matches Found Yet</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find strong matches right now. Try updating your resume or preferences to improve your results.
              </p>
              <Button className="bg-[#17960b] hover:bg-[#0d5e06] text-white" onClick={onNavigateToResume}>
                Update Resume
              </Button>
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <Card className="mt-8 bg-white border-gray-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Want Better Recommendations?</h3>
            <p className="text-gray-600 mb-6">
              Update your resume and preferences to get even more accurate job matches.
            </p>
            <Button className="bg-[#ffca1a] hover:bg-[#e6b617] text-gray-900" onClick={onNavigateToResume}>
              Update Resume
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Full Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSelectedJob(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8">
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {selectedJob.job_title}
                </h2>
                <p className="text-lg text-gray-600 font-medium mb-1">{selectedJob.company_name}</p>
                <p className="text-sm text-gray-400 mb-4">{selectedJob.location}</p>

                {/* Match Score */}
                <div className="flex items-center gap-2 mb-4">
                  {(() => {
                    const cat = getMatchCategory(selectedJob.score);
                    const count = getStarCount(cat);
                    return (
                      <>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < count ? getStarColor(cat) : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {Math.round(selectedJob.score * 100)}% Match
                        </span>
                      </>
                    );
                  })()}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-[#17960b]" />
                    <span className="text-sm">{selectedJob.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <DollarSign className="w-5 h-5 text-[#17960b]" />
                    <span className="text-sm">{selectedJob.job_salary_range || 'Competitive'}</span>
                  </div>
                  {selectedJob.job_contract_length && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Briefcase className="w-5 h-5 text-[#17960b]" />
                      <span className="text-sm">{selectedJob.job_contract_length}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5 text-[#17960b]" />
                    <span className="text-sm">Posted {formatPostedDate(selectedJob.posted_date)}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedJob.job_category && (
                    <Badge variant="outline" className="border-gray-300 text-gray-700">
                      {selectedJob.job_category}
                    </Badge>
                  )}
                  {selectedJob.placement_fee === 0 && (
                    <Badge className="bg-red-500 text-white border-0">No Placement Fee</Badge>
                  )}
                </div>
              </div>

              {/* Vacancies */}
              <div className="mb-4 bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Vacancies:</span> {selectedJob.job_number_needed - selectedJob.job_filled_count} remaining of {selectedJob.job_number_needed}
                </p>
                {selectedJob.deadline && (
                  <p className="text-sm text-red-500 mt-1">
                    <span className="font-semibold">Deadline:</span> {new Date(selectedJob.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}
              </div>

              {/* Job Description */}
              {selectedJob.job_description && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Job Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedJob.job_description}</p>
                </div>
              )}

              {/* Contact */}
              {(selectedJob.jo_phone_number || selectedJob.jo_email || selectedJob.company_contact || selectedJob.company_email) && (
                <div className="mb-6 bg-[#17960b]/5 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Contact Information</h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    {selectedJob.company_representative && <p><span className="font-medium">Contact Person:</span> {selectedJob.company_representative}</p>}
                    {selectedJob.jo_phone_number && <p><span className="font-medium">Phone:</span> {selectedJob.jo_phone_number}</p>}
                    {selectedJob.jo_email && <p><span className="font-medium">Email:</span> {selectedJob.jo_email}</p>}
                    {selectedJob.company_email && <p><span className="font-medium">Company Email:</span> {selectedJob.company_email}</p>}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300"
                  onClick={() => handleToggleSave(selectedJob.position_id)}
                >
                  <Bookmark className={`w-4 h-4 mr-2 ${savedIds.includes(selectedJob.position_id) ? 'fill-current' : ''}`} />
                  {savedIds.includes(selectedJob.position_id) ? 'Saved' : 'Save Job'}
                </Button>
                <Button
                  disabled={appliedIds.includes(selectedJob.position_id)}
                  className={`flex-1 font-semibold ${
                    appliedIds.includes(selectedJob.position_id)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#17960b] hover:bg-[#17960b]/90 text-white'
                  }`}
                  onClick={() => {
                    if (!appliedIds.includes(selectedJob.position_id)) {
                      onApply?.({
                        title: selectedJob.job_title,
                        company: selectedJob.company_name,
                        location: selectedJob.location,
                        position_id: selectedJob.position_id,
                      });
                      setSelectedJob(null);
                    }
                  }}
                >
                  {appliedIds.includes(selectedJob.position_id) ? 'Already Applied' : 'Apply Now'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
