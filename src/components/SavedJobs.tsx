import { Bookmark, MapPin, DollarSign, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthPass';
import { supabase } from './supabaseClient';
import svgPaths from '../imports/svg-3nnvnkmfcx';

interface SavedJob {
  saved_id: number;
  position_id: number;
  saved_at: string;
  job_title: string;
  company_name: string;
  location: string;
  job_salary_range: string;
  job_number_needed: number;
  jo_posted_date: string | null;
}

interface SavedJobsProps {
  onApply: (job: { title: string; company: string; location: string }) => void;
}

export function SavedJobs({ onApply }: SavedJobsProps) {
  const { account } = useAuth();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!account) return;
    fetchSavedJobs();
  }, [account]);

  const fetchSavedJobs = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('t_saved_jobs')
      .select(`
        saved_id,
        position_id,
        saved_at,
        t_job_positions (
          job_title,
          job_salary_range,
          job_number_needed,
          jo_id,
          t_job_orders (
            jo_country,
            jo_posted_date,
            t_companies (
              company_name
            )
          )
        )
      `)
      .eq('applicant_id', account!.applicant_id)
      .order('saved_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved jobs:', error);
      setLoading(false);
      return;
    }

    const mapped = (data || []).map((item: any) => {
      const pos = item.t_job_positions;
      const order = pos?.t_job_orders;
      const company = order?.t_companies;
      return {
        saved_id: item.saved_id,
        position_id: item.position_id,
        saved_at: item.saved_at,
        job_title: pos?.job_title || 'Unknown Position',
        company_name: company?.company_name || 'Unknown Company',
        location: order?.jo_country || 'Location TBD',
        job_salary_range: pos?.job_salary_range || 'Competitive',
        job_number_needed: pos?.job_number_needed || 0,
        jo_posted_date: order?.jo_posted_date || null,
      };
    });

    setSavedJobs(mapped);
    setLoading(false);
  };

  const handleRemove = async (savedId: number) => {
    await supabase
      .from('t_saved_jobs')
      .delete()
      .eq('saved_id', savedId);

    setSavedJobs(prev => prev.filter(j => j.saved_id !== savedId));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-10 h-10 animate-spin text-[#17960b] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Loading saved jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-[1236px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-6 h-6 md:w-8 md:h-8 text-[#17960b]" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Saved Jobs</h1>
          </div>
          <p className="text-base md:text-lg text-gray-600">
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved for later
          </p>
        </div>

        {/* Empty State */}
        {savedJobs.length === 0 && (
          <Card className="border-[#17960b]/20">
            <CardContent className="py-12 md:py-16 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Bookmark className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No Saved Jobs Yet</h2>
              <p className="text-sm md:text-base text-gray-600 mb-6">
                Browse our Featured Jobs and save positions you're interested in
              </p>
            </CardContent>
          </Card>
        )}

        {/* Saved Jobs Grid */}
        {savedJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {savedJobs.map((job) => (
              <Card
                key={job.saved_id}
                className="border-[#17960b]/20 hover:shadow-lg transition-shadow relative"
              >
                <CardContent className="p-4 md:p-6">
                  {/* Saved Badge */}
                  <div className="absolute top-3 right-3 bg-[#ffca1a] text-gray-900 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
                    <Bookmark className="w-3 h-3 fill-current" />
                    Saved
                  </div>

                  {/* Job Title */}
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 pr-16">
                    {job.job_title}
                  </h3>

                  {/* Company */}
                  <p className="text-sm md:text-base text-gray-600 mb-4">
                    {job.company_name}
                  </p>

                  {/* Salary */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 shrink-0">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <g>
                          <path d={svgPaths.p2f7a47f0} stroke="#364153" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        </g>
                      </svg>
                    </div>
                    <span className="text-sm md:text-base text-gray-700">
                      {job.job_salary_range}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-4 shrink-0">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <g>
                          <path d={svgPaths.p9696100} stroke="#364153" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          <path d={svgPaths.p30b23180} stroke="#364153" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        </g>
                      </svg>
                    </div>
                    <span className="text-sm md:text-base text-gray-700">
                      {job.location}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="pt-3 md:pt-4 border-t border-gray-200 flex items-center justify-between text-xs md:text-sm mb-4">
                    <span className="text-gray-600">
                      {job.job_number_needed} Vacancies
                    </span>
                    <span className="text-gray-500">
                      {formatPostedDate(job.jo_posted_date)}
                    </span>
                  </div>

                  {/* Saved Date */}
                  <p className="text-xs text-gray-500 mb-4">
                    Saved on {new Date(job.saved_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onApply({
                        title: job.job_title,
                        company: job.company_name,
                        location: job.location,
                      })}
                      className="flex-1 bg-[#17960b] hover:bg-[#17960b]/90 text-white text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Apply Now
                    </Button>
                    <Button
                      onClick={() => handleRemove(job.saved_id)}
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
