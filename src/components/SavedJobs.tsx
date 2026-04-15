import { Bookmark, MapPin, DollarSign, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import svgPaths from '../imports/svg-3nnvnkmfcx';

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  vacancies: string;
  posted: string;
  savedDate: Date;
}

interface SavedJobsProps {
  savedJobs: SavedJob[];
  onRemoveJob: (id: string) => void;
  onApply: (job: SavedJob) => void;
}

export function SavedJobs({ savedJobs, onRemoveJob, onApply }: SavedJobsProps) {
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
              <Button
                onClick={() => window.location.reload()}
                className="bg-[#17960b] hover:bg-[#17960b]/90 text-white"
              >
                Browse Jobs
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Saved Jobs Grid */}
        {savedJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {savedJobs.map((job) => (
              <Card
                key={job.id}
                className="border-[#17960b]/20 hover:shadow-lg transition-shadow relative group"
              >
                <CardContent className="p-4 md:p-6">
                  {/* Saved Badge */}
                  <div className="absolute top-3 right-3 bg-[#ffca1a] text-gray-900 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
                    <Bookmark className="w-3 h-3 fill-current" />
                    Saved
                  </div>

                  {/* Job Title */}
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 pr-16">
                    {job.title}
                  </h3>

                  {/* Company */}
                  <p className="text-sm md:text-base text-gray-600 mb-4">
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
                    <span className="text-sm md:text-base text-gray-700">
                      {job.salary}
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
                      {job.vacancies} Vacancies
                    </span>
                    <span className="text-gray-500">
                      {job.posted}
                    </span>
                  </div>

                  {/* Saved Date */}
                  <p className="text-xs text-gray-500 mb-4">
                    Saved on {job.savedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onApply(job)}
                      className="flex-1 bg-[#17960b] hover:bg-[#17960b]/90 text-white text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Apply Now
                    </Button>
                    <Button
                      onClick={() => onRemoveJob(job.id)}
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