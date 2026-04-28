import { useState } from "react";
import svgPaths from "../imports/svg-65zdysylli";
import imgImageLandbase from "../imports/Landbase-removebg-preview.png";
import { Download, Upload, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAuth } from "./AuthPass";
import { supabase } from "./supabaseClient";
import { useEffect } from "react";

interface JobData {
  title: string;
  company: string;
  location: string;
  position_id?: number;
}

interface JobApplicationProps {
  jobData?: JobData;
  onBack?: () => void;
}

export function JobApplication({
  jobData,
  onBack,
}: JobApplicationProps) {
  const [useExistingResume, setUseExistingResume] =
    useState(false);
  //onst [personalInfo, setPersonalInfo] = useState({
  //  fullName: "Juan Dela Cruz",
  //  email: "jdc@example.com",
  //  phone: "09345234576",
  // });
  //const [resumeFile, setResumeFile] = useState<File | null>(
  //  null,
  //);

  const { account } = useAuth();

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [resumeData, setResumeData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    if (!account?.applicant_id) return;
  
    const loadApplicantData = async () => {
      // Load applicant profile
      const { data: applicant } = await supabase
        .from('t_applicant')
        .select('app_first_name, app_middle_name, app_last_name, app_email, app_present_tele_mobile')
        .eq('applicant_id', account.applicant_id)
        .maybeSingle();
  
      if (applicant) {
        const fullName = [
          applicant.app_first_name,
          applicant.app_middle_name,
          applicant.app_last_name,
        ].filter(Boolean).join(' ');
  
        setPersonalInfo({
          fullName,
          email: applicant.app_email || '',
          phone: applicant.app_present_tele_mobile || '',
        });
      }
  
      // Load latest resume
      const { data: resume } = await supabase
        .from('t_resume')
        .select('resume_id, res_last_updated, res_pdf_link')
        .eq('applicant_id', account.applicant_id)
        .order('res_last_updated', { ascending: false })
        .limit(1)
        .maybeSingle();
  
      if (resume) setResumeData(resume);
    };
  
    loadApplicantData();
  }, [account?.applicant_id]);

  const getDateId = async (): Promise<number | null> => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('t_date')
      .select('date_id')
      .eq('full_date', today)
      .maybeSingle();
    return data?.date_id ?? null;
  };
  
  const handleSubmit = async () => {
    console.log('Debug apply:', {
      applicant_id: account?.applicant_id,
      position_id: jobData?.position_id,
      jobData,
      account,
    });
    
    if (!account?.applicant_id || !jobData?.position_id) {
      alert('Missing application data. Please try again.');
      return;
    }
    if (!useExistingResume || !resumeData?.resume_id) {
      alert('Please check "Use My Saved Resume" to submit your application.');
      return;
    }
  
    setSubmitting(true);
      try {
        const dateId = await getDateId();
      
        const { error } = await supabase
          .from('t_applications')
          .insert({
            position_id: jobData.position_id,
            applicant_id: account.applicant_id,
            resume_id: resumeData.resume_id,
            application_current_status: 'Pending',
            applied_date_id: dateId,
          });
      
        if (error) throw error;
        setSubmitted(true);
    } catch (err: any) {
      alert(`Failed to submit application: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  //const handleFileUpload = (
  //  e: React.ChangeEvent<HTMLInputElement>,
  //) => {
  //  if (e.target.files && e.target.files[0]) {
  //    setResumeFile(e.target.files[0]);
  //  }
  //};

  if (submitted) return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow p-8 max-w-md w-full text-center">
        <CheckCircle2 className="w-16 h-16 text-[#17960b] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#101828] mb-2">Application Submitted!</h2>
        <p className="text-gray-600 mb-6">Your application for <strong>{jobData?.title}</strong> has been received.</p>
        <button onClick={onBack} className="bg-[#17960b] text-white px-6 py-2 rounded-lg hover:bg-[#148509] transition-colors">
          Back to Jobs
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-4 sm:pt-6 md:pt-8 px-4 sm:px-6 md:px-8 pb-8">
      <div className="max-w-[1126px] mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#17960b] hover:text-[#148509] font-semibold mb-6 transition-colors group"
          >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Jobs
        </button>
        
        {/* Header */}
        <div className="bg-white rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] mb-6 md:mb-8 p-4 sm:p-6 md:p-8">
          <h1 className="text-[20px] sm:text-[24px] md:text-[28px] leading-[30px] sm:leading-[36px] md:leading-[42px] text-[#101828] mb-2">
            Apply for Position
          </h1>
          {jobData && (
            <div className="mt-3 md:mt-4">
              <p className="text-[16px] sm:text-[18px] md:text-[20px] leading-[24px] sm:leading-[27px] md:leading-[30px] text-[#17960b] font-semibold">
                {jobData.title}
              </p>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[21px] sm:leading-[22px] md:leading-[24px] text-[#4a5565]">
                {jobData.company}
              </p>
              <p className="text-[13px] sm:text-[14px] leading-[19px] sm:leading-[21px] text-[#6a7282]">
                {jobData.location}
              </p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Panel - Application Form */}
          <div className="bg-white rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] p-4 sm:p-6 md:p-8">
            <h2 className="text-[18px] sm:text-[19px] md:text-[20px] leading-[27px] sm:leading-[28px] md:leading-[30px] text-[#101828] mb-4 sm:mb-5 md:mb-6">
              Application Details
            </h2>

            {/* Personal Information */}
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-[14px] text-[#364153] mb-[6px]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={personalInfo.fullName}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      fullName: e.target.value,
                    })
                  }
                  className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] text-[#717182] border-0 outline-none"
                  placeholder="Naomi Cuerdo"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#364153] mb-[6px]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      email: e.target.value,
                    })
                  }
                  className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] text-[#717182] border-0 outline-none"
                  placeholder="naomi@example.com"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#364153] mb-[6px]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      phone: e.target.value,
                    })
                  }
                  className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] text-[#717182] border-0 outline-none"
                  placeholder="09345234576"
                />
              </div>
            </div>

            {/* Resume Selection */}
            <div className="mb-8">
              <label className="block text-[14px] text-[#364153] mb-4">
                Resume
              </label>

              {/* Option to use existing resume */}
              <div className="bg-[#17960b]/5 border-2 border-[#17960b] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={useExistingResume}
                    onChange={(e) =>
                      setUseExistingResume(e.target.checked)
                    }
                    className="w-5 h-5 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-5 h-5 text-[#17960b]" />
                      <p className="text-[16px] font-semibold text-[#101828]">
                        Use My Saved Resume
                      </p>
                    </div>
                    <p className="text-[14px] text-[#4a5565]">
                      Submit your resume that you built in the
                      Resume Builder
                    </p>
                    {useExistingResume && resumeData && (
                      <div className="mt-3 bg-white rounded-lg p-3 border border-[#e5e7eb]">
                        <p className="text-[13px] text-[#17960b] font-medium">
                          ✓ Resume saved on: {new Date(resumeData.res_last_updated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-[12px] text-[#6a7282] mt-1">
                          {personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf
                        </p>
                      </div>
                    )}
                    {useExistingResume && !resumeData && (
                      <div className="mt-3 bg-red-50 rounded-lg p-3 border border-red-200">
                        <p className="text-[13px] text-red-500 font-medium">
                          No saved resume found. Please build your resume first.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#17960b] hover:bg-[#148509] disabled:opacity-60 text-white px-8 py-3 rounded-lg text-[16px] font-medium transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-[#e5e7eb]">
              <div className="flex items-center gap-2">
                <p className="text-[16px] leading-[24px] text-[#4a5565]">
                  powered by
                </p>
                <img
                  src={imgImageLandbase}
                  alt="Landbase"
                  className="w-5 h-5"
                />
                <p className="text-[16px] leading-[24px] text-[#101828]">
                  Landbase
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Application Preview */}
          <div className="bg-white rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] p-4 sm:p-6 md:p-8">
            <h2 className="text-[18px] sm:text-[19px] md:text-[20px] leading-[27px] sm:leading-[28px] md:leading-[30px] text-[#101828] mb-4 sm:mb-5 md:mb-6">
              Application Summary
            </h2>

            <div className="space-y-6">
              {/* Personal Details */}
              <div>
                <p className="text-[14px] text-[#6a7282] mb-2">
                  Applicant Name
                </p>
                <p className="text-[16px] text-[#101828] font-medium">
                  {personalInfo.fullName || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-[14px] text-[#6a7282] mb-2">
                  Email
                </p>
                <p className="text-[16px] text-[#101828]">
                  {personalInfo.email || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-[14px] text-[#6a7282] mb-2">
                  Phone
                </p>
                <p className="text-[16px] text-[#101828]">
                  {personalInfo.phone || "Not provided"}
                </p>
              </div>

              <div className="border-t border-[#e5e7eb] pt-6">
                <p className="text-[14px] text-[#6a7282] mb-2">
                  Resume
                </p>
                {useExistingResume ? (
                  <div className="bg-[#17960b]/5 rounded-lg p-3">
                    <p className="text-[14px] text-[#17960b] font-medium">
                      ✓ Using saved resume from Resume Builder
                    </p>
                  </div>
                ) : (
                  <p className="text-[14px] text-[#6a7282]">
                    Please check "Use My Saved Resume" to submit
                    your application
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
