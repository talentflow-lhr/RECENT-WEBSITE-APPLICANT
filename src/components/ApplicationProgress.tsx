import { useState } from 'react';
import { Building2, Calendar, MapPin, DollarSign, CheckCircle, Clock, XCircle, AlertCircle, FileText, Mail, Phone, ThumbsUp, ThumbsDown, X } from 'lucide-react';

export function ApplicationProgress() {
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [applications, setApplications] = useState([
    {
      id: 1,
      company: 'Tech Solutions Inc.',
      position: 'Senior Full Stack Developer',
      appliedDate: 'November 15, 2025',
      status: 'Offer Received',
      statusType: 'offer',
      location: 'Remote',
      salary: '$80,000 - $100,000',
      offerReceived: true,
      offerDecision: null as 'accepted' | 'rejected' | null,
      rejectionReason: null as string | null,
      timeline: [
        { stage: 'Application Submitted', date: 'Nov 15, 2025', completed: true },
        { stage: 'Resume Reviewed', date: 'Nov 17, 2025', completed: true },
        { stage: 'Phone Interview', date: 'Nov 20, 2025', completed: true },
        { stage: 'Technical Interview', date: 'Nov 25, 2025', completed: true },
        { stage: 'Final Interview', date: 'Nov 28, 2025', completed: true },
        { stage: 'Offer Received', date: 'Dec 1, 2025', completed: true },
      ],
      contactPerson: 'Naomi Cuerdo',
      contactPhone: '09345234576',
    },
    {
      id: 2,
      company: 'Digital Marketing Pro',
      position: 'Marketing Manager',
      appliedDate: 'November 10, 2025',
      status: 'Under Review',
      statusType: 'review',
      location: 'New York, NY',
      salary: '$70,000 - $90,000',
      offerReceived: false,
      offerDecision: null as 'accepted' | 'rejected' | null,
      rejectionReason: null as string | null,
      timeline: [
        { stage: 'Application Submitted', date: 'Nov 10, 2025', completed: true },
        { stage: 'Resume Reviewed', date: 'Nov 12, 2025', completed: true },
        { stage: 'Initial Screening', date: 'In Progress', completed: false, upcoming: true },
        { stage: 'Interview Round', date: 'Pending', completed: false },
        { stage: 'Offer Decision', date: 'Pending', completed: false },
      ],
      contactPerson: 'Naomi Cuerdo',
      contactPhone: '09345234576',
    },
    {
      id: 3,
      company: 'ABC Corporation',
      position: 'Software Engineer',
      appliedDate: 'November 5, 2025',
      status: 'Accepted',
      statusType: 'accepted',
      location: 'San Francisco, CA',
      salary: '$90,000 - $110,000',
      offerReceived: true,
      offerDecision: 'accepted' as 'accepted' | 'rejected' | null,
      rejectionReason: null as string | null,
      timeline: [
        { stage: 'Application Submitted', date: 'Nov 5, 2025', completed: true },
        { stage: 'Resume Reviewed', date: 'Nov 6, 2025', completed: true },
        { stage: 'Phone Interview', date: 'Nov 8, 2025', completed: true },
        { stage: 'Technical Interview', date: 'Nov 12, 2025', completed: true },
        { stage: 'Final Interview', date: 'Nov 18, 2025', completed: true },
        { stage: 'Offer Received', date: 'Nov 22, 2025', completed: true },
      ],
      contactPerson: 'Naomi Cuerdo',
      contactPhone: '09345234576',
    },
    {
      id: 4,
      company: 'Finance Corp',
      position: 'Financial Analyst',
      appliedDate: 'November 1, 2025',
      status: 'Rejected',
      statusType: 'rejected',
      location: 'Chicago, IL',
      salary: '$65,000 - $85,000',
      offerReceived: false,
      offerDecision: null as 'accepted' | 'rejected' | null,
      rejectionReason: null as string | null,
      timeline: [
        { stage: 'Application Submitted', date: 'Nov 1, 2025', completed: true },
        { stage: 'Resume Reviewed', date: 'Nov 3, 2025', completed: true },
        { stage: 'Application Not Selected', date: 'Nov 5, 2025', completed: true },
      ],
      contactPerson: 'Naomi Cuerdo',
      contactPhone: '09345234576',
    },
  ]);

  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case 'accepted':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'offer':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'interview':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'review':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'rejected':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (statusType: string) => {
    switch (statusType) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5" />;
      case 'offer':
        return <AlertCircle className="w-5 h-5" />;
      case 'interview':
        return <AlertCircle className="w-5 h-5" />;
      case 'review':
        return <Clock className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const handleViewApplication = () => {
    const app = applications.find((a) => a.id === selectedApplication);
    if (app) {
      alert(`Viewing application for ${app.position} at ${app.company}\n\nStatus: ${app.status}\nApplied: ${app.appliedDate}\nLocation: ${app.location}\nSalary: ${app.salary}\n\nContact: ${app.contactPerson}\nPhone: ${app.contactPhone}`);
    }
  };

  const handleWithdrawApplication = () => {
    const app = applications.find((a) => a.id === selectedApplication);
    if (app) {
      const confirmWithdraw = confirm(`Are you sure you want to withdraw your application for ${app.position} at ${app.company}?\n\nThis action cannot be undone.`);
      
      if (confirmWithdraw) {
        setApplications(applications.filter((a) => a.id !== selectedApplication));
        setSelectedApplication(null);
        alert('Application withdrawn successfully.');
      }
    }
  };

  const handleAcceptOffer = () => {
    const app = applications.find((a) => a.id === selectedApplication);
    if (app && app.offerReceived) {
      setApplications(applications.map((a) => a.id === selectedApplication ? { ...a, offerDecision: 'accepted' } : a));
      setSelectedApplication(null);
      alert('Offer accepted successfully.');
    }
  };

  const handleRejectOffer = () => {
    const app = applications.find((a) => a.id === selectedApplication);
    if (app && app.offerReceived) {
      setApplications(applications.map((a) => a.id === selectedApplication ? { ...a, offerDecision: 'rejected', rejectionReason } : a));
      setSelectedApplication(null);
      alert('Offer rejected successfully.');
      setShowRejectModal(false);
    }
  };

  const handleOpenRejectModal = () => {
    const app = applications.find((a) => a.id === selectedApplication);
    if (app && app.offerReceived) {
      setShowRejectModal(true);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track the progress of your job applications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-1 space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelectedApplication(app.id)}
              className={`bg-white rounded-xl shadow-sm border-2 p-4 cursor-pointer transition-all ${
                selectedApplication === app.id
                  ? 'border-[#ffca1a]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#ffca1a] to-[#17960b] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{app.position}</p>
                  <p className="text-gray-600 truncate">{app.company}</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(app.statusType)} w-fit`}>
                {getStatusIcon(app.statusType)}
                <span className="text-xs font-medium">{app.status}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Applied: {app.appliedDate}</p>
            </div>
          ))}
        </div>

        {/* Application Details */}
        <div className="lg:col-span-2">
          {selectedApplication ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {(() => {
                const app = applications.find((a) => a.id === selectedApplication)!;
                return (
                  <>
                    {/* Header */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-gray-900 mb-2">{app.position}</h2>
                          <p className="text-gray-600 mb-4">{app.company}</p>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(app.statusType)}`}>
                          {getStatusIcon(app.statusType)}
                          <span className="font-medium">{app.status}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{app.appliedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{app.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>{app.salary}</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-6">
                      <h3 className="text-gray-900 mb-4">Application Timeline</h3>
                      <div className="space-y-4">
                        {app.timeline.map((stage, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  stage.completed
                                    ? 'bg-[#17960b]'
                                    : stage.upcoming
                                    ? 'bg-[#ffca1a]'
                                    : 'bg-gray-200'
                                }`}
                              >
                                {stage.completed ? (
                                  <CheckCircle className="w-5 h-5 text-white" />
                                ) : stage.upcoming ? (
                                  <Clock className="w-5 h-5 text-gray-900" />
                                ) : (
                                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                                )}
                              </div>
                              {index < app.timeline.length - 1 && (
                                <div
                                  className={`w-0.5 h-12 ${
                                    stage.completed ? 'bg-[#17960b]' : 'bg-gray-200'
                                  }`}
                                />
                              )}
                            </div>
                            <div className="flex-1 pb-8">
                              <p className={`font-medium ${stage.completed || stage.upcoming ? 'text-gray-900' : 'text-gray-500'}`}>
                                {stage.stage}
                              </p>
                              <p className="text-gray-500">{stage.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="text-gray-900 mb-3">Contact Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{app.contactPerson}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{app.contactPhone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-col gap-3">
                      {/* Offer Accept/Reject Buttons */}
                      {app.offerReceived && app.offerDecision === null && (
                        <div className="flex gap-3">
                          <button 
                            className="flex-1 bg-[#17960b] hover:bg-[#147509] text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold" 
                            onClick={handleAcceptOffer}
                          >
                            <ThumbsUp className="w-5 h-5" />
                            <span>Accept Offer</span>
                          </button>
                          <button 
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold" 
                            onClick={handleOpenRejectModal}
                          >
                            <ThumbsDown className="w-5 h-5" />
                            <span>Reject Offer</span>
                          </button>
                        </div>
                      )}

                      {/* Offer Decision Display */}
                      {app.offerReceived && app.offerDecision && (
                        <div className={`p-4 rounded-lg border-2 ${
                          app.offerDecision === 'accepted' 
                            ? 'bg-green-50 border-green-500' 
                            : 'bg-red-50 border-red-500'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            {app.offerDecision === 'accepted' ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            <p className={`font-semibold ${
                              app.offerDecision === 'accepted' ? 'text-green-900' : 'text-red-900'
                            }`}>
                              {app.offerDecision === 'accepted' ? 'Offer Accepted' : 'Offer Rejected'}
                            </p>
                          </div>
                          {app.offerDecision === 'rejected' && app.rejectionReason && (
                            <div className="mt-2 pt-2 border-t border-red-200">
                              <p className="text-sm text-red-800 font-medium mb-1">Reason:</p>
                              <p className="text-sm text-red-700">{app.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Standard Action Buttons */}
                      <div className="flex gap-3">
                        <button 
                          className="flex-1 bg-[#ffca1a] hover:bg-[#e6b617] text-gray-900 px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold" 
                          onClick={handleViewApplication}
                        >
                          <FileText className="w-5 h-5" />
                          <span>View Application</span>
                        </button>
                        {app.statusType !== 'rejected' && app.statusType !== 'accepted' && !app.offerDecision && (
                          <button 
                            className="flex-1 bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg border-2 border-gray-200 transition-colors font-semibold" 
                            onClick={handleWithdrawApplication}
                          >
                            Withdraw Application
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 mb-2">Select an Application</p>
              <p className="text-gray-500">Choose an application from the list to view its details and progress</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Offer Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ThumbsDown className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-gray-900 text-xl font-semibold">Reject Offer</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this job offer. This will help the employer understand your decision.
            </p>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Reason for Rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="E.g., Found a better opportunity, Salary expectations not met, Location concerns..."
                required
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={handleRejectOffer}
                disabled={!rejectionReason.trim()}
              >
                <ThumbsDown className="w-5 h-5" />
                <span>Confirm Rejection</span>
              </button>
              <button 
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold" 
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}