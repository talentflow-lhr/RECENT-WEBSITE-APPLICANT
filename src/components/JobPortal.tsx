import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Search, MapPin, DollarSign, X, Bookmark, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import svgPaths from '../imports/svg-3nnvnkmfcx';
import { useAuth } from './AuthPass';
import { supabase } from './supabaseClient';

interface Job {
  id: number;
  jo_id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  vacancies: number;
  filled: number;
  posted: string;
  deadline: string;
  category: string;
  description: string;
  requirements: string[];
  contractLength: string;
}

interface FeaturedJobOrder {
  jo_id: number;
  company_name: string;
  jo_country: string;
  jo_posted_date: string;
  jo_deadline: string;
  jo_requirements: string[];
  jo_highlights: string[];
  jo_image_url: string | null;
  jo_phone_number: string;
  jo_email: string;
  jo_interview_start_date: string | null;
  jo_interview_end_date: string | null;
  is_featured: boolean;
  placement_fee: number | null;
  positions: {
    position_id: number;
    job_title: string;
    job_number_needed: number;
  }[];
}

interface JobPortalProps {
  onApply?: (job: { title: string; company: string; location: string }) => void;
  onSaveJob?: (job: any) => void;
  savedJobIds?: number[];
  onNavigateToProfile?: () => void;
  onNavigateToResume?: () => void;
  onNavigateToPositions?: () => void;
}

export function JobPortal({ onApply, onSaveJob, savedJobIds = [], onNavigateToProfile, onNavigateToResume, onNavigateToPositions }: JobPortalProps) {
  const { account } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [searchType, setSearchType] = useState<'any' | 'exact'>('any');
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedFeaturedOrder, setSelectedFeaturedOrder] = useState<FeaturedJobOrder | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  // Featured job orders from Supabase
  const [featuredOrders, setFeaturedOrders] = useState<FeaturedJobOrder[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  // Regular job positions
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch saved jobs ───────────────────────────────────────────────────────
  const fetchSavedJobs = async () => {
    if (!account) return;
    const { data } = await supabase
      .from('t_saved_jobs')
      .select('position_id')
      .eq('applicant_id', account.applicant_id);
    if (data) setSavedIds(data.map((d: any) => d.position_id));
  };

  const handleToggleSave = async (jobId: number) => {
    if (!account) return;
    const isSaved = savedIds.includes(jobId);
    if (isSaved) {
      await supabase
        .from('t_saved_jobs')
        .delete()
        .eq('applicant_id', account.applicant_id)
        .eq('position_id', jobId);
      setSavedIds(prev => prev.filter(id => id !== jobId));
    } else {
      await supabase
        .from('t_saved_jobs')
        .insert({ applicant_id: account.applicant_id, position_id: jobId });
      setSavedIds(prev => [...prev, jobId]);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [account]);

  // ─── Fetch featured job orders ───────────────────────────────────────────────
  const fetchFeaturedOrders = async () => {
    setFeaturedLoading(true);
    try {
      const { data, error } = await supabase
        .from('t_job_orders')
        .select(`
          jo_id,
          jo_country,
          jo_posted_date,
          jo_deadline,
          jo_requirements,
          jo_highlights,
          jo_image_url,
          jo_phone_number,
          jo_email,
          is_featured,
          placement_fee,
          t_companies (
            company_name
          ),
          t_date!t_job_orders_jo_interview_start_date_id_fkey (
            full_date
          ),
          interview_end:t_date!t_job_orders_jo_interview_end_date_id_fkey (
            full_date
          ),
          t_job_positions (
            position_id,
            job_title,
            job_number_needed
          )
        `)
        .eq('is_featured', true)
        .eq('is_active', true)
        .eq('is_posted', true);

      if (error) throw error;

      const mapped: FeaturedJobOrder[] = (data || []).map((order: any) => ({
        jo_id: order.jo_id,
        company_name: order.t_companies?.company_name || 'Unknown Company',
        jo_country: order.jo_country || '',
        jo_posted_date: order.jo_posted_date || '',
        jo_deadline: order.jo_deadline || '',
        jo_requirements: order.jo_requirements || [],
        jo_highlights: order.jo_highlights || [],
        jo_image_url: order.jo_image_url || null,
        jo_phone_number: order.jo_phone_number || '',
        jo_email: order.jo_email || '',
        jo_interview_start_date: order.t_date?.full_date || null,
        jo_interview_end_date: order.interview_end?.full_date || null,
        is_featured: order.is_featured,
        placement_fee: order.placement_fee ?? null,
        positions: (order.t_job_positions || []).map((p: any) => ({
          position_id: p.position_id,
          job_title: p.job_title,
          job_number_needed: p.job_number_needed,
        })),
      }));

      setFeaturedOrders(mapped);
    } catch (err) {
      console.error('Error fetching featured orders:', err);
    } finally {
      setFeaturedLoading(false);
    }
  };

  // ─── Fetch regular job positions ─────────────────────────────────────────────
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('t_job_positions')
        .select(`
          position_id,
          jo_id,
          job_title,
          job_salary_range,
          job_number_needed,
          job_filled_count,
          job_category,
          job_description,
          job_requirements,
          job_contract_length,
          is_active,
          t_job_orders!inner (
            jo_id,
            jo_country,
            jo_posted_date,
            jo_deadline,
            is_active,
            is_posted,
            t_companies (
              company_name,
              company_country
            )
          )
        `)
        .eq('is_active', true)
        .eq('t_job_orders.is_active', true)
        .eq('t_job_orders.is_posted', true);

      if (error) throw error;

      const mapped: Job[] = (data || [])
        .filter((pos: any) => pos.t_job_orders)
        .map((pos: any) => {
          const order = pos.t_job_orders as any;
          const company = order?.t_companies as any;
          const postedDate = order?.jo_posted_date
            ? formatPostedDate(order.jo_posted_date)
            : 'Recently posted';
          return {
            id: pos.position_id,
            jo_id: pos.jo_id,
            title: pos.job_title || 'Untitled Position',
            company: company?.company_name || 'Unknown Company',
            location: order?.jo_country || company?.company_country || 'Location TBD',
            salary: pos.job_salary_range || 'Competitive',
            vacancies: pos.job_number_needed || 0,
            filled: pos.job_filled_count || 0,
            posted: postedDate,
            deadline: order?.jo_deadline || '',
            category: pos.job_category || '',
            description: pos.job_description || '',
            requirements: pos.job_requirements || [],
            contractLength: pos.job_contract_length || '',
          };
        });

      setJobsData(mapped);
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedOrders();
    fetchJobs();
  }, []);

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const formatPostedDate = (dateStr: string): string => {
    const posted = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - posted.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const formatDateRange = (start: string | null, end: string | null): string => {
    if (!start && !end) return 'TBA';
    const fmt = (d: string) =>
      new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (start && end) return `${fmt(start)} – ${fmt(end)}`;
    if (start) return `From ${fmt(start)}`;
    return `Until ${fmt(end!)}`;
  };

  // Get a public URL for the image stored in the Supabase storage bucket
  const getFeaturedImageUrl = (rawUrl: string | null): string | null => {
    if (!rawUrl) return null;
    // If already a full URL, return as-is
    if (rawUrl.startsWith('http')) return rawUrl;
    // Otherwise treat as a storage path and generate a public URL
    const { data } = supabase.storage.from('job-images').getPublicUrl(rawUrl);
    return data?.publicUrl ?? null;
  };

  // ─── Filter logic ─────────────────────────────────────────────────────────────
  const filterJobs = () => {
    if (!searchQuery && !locationQuery && activeFilters.length === 0) return jobsData;
    return jobsData.filter(job => {
      let matchesSearch = true;
      let matchesLocation = true;
      let matchesFilters = true;

      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const titleLower = job.title.toLowerCase();
        const companyLower = job.company.toLowerCase();
        if (searchType === 'exact') {
          matchesSearch = titleLower.includes(searchLower) || companyLower.includes(searchLower);
        } else {
          const searchWords = searchLower.split(' ').filter(w => w.length > 0);
          matchesSearch = searchWords.some(w => titleLower.includes(w) || companyLower.includes(w));
        }
      }
      if (locationQuery) {
        matchesLocation = job.location.toLowerCase().includes(locationQuery.toLowerCase());
      }
      if (activeFilters.length > 0) {
        matchesFilters = activeFilters.every(() => true); // extend per field as needed
      }
      return matchesSearch && matchesLocation && matchesFilters;
    });
  };

  const filteredJobs = isSearching || searchQuery || locationQuery || activeFilters.length > 0
    ? filterJobs()
    : jobsData;

  const handleSearch = () => {
    setIsSearching(true);
    document.getElementById('job-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setIsSearching(false);
    setActiveFilters([]);
  };

  const handleApplyNow = (job: any) => {
    if (onApply) onApply({ title: job.title, company: job.company, location: job.location });
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  // ─── Featured Banner Card ─────────────────────────────────────────────────────
  const FeaturedBannerCard = ({ order }: { order: FeaturedJobOrder }) => {
    const imageUrl = getFeaturedImageUrl(order.jo_image_url);
    const isNoFee = !order.placement_fee || order.placement_fee === 0;

    return (
      <div className="mb-6">
        <div className="bg-gradient-to-r from-[#17960b] to-[#0d5e06] rounded-2xl p-1">
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="p-4 sm:p-5">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#ffca1a] text-[#101828] px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                  FEATURED OPPORTUNITY
                </div>
                {isNoFee && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold animate-pulse">
                    NO PLACEMENT FEE
                  </div>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#101828] mb-4">
                {order.company_name}
                {order.jo_country ? ` — ${order.jo_country}` : ''}
              </h2>

              {/* Positions grid */}
              {order.positions.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-bold text-[#17960b] mb-3">Available Positions:</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1">
                    {order.positions.map(pos => (
                      <div key={pos.position_id} className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">
                          {pos.job_title}
                          {pos.job_number_needed ? ` (${pos.job_number_needed})` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights & Requirements */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {order.jo_highlights.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#17960b] mb-3">Highlights:</h3>
                    <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                      {order.jo_highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className={`mt-1 ${h.toLowerCase().includes('no placement') ? 'text-red-500 font-bold' : 'text-[#17960b]'}`}>✓</span>
                          <span className={h.toLowerCase().includes('no placement') ? 'font-semibold' : ''}>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {order.jo_requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#17960b] mb-3">Requirements:</h3>
                    <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                      {order.jo_requirements.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#101828] mt-1">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Interview schedule */}
              {(order.jo_interview_start_date || order.jo_interview_end_date) && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold text-red-500">Tentative Face-to-Face Interview Schedule:</span>
                  </p>
                  <p className="text-sm text-[#101828] font-semibold">
                    {formatDateRange(order.jo_interview_start_date, order.jo_interview_end_date)}
                  </p>
                </div>
              )}

              {/* Contact + Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  {(order.jo_phone_number || order.jo_email) && (
                    <>
                      <p className="text-sm text-gray-600 mb-2">Contact Details:</p>
                      <div className="space-y-1 text-sm">
                        {order.jo_phone_number && (
                          <p className="font-semibold text-[#101828]">{order.jo_phone_number}</p>
                        )}
                        {order.jo_email && (
                          <p className="text-[#17960b]">{order.jo_email}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* View Full Details — shows poster image if available */}
                  {imageUrl && (
                    <button
                      onClick={() => setSelectedFeaturedOrder(order)}
                      className="bg-[#ffca1a] hover:bg-[#e6b617] text-[#101828] px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>View Full Details</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={onNavigateToPositions}
                    className="bg-[#17960b] hover:bg-[#148509] text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>View All Positions</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#17960b] via-[#158d0a] via-[29.808%] to-[#0d5e06] py-8 sm:py-10 md:py-12 lg:py-16 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-[1236px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-[768px]">
            <h1 className="text-[24px] sm:text-[28px] md:text-[36px] lg:text-[40px] xl:text-[48px] font-bold leading-tight text-white mb-3 sm:mb-4 md:mb-6">
              Hiring the Right People at the Right Place at the Right Time.
            </h1>
            <p className="text-[15px] sm:text-base md:text-lg font-medium leading-relaxed text-white/95 mb-6 sm:mb-8 md:mb-12">
              Explore jobs, salaries, benefits, and different countries.
            </p>

            {/* Search Box */}
            <div className="bg-white rounded-[10px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] p-4 sm:p-5 md:p-6">
              <div className="flex flex-col gap-3 mb-4 md:mb-5">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                      <g>
                        <path d="M17.5 17.5L13.8833 13.8833" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d={svgPaths.pcddfd00} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      </g>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Search Jobs by Keywords"
                    className="w-full pl-10 pr-3 py-3 sm:py-2.5 bg-[#f3f3f5] border-0 rounded-lg text-[14px] sm:text-[15px] leading-[normal] text-gray-900 placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-[#ffca1a]"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5">
                    <MapPin className="block size-full text-[#99A1AF]" />
                  </div>
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Search by Location"
                    className="w-full pl-10 pr-3 py-3 sm:py-2.5 bg-[#f3f3f5] border-0 rounded-lg text-[14px] sm:text-[15px] leading-[normal] text-gray-900 placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-[#ffca1a]"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full bg-[#ffca1a] hover:bg-[#e6b617] text-[#101828] px-4 py-3 sm:py-2.5 rounded-lg text-[15px] sm:text-[14px] font-semibold sm:font-normal leading-[20px] transition-colors"
                >
                  Search
                </button>
              </div>

              <div className="flex gap-4 sm:gap-6 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="searchType" value="any" checked={searchType === 'any'} onChange={(e) => setSearchType(e.target.value as 'any' | 'exact')} className="w-[13px] h-[13px]" />
                  <span className="text-[13px] sm:text-[14px] leading-[20px] text-[#364153]">Any of the Word</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="searchType" value="exact" checked={searchType === 'exact'} onChange={(e) => setSearchType(e.target.value as 'any' | 'exact')} className="w-[13px] h-[13px]" />
                  <span className="text-[13px] sm:text-[14px] leading-[20px] text-[#364153]">Exact Word</span>
                </label>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {(['landbased', 'no-placement-fee', 'high-school-graduate', 'no-work-experience'] as const).map(filter => (
                  <button
                    key={filter}
                    className={`border-[0.8px] rounded-lg px-3 py-2 sm:px-2.5 sm:py-1.5 text-[13px] sm:text-[14px] leading-[20px] flex items-center gap-1.5 sm:gap-2 transition-colors touch-manipulation ${
                      activeFilters.includes(filter)
                        ? 'bg-[#ffca1a] text-[#101828] border-[#ffca1a]'
                        : 'bg-white text-[#364153] border-white/50 hover:bg-gray-50'
                    }`}
                    onClick={() => toggleFilter(filter)}
                  >
                    {filter === 'landbased' && (
                      <div className="w-3 h-3 shrink-0">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                          <g>
                            <path d={svgPaths.p2e0e03b4} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            <path d={svgPaths.p39c8900} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                          </g>
                        </svg>
                      </div>
                    )}
                    {filter === 'landbased' ? 'Landbased' :
                     filter === 'no-placement-fee' ? 'No Placement Fee' :
                     filter === 'high-school-graduate' ? 'High School Graduate' :
                     'No Work Experience'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Cards Section */}
      <div className="py-6 sm:py-8 md:py-12 bg-white">
        <div className="max-w-[1236px] mx-auto px-4 sm:px-6 md:px-8">

          {/* Featured Banners — dynamic from Supabase */}
          {featuredLoading ? (
            <div className="flex items-center justify-center py-8 mb-6">
              <svg className="w-8 h-8 animate-spin text-[#17960b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : (
            featuredOrders.map(order => (
              <FeaturedBannerCard key={order.jo_id} order={order} />
            ))
          )}

          {/* Regular Positions */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <svg className="w-10 h-10 animate-spin text-[#17960b] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-gray-600 font-medium">Loading available positions...</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button onClick={fetchJobs} className="bg-[#17960b] text-white px-6 py-2 rounded-lg hover:bg-[#0d5e06] transition-colors">
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {(searchQuery || locationQuery || isSearching || activeFilters.length > 0) && (
                <div id="job-results" className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">Search Results</h2>
                    <p className="text-sm md:text-base text-gray-600">
                      Found {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
                      {searchQuery && ` matching "${searchQuery}"`}
                      {locationQuery && ` in ${locationQuery}`}
                    </p>
                  </div>
                  <button onClick={handleClearFilters} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors self-start sm:self-auto">
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                </div>
              )}

              {filteredJobs.length === 0 && (searchQuery || locationQuery || activeFilters.length > 0) && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Found</h3>
                  <p className="text-gray-600 mb-6">We couldn't find any jobs matching your search criteria.<br />Try adjusting your filters or search terms.</p>
                  <button onClick={handleClearFilters} className="bg-[#17960b] hover:bg-[#17960b]/90 text-white px-6 py-2 rounded-lg transition-colors">
                    View All Jobs
                  </button>
                </div>
              )}

              {filteredJobs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="bg-white border-[0.8px] border-[#e5e7eb] rounded-[14px] p-[0.8px] hover:shadow-lg transition-shadow touch-manipulation">
                      <div className="p-4 md:p-6">
                        <h3 className="text-[16px] font-normal leading-[24px] text-[#101828] mb-2">{job.title}</h3>
                        <p className="text-[14px] md:text-[16px] font-normal leading-[20px] md:leading-[24px] text-[#4a5565] mb-3 md:mb-4 pb-3 md:pb-4 border-b border-[#f3f4f6]">{job.company}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 shrink-0">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                              <g><path d={svgPaths.p2f7a47f0} stroke="#364153" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></g>
                            </svg>
                          </div>
                          <span className="text-[14px] md:text-[16px] font-normal leading-[20px] md:leading-[24px] text-[#364153]">{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3 md:mb-4 pb-3 md:pb-4 border-b border-[#f3f4f6]">
                          <div className="w-4 h-4 shrink-0">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                              <g>
                                <path d={svgPaths.p9696100} stroke="#364153" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                                <path d={svgPaths.p30b23180} stroke="#364153" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                              </g>
                            </svg>
                          </div>
                          <span className="text-[14px] md:text-[16px] font-normal leading-[20px] md:leading-[24px] text-[#364153]">{job.location}</span>
                        </div>
                        <div className="pt-3 md:pt-4 flex items-center justify-between text-[14px] md:text-[16px] mb-4">
                          <span className="font-normal leading-[20px] md:leading-[24px] text-[#4a5565]">{job.vacancies} Vacancies</span>
                          <span className="font-normal leading-[20px] md:leading-[24px] text-[#6a7282]">{job.posted}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => setSelectedJob(job)} className="w-full bg-[#ffca1a] hover:bg-[#e6b617] text-[#101828] px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors">
                            View Full Details
                          </button>
                          <div className="flex gap-2">
                            <button onClick={() => handleApplyNow(job)} className="flex-1 bg-[#17960b] hover:bg-[#158d0a] text-white px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors">
                              Apply Now
                            </button>
                            <button
                              onClick={() => handleToggleSave(job.id)}
                              className={`px-4 py-2.5 rounded-lg border transition-colors ${savedIds.includes(job.id) ? 'bg-[#ffca1a] border-[#ffca1a] text-[#101828]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                              title={savedIds.includes(job.id) ? 'Saved' : 'Save Job'}
                            >
                              <Bookmark className={`w-5 h-5 ${savedIds.includes(job.id) ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Featured Order Poster Modal */}
      {selectedFeaturedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedFeaturedOrder(null)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-5xl max-h-[95vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedFeaturedOrder.company_name} — Job Opportunities
              </h2>
              <button
                onClick={() => setSelectedFeaturedOrder(null)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {getFeaturedImageUrl(selectedFeaturedOrder.jo_image_url) ? (
                <img
                  src={getFeaturedImageUrl(selectedFeaturedOrder.jo_image_url)!}
                  alt={`${selectedFeaturedOrder.company_name} Job Poster`}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              ) : (
                <p className="text-gray-500 text-center py-12">No poster image available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-3xl max-h-[95vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900">{selectedJob.title}</h2>
              <button onClick={() => setSelectedJob(null)} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-lg text-gray-600 font-medium mb-4">{selectedJob.company}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-[#17960b]" />
                  <span className="text-sm font-medium">{selectedJob.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign className="w-5 h-5 text-[#17960b]" />
                  <span className="text-sm font-medium">{selectedJob.salary}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-[#17960b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm font-medium">{selectedJob.vacancies} Vacancies</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5 text-[#17960b]" />
                  <span className="text-sm font-medium">Posted {selectedJob.posted}</span>
                </div>
              </div>
              {selectedJob.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Job Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
                </div>
              )}
              {selectedJob.requirements?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                        <span className="text-[#17960b] mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleToggleSave(selectedJob.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border font-semibold transition-colors ${savedIds.includes(selectedJob.id) ? 'bg-[#ffca1a] border-[#ffca1a] text-[#101828]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  <Bookmark className={`w-5 h-5 ${savedIds.includes(selectedJob.id) ? 'fill-current' : ''}`} />
                  {savedIds.includes(selectedJob.id) ? 'Saved' : 'Save Job'}
                </button>
                <button
                  onClick={() => { handleApplyNow(selectedJob); setSelectedJob(null); }}
                  className="flex-1 bg-[#17960b] hover:bg-[#158d0a] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
