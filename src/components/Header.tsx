import { useState } from 'react';
import { User, Briefcase, Settings, LogOut, Menu, X, Bookmark } from 'lucide-react';
import imgLogo from 'figma:asset/636ded4fbbb48605dae08d3a89a37f53cf3273be.png';
import svgPaths from '../imports/svg-3nnvnkmfcx';
import { useAuth } from "./AuthPass";

interface HeaderProps {
  currentPage?: 'jobs' | 'resume' | 'about' | 'dashboard' | 'applications' | 'profile' | 'jobsforyou' | 'apply' | 'savedjobs';
  onNavigate?: (page: 'jobs' | 'resume' | 'about' | 'dashboard' | 'applications' | 'profile' | 'jobsforyou' | 'apply' | 'savedjobs') => void;
  isLoggedIn?: boolean;
  onAuthClick?: () => void;
}

export function Header({ currentPage = 'jobs', onNavigate, isLoggedIn = false, onAuthClick }: HeaderProps) {
  const { account } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b-[0.8px] border-[#e5e7eb] sticky top-0 z-50">
      <div className="max-w-[1236px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo and Company Name */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 shrink-0">
              <img 
                alt="Landbase" 
                className="w-full h-full object-cover" 
                src={imgLogo} 
              />
            </div>
            <span className="text-[13px] sm:text-[14px] md:text-[16px] font-bold leading-[18px] sm:leading-[20px] md:leading-[24px] text-[#101828]">
              Landbase Human Resources
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <button
              onClick={() => onNavigate?.('jobs')}
              className={`text-[16px] font-bold leading-[24px] transition-colors ${
                currentPage === 'jobs'
                  ? 'text-[#17960b]'
                  : 'text-[#4a5565] hover:text-[#17960b]'
              }`}
            >
              Job Portal
            </button>
            <button
              onClick={() => onNavigate?.('jobsforyou')}
              className={`text-[16px] font-bold leading-[24px] transition-colors ${
                currentPage === 'jobsforyou'
                  ? 'text-[#17960b]'
                  : 'text-[#4a5565] hover:text-[#17960b]'
              }`}
            >
              Featured Jobs
            </button>
            <button
              onClick={() => onNavigate?.('resume')}
              className={`text-[16px] font-bold leading-[24px] transition-colors ${
                currentPage === 'resume'
                  ? 'text-[#17960b]'
                  : 'text-[#4a5565] hover:text-[#17960b]'
              }`}
            >
              Resume Builder
            </button>
            <button
              onClick={() => onNavigate?.('about')}
              className={`text-[16px] font-bold leading-[24px] transition-colors ${
                currentPage === 'about'
                  ? 'text-[#17960b]'
                  : 'text-[#4a5565] hover:text-[#17960b]'
              }`}
            >
              About Us
            </button>
          </nav>

          {/* Desktop User Profile Button */}
          {isLoggedIn && (
            <div className="relative hidden lg:block">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 border-[0.8px] border-[#d1d5dc] rounded-[10px] hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-b from-[#ffca1a] to-[#17960b] rounded-full flex items-center justify-center">
                  <svg className="block w-5 h-5" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                    <g>
                      <path d={svgPaths.p1beb9580} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d={svgPaths.p32ab0300} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    </g>
                  </svg>
                </div>
                <span className="text-[16px] font-bold leading-[24px] text-[#101828]">{account?.t_applicant?.app_first_name}</span>
                <svg className="block w-4 h-4" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <g>
                    <path d={svgPaths.pb7adf00} stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </g>
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={() => {
                      onNavigate?.('dashboard');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate?.('savedjobs');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Bookmark className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">Saved Jobs</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate?.('applications');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Briefcase className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">My Applications</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate?.('profile');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">Account Settings</span>
                  </button>
                  <div className="border-t border-gray-200 my-2" />
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onAuthClick?.();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#e5e7eb] shadow-lg">
          <nav className="flex flex-col px-4 py-4 space-y-1">
            <button
              onClick={() => {
                onNavigate?.('jobs');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-4 py-3 rounded-lg text-[15px] font-semibold transition-colors ${
                currentPage === 'jobs'
                  ? 'text-[#17960b] bg-[#17960b]/10'
                  : 'text-[#4a5565] hover:bg-gray-100'
              }`}
            >
              Job Portal
            </button>
            <button
              onClick={() => {
                onNavigate?.('jobsforyou');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-4 py-3 rounded-lg text-[15px] font-semibold transition-colors ${
                currentPage === 'jobsforyou'
                  ? 'text-[#17960b] bg-[#17960b]/10'
                  : 'text-[#4a5565] hover:bg-gray-100'
              }`}
            >
              Featured Jobs
            </button>
            <button
              onClick={() => {
                onNavigate?.('resume');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-4 py-3 rounded-lg text-[15px] font-semibold transition-colors ${
                currentPage === 'resume'
                  ? 'text-[#17960b] bg-[#17960b]/10'
                  : 'text-[#4a5565] hover:bg-gray-100'
              }`}
            >
              Resume Builder
            </button>
            <button
              onClick={() => {
                onNavigate?.('about');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-4 py-3 rounded-lg text-[15px] font-semibold transition-colors ${
                currentPage === 'about'
                  ? 'text-[#17960b] bg-[#17960b]/10'
                  : 'text-[#4a5565] hover:bg-gray-100'
              }`}
            >
              About Us
            </button>
          </nav>

          {/* Mobile User Profile Menu */}
          {isLoggedIn && (
            <div className="border-t border-[#e5e7eb] px-4 py-4">
              <div className="flex items-center gap-3 mb-4 px-4">
                <div className="w-10 h-10 bg-gradient-to-b from-[#ffca1a] to-[#17960b] rounded-full flex items-center justify-center shrink-0">
                  <svg className="block w-6 h-6" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                    <g>
                      <path d={svgPaths.p1beb9580} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d={svgPaths.p32ab0300} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    </g>
                  </svg>
                </div>
                <span className="text-[16px] font-bold leading-[24px] text-[#101828]">{account?.t_applicant?.app_first_name}</span>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    onNavigate?.('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">My Profile</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate?.('savedjobs');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bookmark className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">Saved Jobs</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate?.('applications');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Briefcase className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">My Applications</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate?.('profile');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">Account Settings</span>
                </button>
                <div className="border-t border-gray-200 my-2" />
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onAuthClick?.();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
