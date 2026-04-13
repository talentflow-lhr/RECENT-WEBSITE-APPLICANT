import { TrendingUp, CheckCircle, Clock, XCircle, Building2, Star, ArrowUpRight, FileText, Award } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export function Dashboard({ setActiveTab }: DashboardProps) {
  const stats = [
    { label: 'Applications Submitted', value: '12', icon: TrendingUp, color: 'bg-blue-500' },
    { label: 'Accepted', value: '3', icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Under Review', value: '6', icon: Clock, color: 'bg-yellow-500' },
    { label: 'Rejected', value: '3', icon: XCircle, color: 'bg-red-500' },
  ];

  const recommendations = [
    {
      company: 'Tech Solutions Inc.',
      position: 'Senior Developer',
      match: 95,
      salary: '$80,000 - $100,000',
      location: 'Remote',
    },
    {
      company: 'Digital Marketing Pro',
      position: 'Marketing Manager',
      match: 88,
      salary: '$70,000 - $90,000',
      location: 'New York, NY',
    },
    {
      company: 'Finance Corp',
      position: 'Financial Analyst',
      match: 82,
      salary: '$65,000 - $85,000',
      location: 'Chicago, IL',
    },
  ];

  const recentApplications = [
    {
      company: 'ABC Corporation',
      position: 'Software Engineer',
      status: 'Under Review',
      date: '2 days ago',
      statusColor: 'text-yellow-600 bg-yellow-50',
    },
    {
      company: 'XYZ Industries',
      position: 'Product Manager',
      status: 'Accepted',
      date: '1 week ago',
      statusColor: 'text-green-600 bg-green-50',
    },
    {
      company: 'Tech Startup',
      position: 'Full Stack Developer',
      status: 'Interview Scheduled',
      date: '3 days ago',
      statusColor: 'text-blue-600 bg-blue-50',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Welcome back, John!</h1>
        <p className="text-gray-600">Here's what's happening with your job applications today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-600 mb-1">{stat.label}</p>
              <p className="text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-6">Recent Applications</h2>
            <div className="space-y-4">
              {recentApplications.map((app, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#ffca1a] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#ffca1a] to-[#17960b] rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{app.position}</p>
                      <p className="text-gray-600">{app.company}</p>
                      <p className="text-xs text-gray-500">{app.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.statusColor}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-6">Recommended for You</h2>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-[#17960b] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">{rec.position}</p>
                      <p className="text-gray-600 mb-2">{rec.company}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-[#17960b] text-white px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs">{rec.match}%</span>
                    </div>
                  </div>
                  <div className="space-y-1 mb-3">
                    <p className="text-gray-600">{rec.salary}</p>
                    <p className="text-gray-500">{rec.location}</p>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 bg-[#ffca1a] hover:bg-[#e6b617] text-gray-900 px-4 py-2 rounded-lg transition-colors">
                    <span>Apply Now</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resume Score Card */}
      <div className="mt-6 bg-gradient-to-r from-[#17960b] to-[#ffca1a] rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-2">Your Resume Score</h3>
            <p className="text-white/90 mb-4">Your resume is performing well! Keep it updated to match more jobs.</p>
            <button className="bg-white text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Update Resume
            </button>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 rounded-full border-8 border-white/30 flex items-center justify-center">
              <div>
                <p className="text-white">85</p>
                <p className="text-sm text-white/90">/ 100</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}