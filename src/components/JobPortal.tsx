import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Search, MapPin, DollarSign, X, Bookmark } from 'lucide-react';
import { useState } from 'react';
import svgPaths from '../imports/svg-3nnvnkmfcx';
import featuredJobPoster from 'figma:asset/69a79d0864f76398cf7c9e0b7e138a413d134914.png';
import gulfAsiaPoster from 'figma:asset/853b5c04ffd8a06102642323016ef1525a3c9fc7.png';

interface JobPortalProps {
  onApply?: (job: { title: string; company: string; location: string }) => void;
  onSaveJob?: (job: any) => void;
  savedJobIds?: number[];
  onNavigateToProfile?: () => void;
  onNavigateToResume?: () => void;
}

export function JobPortal({ onApply, onSaveJob, savedJobIds = [], onNavigateToProfile, onNavigateToResume }: JobPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [searchType, setSearchType] = useState<'any' | 'exact'>('any');
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [showGulfAsiaPosterModal, setShowGulfAsiaPosterModal] = useState(false);

  const jobsData = [
    // QCON Jobs - Featured Opportunities
    {
      id: 7,
      title: 'HEAVY EQUIPMENT OPERATOR',
      company: 'QCON (Qatar Engineering & Construction)',
      location: 'Doha, Qatar',
      salary: 'PHP 75,000-85,000',
      vacancies: 25,
      posted: '2 days ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 8,
      title: 'TRUCK DRIVER (1,2,3,4,5,15)',
      company: 'QCON (Qatar Engineering & Construction)',
      location: 'Doha, Qatar',
      salary: 'PHP 65,000-75,000',
      vacancies: 30,
      posted: '2 days ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 9,
      title: 'FORKLIFT OPERATOR',
      company: 'QCON (Qatar Engineering & Construction)',
      location: 'Doha, Qatar',
      salary: 'PHP 60,000-70,000',
      vacancies: 20,
      posted: '2 days ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 10,
      title: 'WELDER (SMAW/GMAW/GTAW)',
      company: 'QCON (Qatar Engineering & Construction)',
      location: 'Doha, Qatar',
      salary: 'PHP 70,000-80,000',
      vacancies: 35,
      posted: '2 days ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 11,
      title: 'ELECTRICIAN',
      company: 'QCON (Qatar Engineering & Construction)',
      location: 'Doha, Qatar',
      salary: 'PHP 70,000-80,000',
      vacancies: 28,
      posted: '2 days ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 12,
      title: 'PLUMBER',
      company: 'QCON (Qatar Engineering & Construction)',
      location: 'Doha, Qatar',
      salary: 'PHP 65,000-75,000',
      vacancies: 22,
      posted: '2 days ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 13,
      title: 'MECHANICAL TECHNICIAN',
      company: 'QCON (Qatar Engineering & Construction)',
      location: 'Doha, Qatar',
      salary: 'PHP 75,000-85,000',
      vacancies: 30,
      posted: '2 days ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 14,
      title: 'SCAFFOLDER',
      company: 'QCON (Qatar Engineering & Construction)',
      location: 'Doha, Qatar',
      salary: 'PHP 60,000-70,000',
      vacancies: 40,
      posted: '2 days ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 15,
      title: 'PIPE FITTER',
      company: 'QCON (Qatar Engineering & Construction)',
      location: 'Doha, Qatar',
      salary: 'PHP 70,000-80,000',
      vacancies: 25,
      posted: '2 days ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 16,
      title: 'RIGGER',
      company: 'QCON (Qatar Engineering & Construction)',
      location: 'Doha, Qatar',
      salary: 'PHP 65,000-75,000',
      vacancies: 18,
      posted: '2 days ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 17,
      title: 'HVAC TECHNICIAN',
      company: 'QCON (Qatar Engineering & Construction)',
      location: 'Doha, Qatar',
      salary: 'PHP 70,000-80,000',
      vacancies: 20,
      posted: '2 days ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 18,
      title: 'CONSTRUCTION WORKER',
      company: 'QCON (Qatar Engineering & Construction)',
      location: 'Doha, Qatar',
      salary: 'PHP 55,000-65,000',
      vacancies: 50,
      posted: '2 days ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 19,
      title: 'INSTRUMENT TECHNICIAN',
      company: 'QCON (Qatar Engineering & Construction)',
      location: 'Doha, Qatar',
      salary: 'PHP 75,000-85,000',
      vacancies: 15,
      posted: '2 days ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 20,
      title: 'MASON',
      company: 'QCON (Qatar Engineering & Construction)',
      location: 'Doha, Qatar',
      salary: 'PHP 60,000-70,000',
      vacancies: 30,
      posted: '2 days ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 21,
      title: 'PAINTER',
      company: 'QCON (Qatar Engineering & Construction)',
      location: 'Doha, Qatar',
      salary: 'PHP 55,000-65,000',
      vacancies: 25,
      posted: '2 days ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    // Gulf Asia Jobs - Featured Opportunities
    {
      id: 22,
      title: 'PIPE FITTER',
      company: 'Gulf Asia Contracting Company WLL',
      location: 'Doha, Qatar',
      salary: 'Best in Industry',
      vacancies: 100,
      posted: '1 day ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 23,
      title: 'PIPE FABRICATOR',
      company: 'Gulf Asia Contracting Company WLL',
      location: 'Doha, Qatar',
      salary: 'Best in Industry',
      vacancies: 25,
      posted: '1 day ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 24,
      title: 'HV CABLE TERMINATOR (66KV - PFISTER)',
      company: 'Gulf Asia Contracting Company WLL',
      location: 'Doha, Qatar',
      salary: 'Best in Industry',
      vacancies: 8,
      posted: '1 day ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 25,
      title: 'HV CABLE TERMINATOR (33KV - NEXAS)',
      company: 'Gulf Asia Contracting Company WLL',
      location: 'Doha, Qatar',
      salary: 'Best in Industry',
      vacancies: 12,
      posted: '1 day ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 26,
      title: 'INDUSTRIAL ELECTRICIAN',
      company: 'Gulf Asia Contracting Company WLL',
      location: 'Doha, Qatar',
      salary: 'Best in Industry',
      vacancies: 25,
      posted: '1 day ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 27,
      title: 'INSTRUMENT TECHNICIAN',
      company: 'Gulf Asia Contracting Company WLL',
      location: 'Doha, Qatar',
      salary: 'Best in Industry',
      vacancies: 25,
      posted: '1 day ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    },
    {
      id: 28,
      title: 'INSTRUMENT FITTER',
      company: 'Gulf Asia Contracting Company WLL',
      location: 'Doha, Qatar',
      salary: 'Best in Industry',
      vacancies: 25,
      posted: '1 day ago',
      type: 'landbased',
      placementFee: false,
      education: 'high-school',
      experience: true
    }
  ];

  // Filter jobs based on search criteria
  const filterJobs = () => {
    if (!searchQuery && !locationQuery && activeFilters.length === 0) {
      return jobsData;
    }

    return jobsData.filter(job => {
      let matchesSearch = true;
      let matchesLocation = true;
      let matchesFilters = true;

      // Check job title/company match
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const titleLower = job.title.toLowerCase();
        const companyLower = job.company.toLowerCase();

        if (searchType === 'exact') {
          matchesSearch = titleLower.includes(searchLower) || companyLower.includes(searchLower);
        } else {
          // "Any of the words" - split search query and check if any word matches
          const searchWords = searchLower.split(' ').filter(word => word.length > 0);
          matchesSearch = searchWords.some(word => 
            titleLower.includes(word) || companyLower.includes(word)
          );
        }
      }

      // Check location match
      if (locationQuery) {
        const locationLower = locationQuery.toLowerCase();
        matchesLocation = job.location.toLowerCase().includes(locationLower);
      }

      // Check filters
      if (activeFilters.length > 0) {
        matchesFilters = activeFilters.every(filter => {
          switch (filter) {
            case 'landbased':
              return job.type === 'landbased';
            case 'no-placement-fee':
              return !job.placementFee;
            case 'high-school-graduate':
              return job.education === 'high-school';
            case 'no-work-experience':
              return !job.experience;
            default:
              return true;
          }
        });
      }

      return matchesSearch && matchesLocation && matchesFilters;
    });
  };

  const handleSearch = () => {
    setIsSearching(true);
    // Scroll to results
    const resultsSection = document.getElementById('job-results');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setIsSearching(false);
    setActiveFilters([]);
  };

  const handleSaveJob = (jobId: number) => {
    const job = jobsData.find(j => j.id === jobId);
    if (job && onSaveJob) {
      onSaveJob(job);
    }
  };

  const handleApplyNow = (job: any) => {
    if (onApply) {
      onApply({ title: job.title, company: job.company, location: job.location });
    }
  };

  const filteredJobs = isSearching || searchQuery || locationQuery || activeFilters.length > 0 ? filterJobs() : jobsData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#17960b] via-[#158d0a] via-[29.808%] to-[#0d5e06] py-8 sm:py-10 md:py-12 lg:py-16 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-[1236px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-[768px]">
            {/* Heading */}
            <h1 className="text-[24px] sm:text-[28px] md:text-[36px] lg:text-[40px] xl:text-[48px] font-bold leading-tight text-white mb-3 sm:mb-4 md:mb-6">
              Hiring the Right People at the Right Place at the Right Time.
            </h1>
            <p className="text-[15px] sm:text-base md:text-lg font-medium leading-relaxed text-white/95 mb-6 sm:mb-8 md:mb-12">
              Explore jobs, salaries, benefits, and different countries.
            </p>

            {/* Search Box */}
            <div className="bg-white rounded-[10px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] p-4 sm:p-5 md:p-6">
              {/* Search Input and Button */}
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

              {/* Radio Buttons */}
              <div className="flex gap-4 sm:gap-6 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    value="any"
                    checked={searchType === 'any'}
                    onChange={(e) => setSearchType(e.target.value as 'any' | 'exact')}
                    className="w-[13px] h-[13px]"
                  />
                  <span className="text-[13px] sm:text-[14px] leading-[20px] text-[#364153]">Any of the Word</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    value="exact"
                    checked={searchType === 'exact'}
                    onChange={(e) => setSearchType(e.target.value as 'any' | 'exact')}
                    className="w-[13px] h-[13px]"
                  />
                  <span className="text-[13px] sm:text-[14px] leading-[20px] text-[#364153]">Exact Word</span>
                </label>
              </div>

              {/* Filter Badges */}
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                <button
                  className={`border-[0.8px] rounded-lg px-3 py-2 sm:px-2.5 sm:py-1.5 text-[13px] sm:text-[14px] leading-[20px] flex items-center gap-1.5 sm:gap-2 transition-colors touch-manipulation ${
                    activeFilters.includes('landbased') 
                      ? 'bg-[#ffca1a] text-[#101828] border-[#ffca1a]' 
                      : 'bg-white text-[#364153] border-white/50 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    if (activeFilters.includes('landbased')) {
                      setActiveFilters(activeFilters.filter(filter => filter !== 'landbased'));
                    } else {
                      setActiveFilters([...activeFilters, 'landbased']);
                    }
                  }}
                >
                  <div className="w-3 h-3 shrink-0">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                      <g>
                        <path d={svgPaths.p2e0e03b4} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={svgPaths.p39c8900} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                    </svg>
                  </div>
                  Landbased
                </button>
                <button
                  className={`border-[0.8px] rounded-lg px-3 py-2 sm:px-2.5 sm:py-1.5 text-[13px] sm:text-[14px] leading-[20px] transition-colors touch-manipulation ${
                    activeFilters.includes('no-placement-fee') 
                      ? 'bg-[#ffca1a] text-[#101828] border-[#ffca1a]' 
                      : 'bg-white text-[#364153] border-white/50 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    if (activeFilters.includes('no-placement-fee')) {
                      setActiveFilters(activeFilters.filter(filter => filter !== 'no-placement-fee'));
                    } else {
                      setActiveFilters([...activeFilters, 'no-placement-fee']);
                    }
                  }}
                >
                  No Placement Fee
                </button>
                <button
                  className={`border-[0.8px] rounded-lg px-3 py-2 sm:px-2.5 sm:py-1.5 text-[13px] sm:text-[14px] leading-[20px] transition-colors touch-manipulation ${
                    activeFilters.includes('high-school-graduate') 
                      ? 'bg-[#ffca1a] text-[#101828] border-[#ffca1a]' 
                      : 'bg-white text-[#364153] border-white/50 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    if (activeFilters.includes('high-school-graduate')) {
                      setActiveFilters(activeFilters.filter(filter => filter !== 'high-school-graduate'));
                    } else {
                      setActiveFilters([...activeFilters, 'high-school-graduate']);
                    }
                  }}
                >
                  High School Graduate
                </button>
                <button
                  className={`border-[0.8px] rounded-lg px-3 py-2 sm:px-2.5 sm:py-1.5 text-[13px] sm:text-[14px] leading-[20px] transition-colors touch-manipulation ${
                    activeFilters.includes('no-work-experience') 
                      ? 'bg-[#ffca1a] text-[#101828] border-[#ffca1a]' 
                      : 'bg-white text-[#364153] border-white/50 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    if (activeFilters.includes('no-work-experience')) {
                      setActiveFilters(activeFilters.filter(filter => filter !== 'no-work-experience'));
                    } else {
                      setActiveFilters([...activeFilters, 'no-work-experience']);
                    }
                  }}
                >
                  No Work Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Cards Section */}
      <div className="py-6 sm:py-8 md:py-12 bg-white">
        <div className="max-w-[1236px] mx-auto px-4 sm:px-6 md:px-8">
          
          {/* Featured Job Opportunity Banner */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <div className="bg-gradient-to-r from-[#17960b] to-[#0d5e06] rounded-2xl p-1">
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-[#ffca1a] text-[#101828] px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      FEATURED OPPORTUNITY
                    </div>
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold animate-pulse">
                      NO PLACEMENT FEE
                    </div>
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#101828] mb-4">
                    QCON - Excellent Opportunities in Qatar Qatar Qatar
                  </h2>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-bold text-[#17960b] mb-3">Available Positions:</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Heavy Equipment Operator</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Truck Driver (1,2,3,4,5,15)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Forklift Operator</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Welder (SMAW/GMAW/GTAW)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Electrician</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Plumber</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Mechanical Technician</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Scaffolder</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Pipe Fitter</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Rigger</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">HVAC Technician</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Construction Worker</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Instrument Technician</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Mason</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Painter</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[#17960b] mb-3">Highlights:</h3>
                      <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-[#17960b] mt-1">✓</span>
                          <span>Long term employment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#17960b] mt-1">✓</span>
                          <span>Salary package will be best in the Industry</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-1 font-bold">✓</span>
                          <span className="font-semibold">NO PLACEMENT FEE</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-[#17960b] mb-3">Requirements:</h3>
                      <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-[#101828] mt-1">•</span>
                          <span>Must have valid Driver's License (Under 1,2,3,4,5,15)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#101828] mt-1">•</span>
                          <span>Must have 2 years experience in Oil/Gas or Petrochemicals</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold text-red-500">Face to Face Interview Schedule (Tentative):</span>
                    </p>
                    <p className="text-sm text-[#101828] font-semibold mb-1">
                      MANILA - FEB. 28 - MARCH 6, 2026
                    </p>
                    <p className="text-sm text-[#101828] font-semibold">
                      CEBU - MARCH 8-10, 2026
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Contact Details:</p>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-[#101828]">CP# 09171499075 / 09658309775</p>
                        <p className="text-[#17960b]">landbasecv1@gmail.com</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowPosterModal(true)}
                      className="bg-[#ffca1a] hover:bg-[#e6b617] text-[#101828] px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <span>View Full Details</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gulf Asia Featured Job Opportunity Banner */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <div className="bg-gradient-to-r from-[#17960b] to-[#0d5e06] rounded-2xl p-1">
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-[#ffca1a] text-[#101828] px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      FEATURED OPPORTUNITY
                    </div>
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold animate-pulse">
                      NO PLACEMENT FEE
                    </div>
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#101828] mb-4">
                    Gulf Asia Contracting Company - Mega Project in Qatar
                  </h2>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-bold text-[#17960b] mb-3">Available Positions:</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Pipe Fitter (100 openings)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Pipe Fabricator (25)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">HV Cable Terminator 66KV (8)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">HV Cable Terminator 33KV (12)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Industrial Electrician (25)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Instrument Technician (25)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#17960b] text-lg mt-0.5">•</span>
                        <span className="text-sm font-medium text-gray-800">Instrument Fitter (25)</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[#17960b] mb-3">Highlights:</h3>
                      <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-[#17960b] mt-1">✓</span>
                          <span>Long term employment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#17960b] mt-1">✓</span>
                          <span>Salary package will be best in the industry</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-1 font-bold">✓</span>
                          <span className="font-semibold">NO PLACEMENT FEE</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-[#17960b] mb-3">Requirements:</h3>
                      <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-[#101828] mt-1">•</span>
                          <span>At least 5 years experience in oil & gas industry</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#101828] mt-1">•</span>
                          <span>Petrochemical plant experience required</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#101828] mt-1">•</span>
                          <span>Collaborate easily with co-workers</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold text-red-500">Tentative Face-to-Face Interview Schedule:</span>
                    </p>
                    <p className="text-sm text-[#101828] font-semibold">
                      3rd Week of January 2026
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Contact Details:</p>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-[#101828]">landbasecv1@gmail.com</p>
                        <p className="text-[#17960b]">landbaseskilled2025@gmail.com</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowGulfAsiaPosterModal(true)}
                      className="bg-[#ffca1a] hover:bg-[#e6b617] text-[#101828] px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <span>View Full Details</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results Header */}
          {(searchQuery || locationQuery || isSearching || activeFilters.length > 0) && (
            <div id="job-results" className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
                  Search Results
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                  Found {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
                  {searchQuery && ` matching "${searchQuery}"`}
                  {locationQuery && ` in ${locationQuery}`}
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors self-start sm:self-auto"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          )}

          {/* No Results Message */}
          {filteredJobs.length === 0 && (searchQuery || locationQuery || activeFilters.length > 0) && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any jobs matching your search criteria.
                <br />
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-[#17960b] hover:bg-[#17960b]/90 text-white px-6 py-2 rounded-lg transition-colors"
              >
                View All Jobs
              </button>
            </div>
          )}

          {/* Job Cards Grid */}
          {filteredJobs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border-[0.8px] border-[#e5e7eb] rounded-[14px] p-[0.8px] hover:shadow-lg transition-shadow touch-manipulation"
                >
                  <div className="p-4 md:p-6">
                    {/* Job Title */}
                    <h3 className="text-[16px] font-normal leading-[24px] text-[#101828] mb-2">
                      {job.title}
                    </h3>

                    {/* Company */}
                    <p className="text-[14px] md:text-[16px] font-normal leading-[20px] md:leading-[24px] text-[#4a5565] mb-3 md:mb-4 pb-3 md:pb-4 border-b border-[#f3f4f6]">
                      {job.company}
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
                      <span className="text-[14px] md:text-[16px] font-normal leading-[20px] md:leading-[24px] text-[#364153]">
                        {job.salary}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 mb-3 md:mb-4 pb-3 md:pb-4 border-b border-[#f3f4f6]">
                      <div className="w-4 h-4 shrink-0">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                          <g>
                            <path d={svgPaths.p9696100} stroke="#364153" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            <path d={svgPaths.p30b23180} stroke="#364153" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          </g>
                        </svg>
                      </div>
                      <span className="text-[14px] md:text-[16px] font-normal leading-[20px] md:leading-[24px] text-[#364153]">
                        {job.location}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 md:pt-4 flex items-center justify-between text-[14px] md:text-[16px] mb-4">
                      <span className="font-normal leading-[20px] md:leading-[24px] text-[#4a5565]">
                        {job.vacancies} Vacancies
                      </span>
                      <span className="font-normal leading-[20px] md:leading-[24px] text-[#6a7282]">
                        {job.posted}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApplyNow(job)}
                        className="flex-1 bg-[#17960b] hover:bg-[#158d0a] text-white px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors"
                      >
                        Apply Now
                      </button>
                      <button
                        onClick={() => handleSaveJob(job.id)}
                        className={`px-4 py-2.5 rounded-lg border transition-colors ${
                          savedJobIds.includes(job.id)
                            ? 'bg-[#ffca1a] border-[#ffca1a] text-[#101828]'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        title={savedJobIds.includes(job.id) ? 'Saved' : 'Save Job'}
                      >
                        <Bookmark
                          className={`w-5 h-5 ${
                            savedJobIds.includes(job.id) ? 'fill-current' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Poster Modal */}
      {showPosterModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPosterModal(false)}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-5xl max-h-[95vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900">QCON - Qatar Job Opportunities</h2>
              <button
                onClick={() => setShowPosterModal(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <img
                src={featuredJobPoster}
                alt="QCON Featured Job Poster"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Gulf Asia Poster Modal */}
      {showGulfAsiaPosterModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowGulfAsiaPosterModal(false)}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-5xl max-h-[95vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900">Gulf Asia Contracting - Qatar Job Opportunities</h2>
              <button
                onClick={() => setShowGulfAsiaPosterModal(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <img
                src={gulfAsiaPoster}
                alt="Gulf Asia Contracting Job Poster"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
