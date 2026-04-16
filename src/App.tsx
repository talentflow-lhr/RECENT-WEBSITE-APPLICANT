import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { JobPortal } from './components/JobPortal';
import { JobsForYou } from './components/JobsForYou';
import { ResumeBuilder } from './components/ResumeBuilder';
import { ApplicantDashboard } from './components/ApplicantDashboard';
import { ResumeAnalysisPreview } from './components/ResumeAnalysisPreview';
import { AboutUs } from './components/AboutUs';
import { ApplicationProgress } from './components/ApplicationProgress';
import { ProfileSettings } from './components/ProfileSettings';
import { ChatBot } from './components/ChatBot';
import { Footer } from './components/Footer';
import { JobApplication } from './components/JobApplication';
import { SavedJobs } from './components/SavedJobs';
import { LoginPage } from './components/LoginPage';

interface JobData {
  title: string;
  company: string;
  location: string;
}

interface SavedJobData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  vacancies: string;
  posted: string;
  savedDate: Date;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'jobs' | 'resume' | 'about' | 'dashboard' | 'applications' | 'profile' | 'jobsforyou' | 'apply' | 'savedjobs'>('jobs');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Set to false to show login page first
  const [selectedJob, setSelectedJob] = useState<JobData | undefined>(undefined);
  const [savedJobs, setSavedJobs] = useState<SavedJobData[]>([]);
  const [hasResume, setHasResume] = useState(false); // Track if user has created/uploaded a resume

  // Scroll to top whenever the page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleApplyToJob = (job: JobData) => {
    setSelectedJob(job);
    setCurrentPage('apply');
  };

  const handleSaveJob = (job: any) => {
    // Check if job is already saved
    const isAlreadySaved = savedJobs.some(savedJob => savedJob.id === job.id.toString());
    
    if (isAlreadySaved) {
      // Remove from saved jobs
      setSavedJobs(savedJobs.filter(savedJob => savedJob.id !== job.id.toString()));
    } else {
      // Add to saved jobs
      const savedJob: SavedJobData = {
        id: job.id.toString(),
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        vacancies: '5', // Default value
        posted: job.posted,
        savedDate: new Date()
      };
      setSavedJobs([...savedJobs, savedJob]);
    }
  };

  const handleRemoveSavedJob = (id: string) => {
    setSavedJobs(savedJobs.filter(job => job.id !== id));
  };

  const handleApplySavedJob = (job: SavedJobData) => {
    setSelectedJob({
      title: job.title,
      company: job.company,
      location: job.location
    });
    setCurrentPage('apply');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'jobs':
        return <JobPortal onApply={handleApplyToJob} onSaveJob={handleSaveJob} savedJobIds={savedJobs.map(job => parseInt(job.id))} onNavigateToProfile={() => setCurrentPage('profile')} onNavigateToResume={() => setCurrentPage('resume')} />;
      case 'jobsforyou':
        return <JobsForYou onApply={handleApplyToJob} onSaveJob={handleSaveJob} savedJobIds={savedJobs.map(job => parseInt(job.id))} onNavigateToResume={() => setCurrentPage('resume')} />;
      case 'resume':
        return <ResumeBuilder onResumeSubmit={() => setHasResume(true)} />;
      case 'dashboard':
        // Show preview if user hasn't completed resume, otherwise show full dashboard
        return hasResume ? (
          <ApplicantDashboard 
            isLoggedIn={isLoggedIn} 
            onBackToHome={() => setCurrentPage('jobs')} 
            onNavigateToResumeBuilder={() => setCurrentPage('resume')}
            hasResume={hasResume}
          />
        ) : (
          <ResumeAnalysisPreview
            onNavigateToResumeBuilder={() => setCurrentPage('resume')}
            onBackToHome={() => setCurrentPage('jobs')}
          />
        ); 
      case 'about':
        return <AboutUs />;
      case 'applications':
        return <ApplicationProgress />;
      case 'profile':
        return <ProfileSettings />;
      case 'apply':
        return <JobApplication jobData={selectedJob} />;
      case 'savedjobs':
        return <SavedJobs savedJobs={savedJobs} onRemoveJob={handleRemoveSavedJob} onApply={handleApplySavedJob} />;
      default:
        return <JobPortal />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn ? (
        <LoginPage 
          onLogin={() => {
            setIsLoggedIn(true);
            setCurrentPage('dashboard'); // LANDING PAGE
          }} 
        />
      ) : (
        <>
          <Header
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            isLoggedIn={isLoggedIn}
            onAuthClick={() => setIsLoggedIn(!isLoggedIn)}
          />
          {renderPage()}
          {currentPage === 'jobs' && <ChatBot />}
          <Footer onNavigate={setCurrentPage} />
        </>
      )}
    </div>
  );
}
