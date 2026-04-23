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
  Bookmark
} from 'lucide-react';

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
}

interface JobsForYouProps {
  onApply?: (job: { title: string; company: string; location: string }) => void;
  onSaveJob?: (job: JobData) => void;
  savedJobIds?: number[];
  onNavigateToResume?: () => void;
}

export function JobsForYou({ onApply, onSaveJob, savedJobIds, onNavigateToResume }: JobsForYouProps) {
  const recommendedJobs: JobData[] = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      location: 'Singapore',
      country: '🇸🇬',
      salary: 'PHP 120,000 - 180,000',
      type: 'Full-time',
      posted: '1 day ago',
      matchScore: 95,
      tags: ['React', 'Node.js', 'TypeScript'],
      reason: 'Your technical skills match this position perfectly'
    },
    {
      id: 2,
      title: 'Field Operator',
      company: 'QCON',
      location: 'Doga, QATAR',
      country: '',
      salary: 'PHP 85,000 - 110,000',
      type: 'Full-time',
      posted: '2 days ago',
      matchScore: 92,
      tags: ['Operator', 'Management'],
      reason: 'You are great at field operating and leadership'
    },
    {
      id: 3,
      title: 'Hotel Operations Manager',
      company: 'Marriott International',
      location: 'Doha, Qatar',
      country: '🇶🇦',
      salary: 'PHP 95,000 - 130,000',
      type: 'Full-time',
      posted: '3 days ago',
      matchScore: 88,
      tags: ['Hospitality', 'Management', 'Operations'],
      reason: 'Your management experience is a great fit'
    },
    {
      id: 4,
      title: 'Mechanical Engineer',
      company: 'Saudi Aramco',
      location: 'Riyadh, Saudi Arabia',
      country: '🇸🇦',
      salary: 'PHP 100,000 - 140,000',
      type: 'Full-time',
      posted: '4 days ago',
      matchScore: 85,
      tags: ['Engineering', 'Mechanical', 'Oil & Gas'],
      reason: 'Your engineering qualifications meet their standards'
    }
  ];

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-[#17960b]';
    if (score >= 80) return 'text-[#ffca1a]';
    return 'text-blue-600';
  };

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

        {/* Recommended Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendedJobs.map((job) => (
            <Card key={job.id} className="border-gray-200 hover:border-[#ffca1a] hover:shadow-lg transition-all">
              <CardContent className="p-6">
                {/* Job Header */}
                <div className="mb-4">
                  <h3 className="text-gray-900 mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-2">{job.company}</p>
                </div>

                {/* Job Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-2xl">{job.country}</span>
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
                    <Badge key={index} variant="outline" className="border-gray-300 text-gray-700">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-[#17960b] hover:bg-[#17960b]/90 text-white" onClick={() => onApply?.({ title: job.title, company: job.company, location: job.location })}>
                    Apply Now
                  </Button>
                  <Button variant="outline" className="border-gray-300" onClick={() => onSaveJob?.(job)}>
                    <Bookmark className="w-4 h-4 mr-1" />
                    {savedJobIds?.includes(job.id) ? 'Saved' : 'Save Job'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
    </div>
  );
}
