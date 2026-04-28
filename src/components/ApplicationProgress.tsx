import { useState } from 'react';
import { Building2, Calendar, MapPin, DollarSign, CheckCircle, Clock, XCircle, AlertCircle, FileText, Mail, Phone, ThumbsUp, ThumbsDown, X, Video } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthPass';
import { supabase } from './supabaseClient';

export function ApplicationProgress() {
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showOfferDetails, setShowOfferDetails] = useState(false);
  const [showViewApplicationModal, setShowViewApplicationModal] = useState(false);
  /*const [applications, setApplications] = useState([
    {
      id: 1,
      company: 'Tech Solutions Inc.',
      position: 'Senior Full Stack Developer',
      appliedDate: 'November 15, 2025',
      status: 'Offer Received',
      statusType: 'offer',
      location: 'Remote',
      country: 'United States',
      salary: '$80,000 - $100,000',
      offerReceived: true,
      offerDecision: null as 'accepted' | 'rejected' | null,
      rejectionReason: null as string | null,
      timeline: [
        { stage: 'Application Submitted', date: 'Nov 15, 2025', completed: true },
        { stage: 'Resume Reviewed', date: 'Nov 17, 2025', completed: true },
        { stage: 'Interview Scheduled', date: 'Nov 28, 2025', completed: true },
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
      status: 'Interview Scheduled',
      statusType: 'interview',
      location: 'New York, NY',
      country: 'United States',
      salary: '$70,000 - $90,000',
      offerReceived: false,
      offerDecision: null as 'accepted' | 'rejected' | null,
      rejectionReason: null as string | null,
      timeline: [
        { stage: 'Resume Reviewed', date: 'Nov 12, 2025', completed: true },
        { stage: 'Interview Scheduled', date: 'May 5, 2026', time: '2:00 PM EST', meetingLink: 'https://zoom.us/j/123456789', completed: false, upcoming: true },
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
      country: 'United States',
      salary: '$90,000 - $110,000',
      offerReceived: true,
      offerDecision: 'accepted' as 'accepted' | 'rejected' | null,
      rejectionReason: null as string | null,
      timeline: [
        { stage: 'Application Submitted', date: 'Nov 5, 2025', completed: true },
        { stage: 'Resume Reviewed', date: 'Nov 6, 2025', completed: true },
        { stage: 'Interview Scheduled', date: 'Nov 18, 2025', completed: true }
      ],
      contactPerson: 'Naomi Cuerdo',
      contactPhone: '09345234576',
    },
    {
      id: 4,
      company: 'Finance Corp',
      position: 'Financial Analyst',
      appliedDate: 'November 1, 2025',
      status: 'Application Not Selected',
      statusType: 'rejected',
      location: 'Chicago, IL',
      country: 'United States',
      salary: '$65,000 - $85,000',
      offerReceived: false,
      offerDecision: null as 'accepted' | 'rejected' | null,
      rejectionReason: null as string | null,
      timeline: [
        { stage: 'Application Submitted', date: 'Nov 1, 2025', completed: true },
        { stage: 'Resume Reviewed', date: 'Nov 3, 2025', completed: true },
        { stage: 'Application Not Selected', date: 'Nov 5, 2025', completed: true, rejected: true },
      ],
      contactPerson: 'Naomi Cuerdo',
      contactPhone: '09345234576',
    },
  ]);*/

  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const { account } = useAuth();
  
  const fetchApplications = async () => {
    if (!account?.applicant_id) return;
    setLoadingApplications(true);
    try {
      const { data, error } = await supabase
        .from('t_applications')
        .select(`
          application_id,
          application_current_status,
          application_interview_schedule,
          application_meeting_link,
          application_rejected_reason,
          application_decline_reason,
          is_link_sent,
          t_job_positions (
            job_title,
            job_salary_range,
            job_contract_length,
            t_job_orders (
              jo_country,
              t_companies (
                company_name,
                company_contact,
                company_email
              )
            )
          ),
          t_date (
            full_date
          )
        `)
        .eq('applicant_id', account.applicant_id)
        .order('application_id', { ascending: false });
  
      if (error) throw error;
  
      const mapped = (data || []).map((app: any) => {
        const position = app.t_job_positions;
        const order = position?.t_job_orders;
        const company = order?.t_companies;
        const status = app.application_current_status ?? 'Pending';
  
        const statusTypeMap: Record<string, string> = {
          'Pending':     'review',
          'Reviewing':   'review',
          'Interview':   'interview',
          'Offer':       'offer',
          'Accepted':    'accepted',
          'Rejected':    'rejected',
          'Withdrawn':   'rejected',
          'Declined':    'rejected',
        };
  
        const statusType = statusTypeMap[status] ?? 'review';
  
        // Build timeline based on status
        const timeline = buildTimeline(status, app);
  
        return {
          id: app.application_id,
          company: company?.company_name ?? 'Unknown Company',
          position: position?.job_title ?? 'Unknown Position',
          appliedDate: app.t_date?.full_date
            ? new Date(app.t_date.full_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : 'Unknown Date',
          status,
          statusType,
          location: order?.jo_country ?? 'Location TBD',
          country: order?.jo_country ?? '',
          salary: position?.job_salary_range ?? 'Competitive',
          offerReceived: status === 'Offer',
          offerDecision: status === 'Accepted' ? 'accepted' : status === 'Declined' ? 'rejected' : null,
          rejectionReason: app.application_decline_reason ?? null,
          timeline,
          contactPerson: company?.company_contact ?? '',
          contactPhone: '',
          contactEmail: company?.company_email ?? '',
          meetingLink: app.application_meeting_link ?? null,
          interviewSchedule: app.application_interview_schedule ?? null,
          rejectedReason: app.application_rejected_reason ?? null,
        };
      });
  
      setApplications(mapped);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoadingApplications(false);
    }
  };
  
  const buildTimeline = (status: string, app: any) => {
    const stages = [
      { stage: 'Application Submitted', key: 'submitted' },
      { stage: 'Resume Reviewed',       key: 'reviewing' },
      { stage: 'Interview Scheduled',   key: 'interview' },
      { stage: 'Offer Received',        key: 'offer' },
    ];
  
    const reachedIndex: Record<string, number> = {
      'Pending':   0,
      'Reviewing': 1,
      'Interview': 2,
      'Offer':     3,
      'Accepted':  3,
      'Rejected':  1,
      'Declined':  3,
    };
  
    const reached = reachedIndex[status] ?? 0;
    const isRejected = status === 'Rejected';
  
    return stages.map((s, i) => {
      const completed = i <= reached;
      const isInterview = s.key === 'interview' && status === 'Interview';
  
      return {
        stage: s.stage,
        date: i === 0 && app.t_date?.full_date
          ? new Date(app.t_date.full_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : completed ? '—' : 'Pending',
        completed: isRejected && i === 1 ? true : completed,
        rejected: isRejected && i === 1,
        upcoming: isInterview,
        time: isInterview && app.application_interview_schedule
          ? new Date(app.application_interview_schedule).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : undefined,
        meetingLink: isInterview ? app.application_meeting_link : undefined,
      };
    });
  };
  
  useEffect(() => {
    fetchApplications();
  }, [account?.applicant_id]);
  
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
        setShowViewApplicationModal(true);
  };

  const handleWithdrawApplication = async () => {
    const app = applications.find((a) => a.id === selectedApplication);
    if (!app) return;
    const confirmWithdraw = confirm(`Are you sure you want to withdraw your application for ${app.position} at ${app.company}?\n\nThis action cannot be undone.`);
    if (confirmWithdraw) {
      const { error } = await supabase
        .from('t_applications')
        .delete()
        .eq('application_id', selectedApplication);
      if (error) {
        alert('Failed to withdraw application. Please try again.');
        return;
      }
      setApplications(applications.filter((a) => a.id !== selectedApplication));
      setSelectedApplication(null);
      alert('Application withdrawn successfully.');
    }
  };

  const handleAcceptOffer = async () => {
    const app = applications.find((a) => a.id === selectedApplication);
    if (!app || !app.offerReceived) return;
    const { error } = await supabase
      .from('t_applications')
      .update({ application_current_status: 'Accepted' })
      .eq('application_id', selectedApplication);
    if (error) { alert('Failed to accept offer.'); return; }
    setApplications(applications.map((a) =>
      a.id === selectedApplication ? { ...a, offerDecision: 'accepted', status: 'Accepted' } : a
    ));
    setSelectedApplication(null);
    alert('Offer accepted successfully.');
  };

  const handleRejectOffer = async () => {
    const app = applications.find((a) => a.id === selectedApplication);
    if (!app || !app.offerReceived) return;
    const { error } = await supabase
      .from('t_applications')
      .update({
        application_current_status: 'Declined',
        application_decline_reason: rejectionReason,
      })
      .eq('application_id', selectedApplication);
    if (error) { alert('Failed to reject offer.'); return; }
    setApplications(applications.map((a) =>
      a.id === selectedApplication ? { ...a, offerDecision: 'rejected', rejectionReason, status: 'Declined' } : a
    ));
    setSelectedApplication(null);
    setShowRejectModal(false);
    alert('Offer declined successfully.');
  };

  const handleOpenRejectModal = () => {
    const app = applications.find((a) => a.id === selectedApplication);
    if (app && app.offerReceived) {
      setShowRejectModal(true);
    }
  };

  if (loadingApplications) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <svg className="w-10 h-10 animate-spin text-[#17960b] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-gray-600 font-medium">Loading your applications...</p>
      </div>
    </div>
  );
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track the progress of your job applications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-1 space-y-4">
          {applications.length === 0 && !loadingApplications && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No applications yet</p>
              <p className="text-gray-400 text-sm mt-1">Start applying to jobs to track them here</p>
            </div>
          )}
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
                                  stage.rejected
                                  ? 'bg-red-600'
                                  : stage.completed
                                  ? 'bg-[#17960b]'
                                  : stage.upcoming
                                  ? 'bg-[#ffca1a]'
                                  : 'bg-gray-200'
                                }`}>
                                {stage.rejected ? (
                                  <X className="w-5 h-5 text-white" />
                                ) : stage.completed ? (
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
                              <p className={`font-medium ${
                                stage.rejected
                                  ? 'text-red-600'
                                  : stage.completed || stage.upcoming
                                  ? 'text-gray-900'
                                  : 'text-gray-500'
                              }`}>
                                {stage.stage}
                              </p>
                              {stage.upcoming && stage.stage === 'Interview Scheduled' && (
                            <div className="mt-2 p-3 bg-[#ffca1a]/10 border border-[#ffca1a] rounded-lg">
                              <p className="text-sm font-medium text-gray-900 mb-2">
                                You have an upcoming interview on {stage.date}
                              </p>
                            <div className="space-y-1 text-sm text-gray-700">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#ffca1a]" />
                                <span><strong>Date:</strong> {stage.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#ffca1a]" />
                                <span><strong>Time:</strong> {stage.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Video className="w-4 h-4 text-[#ffca1a]" />
                                <a
                                  href={stage.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#17960b] hover:underline font-medium"
                                  >
                                  Join Meeting
                                </a>
                              </div>
                            </div>
                            </div>
                          )}
                              {!stage.upcoming && (
                                <p className={`${stage.rejected ? 'text-red-600' : 'text-gray-500'}`}>
                                  {stage.date}
                                </p>
                              )}
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
                     {/* View Offer Details */}
                      {app.offerReceived && app.offerDecision === null && (
                        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-2">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">Offer Details</h4>
                            <button
                              onClick={() => setShowOfferDetails(!showOfferDetails)}
                              className="text-[#17960b] hover:text-[#147509] font-medium text-sm transition-colors"
                            >
                              {showOfferDetails ? 'Hide Details' : 'View Offer'}
                            </button>
                          </div>

                          {showOfferDetails && (
                            <div className="space-y-2 pt-3 border-t border-purple-200">
                              <div className="flex items-start gap-3">
                                <Building2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-700">Company:</p>
                                  <p className="text-gray-900">{app.company}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-700">Country:</p>
                                  <p className="text-gray-900">{app.country}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-700">Position:</p>
                                  <p className="text-gray-900">{app.position}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <DollarSign className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-700">Salary:</p>
                                  <p className="text-gray-900">{app.salary}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
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
                        {app.statusType !== 'rejected' && app.statusType !== 'accepted' && !app.offerReceived && (
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
      {/* View Application Modal */}
      {showViewApplicationModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            {(() => {
              const app = applications.find((a) => a.id === selectedApplication)!;
              return (
                <>
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Figma</h2>
                    <button
                      onClick={() => setShowViewApplicationModal(false)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6">
                    <p className="text-gray-900 mb-6">
                      Viewing application for <span className="font-semibold">{app.position}</span> at <span className="font-semibold">{app.company}</span>.
                    </p>

                    <div className="space-y-3 mb-6">
                      <p className="text-gray-900">
                        <span className="font-semibold">Status:</span> <span className="text-blue-600">{app.status}</span>
                      </p>
                      <p className="text-gray-900">
                        <span className="font-semibold">Applied:</span> {app.appliedDate}
                      </p>
                      <p className="text-gray-900">
                        <span className="font-semibold">Location:</span> {app.location}
                      </p>
                      <p className="text-gray-900">
                        <span className="font-semibold">Salary:</span> <span className="text-blue-600">{app.salary}</span>
                      </p>
                    </div>

                    <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
                      <p className="text-gray-900">
                        <span className="font-semibold">Contact:</span> <span className="text-blue-600">{app.contactPerson}</span>
                      </p>
                      <p className="text-gray-900">
                        <span className="font-semibold">Phone:</span> <span className="text-blue-600">{app.contactPhone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                      onClick={() => setShowViewApplicationModal(false)}
                      className="px-8 py-2 bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 rounded-lg transition-colors font-semibold"
                    >
                      OK
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
