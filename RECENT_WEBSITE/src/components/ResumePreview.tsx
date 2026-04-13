import { ResumeData } from './ResumeBuilder';
import { AlignLeft, Type } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
}

export function ResumePreview({ data }: ResumePreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Arial</span>
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Small</span>
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="w-px h-5 bg-gray-300" />
        <div className="flex items-center gap-2">
          <AlignLeft className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Left</span>
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Resume Content */}
      <div className="p-8 bg-white min-h-[600px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 mb-2 uppercase tracking-wide">
            {data.name || 'YOUR NAME'}
          </h1>
          <div className="flex flex-wrap gap-3 text-gray-600">
            {data.phone && <span>{data.phone}</span>}
            {data.phone && data.email && <span>|</span>}
            {data.email && <span>{data.email}</span>}
            {(data.phone || data.email) && data.linkedin && <span>|</span>}
            {data.linkedin && <span>{data.linkedin}</span>}
          </div>
        </div>

        {/* Work Experience Section */}
        <div className="mb-6">
          <div className="border-b-2 border-gray-900 pb-1 mb-3">
            <h2 className="text-gray-900 uppercase">Work Experiences</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-gray-900">Editor</h3>
                  <p className="text-gray-600">Singapore</p>
                </div>
                <span className="text-gray-600">Jan 2020 - Present</span>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                <li>Worked on multiple financial services-related engagements across Singapore, Thailand and Malaysia</li>
                <li>Participated in the firm's Innovation Team, where APPs to encourage an innovative culture within the firm</li>
                <li>Co-lead for systems executive course manager position within -2 years of joining the firm</li>
                <li>Designed a centralized technology sourcing and management center, including the design of roles and responsibilities, management and cross-market teams</li>
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-gray-900">Successfully Exchange Capital Asia</h3>
                  <p className="text-gray-600">Singapore</p>
                </div>
                <span className="text-gray-600">Jan 2020 - Dec 2020</span>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                <li>Responsible for financial structuring and modelling, conducting feasibility studies and developing client proposals</li>
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-gray-900">Editor</h3>
                  <p className="text-gray-600">Singapore</p>
                </div>
                <span className="text-gray-600">Jan 2020 - Dec 2020</span>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                <li>Worked on multiple financial services-related engagements across Singapore, Thailand and Malaysia</li>
                <li>Participated in the firm's Innovation Team, where APPs to encourage an innovative culture within the firm</li>
                <li>Designed a centralized technology sourcing and management center, including the design of roles and responsibilities, management and cross-market teams</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div>
          <div className="border-b-2 border-gray-900 pb-1 mb-3">
            <h2 className="text-gray-900 uppercase">Education Level</h2>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-gray-900">Singapore Management University</h3>
                  <p className="text-gray-600">Singapore</p>
                </div>
                <span className="text-gray-600">Aug 2020 - Apr 2020</span>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                <li>CGPA:3.7 Award for Graduating Class of 2017, Dean's Lister, High Distinction, Inaugural Medalist 2017, GCE-GCSE CPA Young Leaders Award 2016, WBCSD-SBA Excellence Scholarship 2015, Promental Scholarship Award 2016, AESEC Social Enterprise Scholarship 2015</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-right text-gray-500">
          © 2025 Landbase. All rights reserved.
        </div>
      </div>
    </div>
  );
}
