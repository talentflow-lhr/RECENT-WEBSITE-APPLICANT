import { useState } from "react";
import svgPaths from "../imports/svg-65zdysylli";
import imgImageLandbase from "../../imports/Landbase-removebg-preview.png";
import { Download, Upload, CheckCircle2 } from "lucide-react";

interface JobData {
  title: string;
  company: string;
  location: string;
}

interface JobApplicationProps {
  jobData?: JobData;
}

export function JobApplication({
  jobData,
}: JobApplicationProps) {
  const [useExistingResume, setUseExistingResume] =
    useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Juan Dela Cruz",
    email: "jdc@example.com",
    phone: "09345234576",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(
    null,
  );

  const handleSubmit = () => {
    if (useExistingResume) {
      alert(
        "Application submitted using your saved resume to Naomi Cuerdo (09345234576)!",
      );
    } else {
      alert(
        "Application submitted with new resume to Naomi Cuerdo (09345234576)!",
      );
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-4 sm:pt-6 md:pt-8 px-4 sm:px-6 md:px-8 pb-8">
      <div className="max-w-[1126px] mx-auto">
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
                    {useExistingResume && (
                      <div className="mt-3 bg-white rounded-lg p-3 border border-[#e5e7eb]">
                        <p className="text-[13px] text-[#17960b] font-medium">
                          ✓ Resume saved on: February 8, 2026
                        </p>
                        <p className="text-[12px] text-[#6a7282] mt-1">
                          Naomi_Cuerdo_Resume.pdf
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
              className="w-full bg-[#17960b] hover:bg-[#148509] text-white px-8 py-3 rounded-lg text-[16px] font-medium transition-colors"
            >
              Submit Application
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

              {/* Application Status */}
              <div className="border-t border-[#e5e7eb] pt-6">
                <div className="bg-[#ffca1a]/10 rounded-lg p-4">
                  <p className="text-[14px] text-[#101828] font-medium mb-2">
                    Application Details
                  </p>
                  <ul className="text-[13px] text-[#4a5565] space-y-1">
                    <li>• Contact: Naomi Cuerdo</li>
                    <li>• Phone: 09345234576</li>
                    <li>• Response time: 2-3 business days</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
