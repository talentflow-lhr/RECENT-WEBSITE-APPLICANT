import { useState, useRef, useEffect } from 'react';
import svgPaths from '../imports/svg-65zdysylli';
import imgImageLandbase from '../imports/Landbase-removebg-preview.png';
import { Download, Plus, Trash2, Eye, EyeOff, Upload, X, FileText, Check, ChevronDown, Star, Briefcase, MapPin, ArrowRight, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthPass";

import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

import { createWorker } from 'tesseract.js';


// Export ResumeData type for use in other components
export interface ResumeData {
  // Basic Information
  firstName?: string;
  middleName?: string;
  lastName?: string;
  birthDay?: string;
  birthMonth?: string;
  birthYear?: string;
  username?: string;
  email?: string;
  phone?: string;
  
  // Physical Information
  maritalStatus?: string;
  height?: string;
  weight?: string;
  
  // Present Address
  country?: string;
  province?: string;
  city?: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyRelationship?: string;
  emergencyContactNumber?: string;
  
  // Provincial Address
  provincialCountry?: string;
  provincialProvince?: string;
  provincialCity?: string;
  provincialContactPerson?: string;
  provincialMobile?: string;
  
  // Passport Information
  passportNumber?: string;
  passportPlace?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  
  // Legacy fields (for backward compatibility)
  name?: string;
  linkedin?: string;
  portfolio?: string;
}

interface PersonalInfo {
  firstName: string;
  middleInitial: string;
  lastName: string;
  suffix: string;
  dateOfBirth: string;
  city: string;
  province: string;
  country: string;
  email: string;
  phone: string;
}

interface WorkExperience {
  position: string;
  company: string;
  city: string;
  stateProvince: string;
  country: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Certification {
  name: string;
  type: 'certificate' | 'training';
  organization: string;
  dateIssued: string;
  proofFile?: File | null;
  proofFileName?: string;
  proofUrl?: string | null;
}

interface Education {
  level: string;
  degree: string;
  school: string;
  city: string;
  stateProvince: string;
  country: string;
  startDate: string;
  endDate: string;
  currentlyStudying: boolean;
  grade: string;
  description: string;
  achievements: string;
}

interface Skill {
  name: string;
  level: string;
  category: 'technical' | 'soft';
}

interface ResumeBuilderProps {
  onResumeSubmit?: () => void;
}

const formatDateToMonthYear = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  if (!year || !month) return '';
  const monthIndex = parseInt(month, 10) - 1;
  const monthName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][monthIndex];
  return monthName ? `${monthName} ${year}` : '';
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const parsePdfToImages = async (pdfFile: File): Promise<HTMLImageElement> => {
  const arrayBuffer = await pdfFile.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const numPages = Math.min(6, pdf.numPages);
  const pages = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    pages.push({ page, viewport });
  }

  const totalHeight = pages.reduce((sum, p) => sum + p.viewport.height, 0);
  const maxWidth = Math.max(...pages.map(p => p.viewport.width));

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Failed to get canvas 2D context');
  canvas.width = maxWidth;
  canvas.height = totalHeight;

  let yOffset = 0;
  for (const { page, viewport } of pages) {
    context.save();
    context.translate(0, yOffset);
    await page.render({ canvasContext: context, viewport, canvas }).promise;
    context.restore();
    yOffset += viewport.height;
  }

  const img = new Image();
  const dataUrl = canvas.toDataURL('image/png');
  return loadImage(dataUrl);
};

const parseResumeTesseract = async (resumeImg: HTMLImageElement | HTMLCanvasElement): Promise<string> => {

  const worker = await createWorker('eng', 1, {
    logger: (m: { status: string; progress: number }) => {
      console.log(`${m.status}: ${Math.round(m.progress * 100)}%`);
    }
  });

  try {
    const { data } = await worker.recognize(resumeImg);
    return data.text;
  } finally {
    await worker.terminate();
  }
};


/**
 * Converts an image or canvas to a grayscale canvas.
 */
function convertToGrayscale(source: HTMLImageElement | HTMLCanvasElement): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to get 2D context');

    canvas.width = source.width;
    canvas.height = source.height;

    if (source instanceof HTMLImageElement) {
        ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    } else if (source instanceof HTMLCanvasElement) {
        ctx.drawImage(source, 0, 0);
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }

    ctx.putImageData(imageData, 0, 0);

    return canvas;
}

const parseResumeLLM = async (resumeImg: HTMLImageElement): Promise<Record<string, unknown>> => {

  const grayscaleCanvas = convertToGrayscale(resumeImg);

  const ocrText = await parseResumeTesseract(grayscaleCanvas)

  const { data, error } = await supabase.functions.invoke('Resume-LLM-Structure', {
    body: { ocrText },
  })

  if (error) throw new Error(error.message)

  return data.message as Record<string, unknown>
};

// ─── ResumePreview: renders the formatted CV template, scaled to fit ──────────
const ResumePreview = ({ personalInfo, workExperiences, certifications, education, skills, previewScale }: {
  personalInfo: PersonalInfo;
  workExperiences: WorkExperience[];
  certifications: Certification[];
  education: Education[];
  skills: Skill[];
  previewScale: number;
}) => {
  return (
    // Outer wrapper matches the *visual* size of the scaled page so it
    // can be centred normally with margin: auto.
    <div
      style={{
        width: `${794 * previewScale}px`,
        minHeight: `${1123 * previewScale}px`,
        margin: '0 auto',
      }}
    >
      <div
        className="bg-white shadow-2xl relative"
        style={{
          width: '794px',
          minHeight: '1123px',
          transform: `scale(${previewScale})`,
          transformOrigin: 'top left',
        }}
      >
      <div className="p-16">
        {/* Name */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#101828] uppercase tracking-wide mb-2">
            {personalInfo.firstName || 'FIRST'} {personalInfo.middleInitial || 'M'} {personalInfo.lastName || 'LAST'}{personalInfo.suffix ? ` ${personalInfo.suffix}` : ''}
          </h1>
          <div className="text-sm text-[#4a5565]">
            <p>
              {personalInfo.city || 'City'} {personalInfo.province || 'Province'}, {personalInfo.country || 'Country'} | {personalInfo.email || 'email@email.com'} | {personalInfo.phone || '+phone'}
            </p>
          </div>
        </div>

        {/* Work Experiences */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#101828] uppercase mb-3 pb-1.5 border-b-2 border-[#101828]">
            Work Experience
          </h2>
          {workExperiences.length > 0 && workExperiences[0].position ? (
            <div className="space-y-4">
              {workExperiences.map((exp, index) => (
                exp.position && (
                  <div key={index}>
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <p className="text-base font-semibold text-[#101828]">{exp.position}</p>
                        <p className="text-sm text-[#4a5565]">
                          {exp.company}, {exp.city}, {exp.stateProvince}
                        </p>
                      </div>
                      <p className="text-sm text-[#4a5565] whitespace-nowrap ml-4">
                        {formatDateToMonthYear(exp.startDate)} - {exp.current ? 'Present' : formatDateToMonthYear(exp.endDate)}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-[#4a5565] mt-1 leading-relaxed whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                )
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Highlight specific achievements and quantify results</p>
          )}
        </div>
        
        {/* Certifications */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#101828] uppercase mb-3 pb-1.5 border-b-2 border-[#101828]">
            Certifications
          </h2>
          {certifications.length > 0 && certifications[0].name ? (
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                cert.name && (
                  <div key={index}>
                    <p className="text-base font-semibold text-[#101828]">{cert.name}</p>
                    <p className="text-sm text-[#4a5565]">{cert.organization}</p>
                    {cert.dateIssued && (
                      <p className="text-sm text-[#4a5565]">
                        Date Issued: {formatDateToMonthYear(cert.dateIssued)}
                      </p>
                    )}
                  </div>
                )
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Add industry-specific certifications to stand out</p>
          )}
        </div>

        {/* Education */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#101828] uppercase mb-3 pb-1.5 border-b-2 border-[#101828]">
            Education
          </h2>
          {education.length > 0 && education[0].degree ? (
            <div className="space-y-4">
              {education.map((edu, index) => (
                edu.degree && (
                  <div key={index}>
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <p className="text-base font-semibold text-[#101828]">{edu.degree}</p>
                        <p className="text-sm text-[#4a5565]">
                          {edu.school}, {edu.city}, {edu.stateProvince}
                        </p>
                      </div>
                      <p className="text-sm text-[#4a5565] whitespace-nowrap ml-4">
                        {formatDateToMonthYear(edu.startDate)} - {formatDateToMonthYear(edu.endDate)}
                      </p>
                    </div>
                    {edu.achievements && (
                      <p className="text-sm text-[#4a5565] mt-1 leading-relaxed">{edu.achievements}</p>
                    )}
                  </div>
                )
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Well-documented educational background</p>
          )}
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#101828] uppercase mb-3 pb-1.5 border-b-2 border-[#101828]">
            Skills
          </h2>
          {skills.length > 0 && skills[0].name ? (
            <>
              {skills.filter(s => s.category === 'technical' && s.name).length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-[#101828] mb-2">Technical Skills:</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {skills.filter(s => s.category === 'technical').map((skill, index) => (
                      skill.name && (
                        <p key={index} className="text-sm text-[#4a5565]">
                          • {skill.name} - {skill.level}
                        </p>
                      )
                    ))}
                  </div>
                </div>
              )}
              {skills.filter(s => s.category === 'soft' && s.name).length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-[#101828] mb-2">Soft Skills:</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {skills.filter(s => s.category === 'soft').map((skill, index) => (
                      skill.name && (
                        <p key={index} className="text-sm text-[#4a5565]">
                          • {skill.name} - {skill.level}
                        </p>
                      )
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-400 italic">Technical Skills: Software, tools, programming languages</p>
              <p className="text-sm text-gray-400 italic">Soft Skills: Communication, leadership, languages</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

// ─── ResumeBuilder: multi-step form with live preview ─────────────────────────
export function ResumeBuilder({ onResumeSubmit }: ResumeBuilderProps = {}) {

  const { account } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    middleInitial: '',
    lastName: '',
    suffix: '',
    dateOfBirth: '',
    city: '',
    province: '',
    country: '',
    email: '',
    phone: '',
  });

  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([
    {
      position: '',
      company: '',
      city: '',
      stateProvince: '',
      country: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      level: '',
      degree: '',
      school: '',
      city: '',
      stateProvince: '',
      country: '',
      startDate: '',
      endDate: '',
      currentlyStudying: false,
      grade: '',
      description: '',
      achievements: ''
    }
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { name: '', level: 'Beginner', category: 'technical' }
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    { name: '', type: 'certificate', organization: '', dateIssued: '' }
  ]);

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.4);

  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.offsetWidth - 32;
        const scale = containerWidth / 794;
        setPreviewScale(Math.min(scale, 1));
      }
    };

    updateScale();
    const timeout = setTimeout(updateScale, 100);
    
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      clearTimeout(timeout); 
    };
  }, []);

  // Fetch existing resume data on mount
  useEffect(() => {
    if (!account) return;
  
    const fetchExistingResume = async () => {
      try {
        // 1. Fetch applicant personal info
        const { data: applicant } = await supabase
          .from('t_applicant')
          .select('*')
          .eq('applicant_id', account.applicant_id)
          .single();
  
        if (applicant) {
          const dobYear  = applicant.app_dob_year  ? String(applicant.app_dob_year).padStart(4, '0')  : '';
          const dobMonth = applicant.app_dob_month ? String(applicant.app_dob_month).padStart(2, '0') : '';
          const dobDay   = applicant.app_dob_day   ? String(applicant.app_dob_day).padStart(2, '0')   : '';
          const dateOfBirth = dobYear && dobMonth && dobDay
            ? `${dobYear}-${dobMonth}-${dobDay}`
            : '';
  
          setPersonalInfo({
            firstName:     applicant.app_first_name     ?? '',
            middleInitial: applicant.app_middle_name    ?? '',
            lastName:      applicant.app_last_name      ?? '',
            suffix:        applicant.app_suffix         ?? '',
            dateOfBirth,
            city:          applicant.app_present_address_city     ?? '',
            province:      applicant.app_present_address_province ?? '',
            country:       applicant.app_present_address_country  ?? '',
            email:         applicant.app_email          ?? '',
            phone:         applicant.app_present_tele_mobile      ?? '',
          });
        }
  
        // 2. Fetch latest resume
        const { data: resume } = await supabase
          .from('t_resume')
          .select('resume_id')
          .eq('applicant_id', account.applicant_id)
          .order('res_last_updated', { ascending: false })
          .order('resume_id', { ascending: false })
          .limit(1)
          .maybeSingle();
  
        if (!resume) return;
        const resumeId = resume.resume_id;
  
        // 3. Fetch work experiences
        const { data: experiences } = await supabase
          .from('t_work_experience')
          .select('*')
          .eq('resume_id', resumeId);
  
        if (experiences && experiences.length > 0) {
          setWorkExperiences(experiences.map((exp) => {
            const endDateRaw = exp.exp_end_date ?? '';
            const isCurrent  = !endDateRaw || 
              endDateRaw.toLowerCase() === 'present' || 
              endDateRaw.toLowerCase() === 'current';
            const description = Array.isArray(exp.exp_description)
              ? exp.exp_description.join('\n')
              : exp.exp_description ?? '';
  
            return {
              position:      exp.exp_position  ?? '',
              company:       exp.exp_company   ?? '',
              city:          exp.exp_city      ?? '',
              stateProvince: exp.exp_province  ?? '',
              country:       exp.exp_country   ?? '',
              startDate:     exp.exp_start_date ?? '',
              endDate:       isCurrent ? '' : endDateRaw,
              current:       isCurrent,
              description,
            };
          }));
        }
  
        // 4. Fetch education
        const { data: educationData } = await supabase
          .from('t_education')
          .select('*')
          .eq('resume_id', resumeId);
  
        if (educationData && educationData.length > 0) {
          setEducation(educationData.map((edu) => ({
            level:             edu.edu_level          ?? '',
            degree:            edu.edu_degree         ?? '',
            school:            edu.edu_school         ?? '',
            city:              edu.edu_school_city    ?? '',
            stateProvince:     edu.edu_school_province ?? '',
            country:           edu.edu_school_country ?? '',
            startDate:         edu.edu_start_date     ?? '',
            endDate:           edu.edu_end_date       ?? '',
            currentlyStudying: false,
            grade:             edu.edu_grade          ?? '',
            description:       edu.edu_description    ?? '',
            achievements:      edu.edu_grade_honors   ?? '',
          })));
        }
  
        // 5. Fetch skills
        const { data: skillsData } = await supabase
          .from('t_resume_skills')
          .select('*')
          .eq('resume_id', resumeId);
  
        if (skillsData && skillsData.length > 0) {
          setSkills(skillsData.map((skill) => ({
            name:     skill.rs_skill_name        ?? '',
            level:    skill.rs_proficiency_level ?? '',
            category: skill.rs_skill_category === 'technical' ? 'technical' : 'soft' as 'technical' | 'soft',
          })));
        }
  
        // 6. Fetch certifications
        const { data: certsData } = await supabase
          .from('t_certificate_training')
          .select('*')
          .eq('resume_id', resumeId);
  
        if (certsData && certsData.length > 0) {
          setCertifications(certsData.map((cert) => ({
            name:          cert.cert_certificate_title ?? '',
            type:          cert.cred_type === 'training' ? 'training' : 'certificate' as 'certificate' | 'training',
            organization:  cert.cert_issuer            ?? '',
            dateIssued:    cert.cert_date_obtained     ?? '',
            proofFile:     null,
            proofFileName: '',
            proofUrl:      cert.cert_url               ?? null,
          })));
        }
  
      } catch (err) {
        console.error('Failed to fetch existing resume:', err);
      }
    };
  
    fetchExistingResume();
  }, [account]);
  
  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
  
    const name = `${personalInfo.firstName || 'FIRST'} ${personalInfo.middleInitial || ''} ${personalInfo.lastName || 'LAST'}${personalInfo.suffix ? ` ${personalInfo.suffix}` : ''}`.trim().toUpperCase();
    const contact = `${personalInfo.city || ''}${personalInfo.province ? `, ${personalInfo.province}` : ''} ${personalInfo.country || ''} | ${personalInfo.email || ''} | ${personalInfo.phone || ''}`.trim();
  
    const validExp   = workExperiences.filter(e => e.position);
    const validCerts = certifications.filter(c => c.name);
    const validEdu   = education.filter(e => e.degree);
    const techSkills = skills.filter(s => s.category === 'technical' && s.name);
    const softSkills = skills.filter(s => s.category === 'soft' && s.name);
  
    const sectionHeading = (title: string) => `
      <h2 style="font-size:13pt;font-weight:700;text-transform:uppercase;
                 border-bottom:2px solid #101828;padding-bottom:4px;
                 margin:18px 0 10px 0;color:#101828;">${title}</h2>`;
  
    const expHTML = validExp.map(exp => `
      <div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <p style="font-weight:700;font-size:10.5pt;margin:0;color:#101828;">${exp.position}</p>
            <p style="font-size:9.5pt;margin:2px 0 0;color:#4a5565;">${[exp.company, exp.city, exp.stateProvince].filter(Boolean).join(', ')}</p>
          </div>
          <p style="font-size:9.5pt;white-space:nowrap;margin:0;color:#4a5565;">
            ${formatDateToMonthYear(exp.startDate)} – ${exp.current ? 'Present' : formatDateToMonthYear(exp.endDate)}
          </p>
        </div>
        ${exp.description ? `<p style="font-size:9.5pt;margin:4px 0 0;color:#4a5565;white-space:pre-line;">${exp.description}</p>` : ''}
      </div>`).join('');
  
    const certHTML = validCerts.map(cert => `
      <div style="margin-bottom:10px;">
        <p style="font-weight:700;font-size:10.5pt;margin:0;color:#101828;">${cert.name}</p>
        ${cert.organization ? `<p style="font-size:9.5pt;margin:2px 0 0;color:#4a5565;">${cert.organization}</p>` : ''}
        ${cert.dateIssued   ? `<p style="font-size:9.5pt;margin:2px 0 0;color:#4a5565;">Date Issued: ${formatDateToMonthYear(cert.dateIssued)}</p>` : ''}
      </div>`).join('');
  
    const eduHTML = validEdu.map(edu => `
      <div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <p style="font-weight:700;font-size:10.5pt;margin:0;color:#101828;">${edu.degree}</p>
            <p style="font-size:9.5pt;margin:2px 0 0;color:#4a5565;">${[edu.school, edu.city, edu.stateProvince].filter(Boolean).join(', ')}</p>
          </div>
          <p style="font-size:9.5pt;white-space:nowrap;margin:0;color:#4a5565;">
            ${formatDateToMonthYear(edu.startDate)} – ${formatDateToMonthYear(edu.endDate)}
          </p>
        </div>
        ${edu.achievements ? `<p style="font-size:9.5pt;margin:4px 0 0;color:#4a5565;">${edu.achievements}</p>` : ''}
      </div>`).join('');
  
    const skillsHTML = `
      ${techSkills.length ? `
        <p style="font-weight:700;font-size:9.5pt;margin:0 0 6px;color:#101828;">Technical Skills:</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 16px;margin-bottom:10px;">
          ${techSkills.map(s => `<p style="font-size:9.5pt;margin:0;color:#4a5565;">• ${s.name} - ${s.level}</p>`).join('')}
        </div>` : ''}
      ${softSkills.length ? `
        <p style="font-weight:700;font-size:9.5pt;margin:0 0 6px;color:#101828;">Soft Skills:</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 16px;">
          ${softSkills.map(s => `<p style="font-size:9.5pt;margin:0;color:#4a5565;">• ${s.name} - ${s.level}</p>`).join('')}
        </div>` : ''}`;
  
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>${personalInfo.firstName || 'Resume'}_${personalInfo.lastName || ''}</title>
          <style>
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
            @page { size: A4 portrait; margin: 18mm 20mm; }
            body { margin: 0; padding: 0; font-family: Helvetica, Arial, sans-serif; color: #101828; }
            p { margin: 0; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1 style="font-size:16pt;font-weight:700;text-transform:uppercase;
                     letter-spacing:0.05em;margin:0 0 4px;color:#101828;">${name}</h1>
          <p style="font-size:9.5pt;color:#4a5565;margin-bottom:4px;">${contact}</p>
  
          ${validExp.length   ? sectionHeading('Work Experience') + expHTML   : ''}
          ${validCerts.length ? sectionHeading('Certifications')  + certHTML  : ''}
          ${validEdu.length   ? sectionHeading('Education')       + eduHTML   : ''}
          ${techSkills.length || softSkills.length ? sectionHeading('Skills') + skillsHTML : ''}
        </body>
      </html>
    `);
  
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 300);
    };
  };


const handleDownloadDOCX = async () => {
  try {
    const makeHeading = (text: string) =>
      new Paragraph({
        text,
        heading: HeadingLevel.HEADING_2,
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '101828' } },
        spacing: { after: 120 },
      }); 

    const makeParagraph = (text: string, bold = false, size = 20) =>
      new Paragraph({
        children: [new TextRun({ text, bold, size })],
        spacing: { after: 60 },
      });

    const sections: Paragraph[] = [];

    // Header
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${personalInfo.firstName} ${personalInfo.middleInitial} ${personalInfo.lastName}${personalInfo.suffix ? ` ${personalInfo.suffix}` : ''}`.trim(),
            bold: true,
            size: 32,
            allCaps: true,
          }),
        ],
        spacing: { after: 80 },
      }),
      makeParagraph(
        `${personalInfo.city} ${personalInfo.province}, ${personalInfo.country} | ${personalInfo.email} | ${personalInfo.phone}`
      ),
    );

    // Work Experience
    if (workExperiences.some(e => e.position)) {
      sections.push(makeHeading('WORK EXPERIENCE'));
      workExperiences.filter(e => e.position).forEach((exp) => {
        sections.push(
          new Paragraph({
            children: [new TextRun({ text: exp.position, bold: true, size: 22 })],
            spacing: { after: 40 },
          }),
          makeParagraph(`${exp.company}, ${exp.city}, ${exp.stateProvince}`),
          makeParagraph(
            `${formatDateToMonthYear(exp.startDate)} - ${exp.current ? 'Present' : formatDateToMonthYear(exp.endDate)}`
          ),
        );
        if (exp.description) {
          exp.description.split('\n').filter(Boolean).forEach((line) => {
            sections.push(makeParagraph(line));
          });
        }
        sections.push(new Paragraph({ text: '', spacing: { after: 80 } }));
      });
    }

    // Certifications
    if (certifications.some(c => c.name)) {
      sections.push(makeHeading('CERTIFICATIONS'));
      certifications.filter(c => c.name).forEach((cert) => {
        sections.push(
          new Paragraph({ children: [new TextRun({ text: cert.name, bold: true, size: 22 })], spacing: { after: 40 } }),
          makeParagraph(cert.organization),
          cert.dateIssued ? makeParagraph(`Date Issued: ${formatDateToMonthYear(cert.dateIssued)}`) : new Paragraph({}),
          new Paragraph({ text: '', spacing: { after: 80 } }),
        );
      });
    }

    // Education
    if (education.some(e => e.degree)) {
      sections.push(makeHeading('EDUCATION'));
      education.filter(e => e.degree).forEach((edu) => {
        sections.push(
          new Paragraph({ children: [new TextRun({ text: edu.degree, bold: true, size: 22 })], spacing: { after: 40 } }),
          makeParagraph(`${edu.school}, ${edu.city}, ${edu.stateProvince}`),
          makeParagraph(`${formatDateToMonthYear(edu.startDate)} - ${formatDateToMonthYear(edu.endDate)}`),
          edu.achievements ? makeParagraph(edu.achievements) : new Paragraph({}),
          new Paragraph({ text: '', spacing: { after: 80 } }),
        );
      });
    }

    // Skills
    if (skills.some(s => s.name)) {
      sections.push(makeHeading('SKILLS'));
      const technical = skills.filter(s => s.category === 'technical' && s.name);
      const soft      = skills.filter(s => s.category === 'soft' && s.name);
      if (technical.length) {
        sections.push(makeParagraph('Technical Skills:', true));
        technical.forEach(s => sections.push(makeParagraph(`• ${s.name} - ${s.level}`)));
      }
      if (soft.length) {
        sections.push(makeParagraph('Soft Skills:', true));
        soft.forEach(s => sections.push(makeParagraph(`• ${s.name} - ${s.level}`)));
      }
    }

    const doc = new Document({
      sections: [{ children: sections }],
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${personalInfo.firstName || 'Resume'}_${personalInfo.lastName || ''}.docx`.trim();
    saveAs(blob, fileName);
  } catch (err) {
    console.error('DOCX generation failed:', err);
    alert('Failed to generate Word document.');
  }
};
  
  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const uploadCertProof = async (file: File, resumeId: number) => {
    const filePath = `cert-proofs/${resumeId}/${file.name}`;
    const { error } = await supabase.storage
      .from('certificates')
      .upload(filePath, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('certificates').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!account || isSubmitting) return;
    setIsSubmitting(true);
  
    try {
      const list_of_education_levels = [
        "elementary", "junior_high_school", "senior_high_school",
        "college_graduate", "masters", "phd"
      ];
  
      const highestEducation = education.reduce((highest, edu) => {
        const currentIndex = list_of_education_levels.indexOf(edu.level);
        const highestIndex = list_of_education_levels.indexOf(highest);
        return currentIndex > highestIndex ? edu.level : highest;
      }, '');
  
      // Helper to validate a date string is actually a YYYY-MM-DD format
      const isValidDate = (val: string) => /^\d{4}-\d{2}-\d{2}$/.test(val);
      
    const sanitizedWorkExperiences = workExperiences.map((exp) => ({
      position:      exp.position,
      company:       exp.company,
      city:          exp.city,
      stateProvince: exp.stateProvince,
      country:       exp.country,
      startDate:     isValidDate(exp.startDate) ? exp.startDate : null,
      endDate:       exp.current ? null : (isValidDate(exp.endDate) ? exp.endDate : null),
      current:       exp.current,
      // Split by newline into array, filter blanks — sends [] if empty so SQL gets ARRAY[null] → null avoided
      description:   exp.description
        ? exp.description.split('\n').map((s: string) => s.trim()).filter(Boolean)
        : [],
    }));
      
      const sanitizedEducation = education.map((edu) => ({
        ...edu,
        startDate: isValidDate(edu.startDate) ? edu.startDate : null,
        endDate: isValidDate(edu.endDate) ? edu.endDate : null,
      }));
  
      const certificationsWithUrls = await Promise.all(
        certifications.map(async (cert) => {
          if (cert.proofFile) {
            cert.proofUrl = await uploadCertProof(cert.proofFile, account.applicant_id);
          }
          const { proofFile, proofFileName, ...rest } = cert;
          return {
            ...rest,
            dateIssued: rest.dateIssued || null, // sanitize cert date too
          };
        })
      );
  
      const [dob_year, dob_month, dob_day] = personalInfo.dateOfBirth
        ? personalInfo.dateOfBirth.split('-').map(Number)
        : [null, null, null];
  
      const { data: existingResume } = await supabase
        .from('t_resume')
        .select('resume_id')
        .eq('applicant_id', account.applicant_id)
        .order('res_last_updated', { ascending: false })
        .order('resume_id', { ascending: false })
        .limit(1)
        .maybeSingle();
  
      // Always update applicant personal info directly
      await supabase
        .from('t_applicant')
        .update({
          app_first_name:              personalInfo.firstName,
          app_middle_name:             personalInfo.middleInitial,
          app_last_name:               personalInfo.lastName,
          app_suffix:                  personalInfo.suffix,
          app_email:                   personalInfo.email,
          app_present_tele_mobile:     personalInfo.phone,
          app_present_address_city:    personalInfo.city,
          app_present_address_province: personalInfo.province,
          app_present_address_country: personalInfo.country,
          app_dob_day:                 dob_day,
          app_dob_month:               dob_month,
          app_dob_year:                dob_year,
        })
        .eq('applicant_id', account.applicant_id);
  
      if (existingResume) {
        const { data, error } = await supabase.rpc('update_resume', {
          p_resume_id:        existingResume.resume_id,
          p_applicant_id:     account.applicant_id,
          p_dob_year:         dob_year,
          p_dob_month:        dob_month,
          p_dob_day:          dob_day,
          p_highest_edu:      highestEducation,
          p_education:        sanitizedEducation,
          p_work_experiences: sanitizedWorkExperiences,
          p_skills:           skills,
          p_certifications:   certificationsWithUrls,
        });
  
        if (error) {
          console.error(error);
          alert('Submission failed.');
          return;
        }
        console.log('Updated resume_id:', data);
      } else {
        const { data, error } = await supabase.rpc('submit_resume', {
          p_applicant_id:     account.applicant_id,
          p_first_name:       personalInfo.firstName,
          p_middle_initial:   personalInfo.middleInitial,
          p_last_name:        personalInfo.lastName,
          p_suffix:           personalInfo.suffix,
          p_email:            personalInfo.email,
          p_phone:            personalInfo.phone,
          p_city:             personalInfo.city,
          p_province:         personalInfo.province,
          p_country:          personalInfo.country,
          p_dob_year:         dob_year,
          p_dob_month:        dob_month,
          p_dob_day:          dob_day,
          p_highest_edu:      highestEducation,
          p_education:        sanitizedEducation,
          p_work_experiences: sanitizedWorkExperiences,
          p_skills:           skills,
          p_certifications:   certificationsWithUrls,
        });
  
        if (error) {
          console.error(error);
          alert('Submission failed.');
          return;
        }
        console.log('Created resume_id:', data);
      }
  
      alert('Submitted successfully!');
      if (onResumeSubmit) onResumeSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imgFileTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const validTypes = ['application/pdf', ...imgFileTypes];

      if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or image (.pdf, .jpg, .png, .webp)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setIsUploading(true);
      setUploadedFileName(file.name);

      try {
        let resumeImg: HTMLImageElement;

        if (imgFileTypes.includes(file.type)) {
          resumeImg = await loadImage(URL.createObjectURL(file));
        } else if (file.type === 'application/pdf') {
          resumeImg = await parsePdfToImages(file);
        } else {
          alert('This file type is not supported for auto-parsing.');
          setShowUploadModal(false);
          setIsUploading(false);
          return;
        }

        const resumeJSON = await parseResumeLLM(resumeImg);
        handleUploadResumeFieldsPopulation(resumeJSON);
        setResumeUploaded(true);
        setShowUploadModal(false);
        setShowSuccessModal(true);  

      } catch (err) {
        console.error('Resume parsing failed:', err);
        setShowUploadModal(false);
        alert('Failed to parse resume. Please fill in the fields manually.');
      } finally {
        setIsUploading(false);       
      }
    }
  };

  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, {
      position: '', company: '', city: '', stateProvince: '',
      country: '', startDate: '', endDate: '', current: false, description: ''
    }]);
  };

  const removeWorkExperience = (index: number) => {
    setWorkExperiences(workExperiences.filter((_, i) => i !== index));
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string | boolean) => {
    const updated = [...workExperiences];
    updated[index] = { ...updated[index], [field]: value };
    setWorkExperiences(updated);
  };

  const addEducation = () => {
    setEducation([...education, {
      level: '', degree: '', school: '', city: '', stateProvince: '',
      country: '', startDate: '', endDate: '', currentlyStudying: false,
      grade: '', description: '', achievements: ''
    }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string | boolean) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const addSkill = () => {
    setSkills([...skills, { name: '', level: 'Beginner', category: 'technical' }]);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
  };

  const addCertification = () => {
    setCertifications([...certifications, {
      name: '', type: 'certificate', organization: '', dateIssued: '',
      proofFile: null, proofFileName: '', proofUrl: ''
    }]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string | File | null | 'certificate' | 'training') => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };
  
  const sortWorkExperiencesByDate = () => {
    const sorted = [...workExperiences].sort((a, b) => {
      if (a.current) return -1;
      if (b.current) return 1;
      const dateA = a.endDate || a.startDate;
      const dateB = b.endDate || b.startDate;
      return dateB.localeCompare(dateA);
    });
    setWorkExperiences(sorted);
  };

  const sortEducationByDate = () => {
    const sorted = [...education].sort((a, b) => {
      if (a.currentlyStudying) return -1;
      if (b.currentlyStudying) return 1;
      const dateA = a.endDate || a.startDate;
      const dateB = b.endDate || b.startDate;
      return dateB.localeCompare(dateA);
    });
    setEducation(sorted);
  };  

  const handleUploadResumeFieldsPopulation = (resumeJSON: Record<string, unknown>) => {
    const p = resumeJSON.personal_info as Record<string, string> | undefined;
    if (p) {
      setPersonalInfo({
        firstName:     p.first_name      ?? '',
        middleInitial: p.middle_initial  ?? '',
        lastName:      p.last_name       ?? '',
        suffix:        p.suffix          ?? '',
        dateOfBirth:   p.date_of_birth   ?? '',
        city:          p.city            ?? '',
        province:      p.province        ?? '',
        country:       p.country         ?? '',
        email:         p.email           ?? '',
        phone:         p.phone           ?? '',
      });
    }

    const experiences = resumeJSON.experiences as Record<string, unknown>[] | undefined;
      if (experiences && experiences.length > 0) {
        setWorkExperiences(experiences.map((exp) => {
          const endDateRaw = ((exp.endDate as string) ?? '').trim();
          const isCurrent = Boolean(exp.current) ||
            endDateRaw.toLowerCase() === 'present' ||
            endDateRaw.toLowerCase() === 'current' ||
            endDateRaw === '';
      
          const descRaw = exp.description;
          const description = Array.isArray(descRaw)
            ? (descRaw as string[]).join('\n')
            : (descRaw as string) ?? '';
      
          return {
            position:      (exp.position as string) ?? '',
            company:       (exp.company  as string) ?? '',
            city:          (exp.city     as string) ?? '',
            stateProvince: (exp.province as string) ?? '',
            country:       (exp.country  as string) ?? '',
            startDate:     (exp.startDate as string) ?? '',
            endDate:       isCurrent ? '' : endDateRaw,
            current:       isCurrent,
            description,
          };
        }));
      }

    const certEntries = resumeJSON.certificates as Record<string, string>[] | undefined;
    if (certEntries && certEntries.length > 0) {
      setCertifications(certEntries.map((cert) => {
        const rawType = (cert.cred_type ?? '').toLowerCase();
        const type: 'certificate' | 'training' = rawType === 'training' ? 'training' : 'certificate';
        return {
          name:          cert.certificate_title ?? '',
          type,
          organization:  cert.issuer            ?? '',
          dateIssued:    cert.date_obtained     ?? '',
          proofFile:     null,
          proofFileName: '',
          proofUrl:      null,
        };
      }));
    }

    const educationEntries = resumeJSON.education as Record<string, unknown>[] | undefined;
    if (educationEntries && educationEntries.length > 0) {
      setEducation(educationEntries.map((edu) => ({
        level:             (edu.educational_level as string)  ?? '',
        degree:            (edu.degree            as string)  ?? '',
        school:            (edu.school            as string)  ?? '',
        city:              (edu.city              as string)  ?? '',
        stateProvince:     (edu.province          as string)  ?? '',
        country:           (edu.country           as string)  ?? '',
        startDate:         (edu.startDate         as string)  ?? '',
        endDate:           (edu.endDate           as string)  ?? '',
        currentlyStudying: (edu.currentlyStudying as boolean) ?? false,
        grade:             (edu.grade             as string)  ?? '',
        description:       (edu.info              as string)  ?? '',
        achievements:      (edu.grade_honors      as string)  ?? '',
      })));
    }

    const skillEntries = resumeJSON.skills as Record<string, string>[] | undefined;
    if (skillEntries && skillEntries.length > 0) {
      const proficiencyOrder: Record<string, number> = {
        'Expert': 4, 'Advanced': 3, 'Intermediate': 2, 'Beginner': 1,
      };

      const mapped = skillEntries.map((skill) => ({
        name:     skill.skill_name        ?? '',
        level:    skill.proficiency_level ?? '',
        category: skill.skill_category === 'technical' ? 'technical' : 'soft' as 'technical' | 'soft',
      }));

      const sorted = [...mapped].sort((a, b) =>
        (proficiencyOrder[b.level] || 0) - (proficiencyOrder[a.level] || 0)
      );

      setSkills(sorted);
    }
  };

  const steps = [
    { number: 1, title: 'Personal\nInformation', icon: 'personal' },
    { number: 2, title: 'Work\nExperience',      icon: 'professional' },
    { number: 3, title: 'Certifications',         icon: 'certifications' },
    { number: 4, title: 'Education',              icon: 'education' },
    { number: 5, title: 'Skills',                 icon: 'skills' },
  ];

  // ─── RETURN: full multi-step form UI ────────────────────────────────────────
  return (

    <div className="min-h-screen bg-[#f9fafb] py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Step Indicator */}
        <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6 md:mb-8 p-4 sm:p-6">
          {/* Mobile Step Indicator */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-[#101828]">Step {currentStep} of 5</p>
              <p className="text-xs text-[#4a5565]">{steps[currentStep - 1].title.replace('\\n', ' ')}</p>
            </div>
            <div className="flex items-center gap-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    currentStep >= step.number ? 'bg-[#17960b]' : 'bg-[#e5e7eb]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Step Indicator */}
          <div className="hidden lg:flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className={`${
                    currentStep >= step.number ? 'bg-[#17960b]' : 'bg-[#e5e7eb]'
                  } rounded-full w-12 h-12 flex items-center justify-center shrink-0`}>
                    <span className={`text-base font-bold ${
                      currentStep >= step.number ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.number}
                    </span>
                  </div>
                  <p className={`text-sm text-center whitespace-pre-wrap leading-tight ${
                    currentStep === step.number ? 'text-[#101828] font-semibold' : 'text-[#6a7282]'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-6 ${
                    currentStep > step.number ? 'bg-[#17960b]' : 'bg-[#e5e7eb]'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Preview Toggle Button */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="lg:hidden w-full mb-4 bg-[#17960b] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#148509] transition-colors"
        >
          {showPreview ? (
            <><EyeOff className="w-5 h-5" />Hide Preview</>
          ) : (
            <><Eye className="w-5 h-5" />Show Preview</>
          )}
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Panel - Form */}
          <div className={`${showPreview ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
              <div className="mb-6">

                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <>
                    {/* Upload Resume Button */}
                    <div className="mb-6">
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="w-full bg-gradient-to-r from-[#ffca1a] to-[#ffd84d] hover:from-[#e6b617] hover:to-[#e6c43f] text-[#101828] px-4 py-3 sm:py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Upload className="w-5 h-5" />
                        Upload Resume
                      </button>
                      <p className="text-xs sm:text-sm text-center text-[#4a5565] mt-2">
                        Or fill in the form below to create a new resume
                      </p>
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <div className="mb-6 sm:mb-8">
                      <p className="text-lg sm:text-xl font-semibold text-[#101828] mb-2">Fill In Your Personal Information</p>
                      <p className="text-sm sm:text-base text-[#4a5565]">Help recruiters to get in touch with you.</p>
                    </div>

                    <div className="space-y-4 sm:space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-[#364153] mb-2">First Name</label>
                          <input
                            type="text"
                            value={personalInfo.firstName}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                            className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                            placeholder="Juan"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#364153] mb-2">Middle Initial</label>
                          <input
                            type="text"
                            value={personalInfo.middleInitial}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, middleInitial: e.target.value })}
                            className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                            placeholder="A"
                            maxLength={1}
                          />
                        </div>
                      </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-[#364153] mb-2">Last Name</label>
                            <input
                              type="text"
                              value={personalInfo.lastName}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                              className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                              placeholder="Dela Cruz"
                              />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#364153] mb-2">Suffix</label>
                            <input
                              type="text"
                              value={personalInfo.suffix}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, suffix: e.target.value })}
                              className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                              placeholder="Jr"
                              />
                          </div>
                        </div>

                      <div>
                        <label className="block text-sm font-medium text-[#364153] mb-2">Date of Birth</label>
                        <div className="relative">
                          <input
                            type="date"
                            value={personalInfo.dateOfBirth}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                            className="w-full bg-[#f3f3f5] rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                          />
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#364153] mb-2">City</label>
                          <input
                            type="text"
                            value={personalInfo.city}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })}
                            className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                            placeholder="Manila"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#364153] mb-2">Province</label>
                          <input
                            type="text"
                            value={personalInfo.province}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, province: e.target.value })}
                            className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                            placeholder="Metro Manila"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#364153] mb-2">Country</label>
                          <input
                            type="text"
                            value={personalInfo.country}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })}
                            className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                            placeholder="Philippines"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#364153] mb-2">Email Address</label>
                        <input
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                          className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                          placeholder="naomi@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#364153] mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                          className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                          placeholder="+63 9345234576"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Work Experience */}
                {currentStep === 2 && (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg sm:text-xl font-semibold text-[#101828]">Work Experience</p>
                        <button
                          onClick={sortWorkExperiencesByDate}
                          className="text-sm text-[#17960b] hover:text-[#148509] font-medium flex items-center gap-1"
                        >
                          <ArrowRight className="w-4 h-4 rotate-90" />
                          Sort by Date
                        </button>
                      </div>
                      <p className="text-sm sm:text-base text-[#4a5565]">Add your professional experience.</p>
                    </div>

                    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                      {workExperiences.map((exp, index) => (
                        <div key={index} className="border border-[#e5e7eb] rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-base font-semibold text-[#101828]">Experience {index + 1}</p>
                            {workExperiences.length > 1 && (
                              <button onClick={() => removeWorkExperience(index)} className="text-red-600 hover:text-red-700 p-2">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Position</label>
                              <input type="text" value={exp.position} onChange={(e) => updateWorkExperience(index, 'position', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" placeholder="e.g., Marketing Manager" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Company</label>
                              <input type="text" value={exp.company} onChange={(e) => updateWorkExperience(index, 'company', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" placeholder="e.g., XYZ Corporation" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">City</label>
                                <input type="text" value={exp.city} onChange={(e) => updateWorkExperience(index, 'city', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" placeholder="Sydney" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">State/Province</label>
                                <input type="text" value={exp.stateProvince} onChange={(e) => updateWorkExperience(index, 'stateProvince', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" placeholder="NSW" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">Country</label>
                                <input type="text" value={exp.country} onChange={(e) => updateWorkExperience(index, 'country', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" placeholder="Australia" />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">Start Date</label>
                                <div className="relative">
                                  <input type="date" value={exp.startDate} onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" />
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">End Date</label>
                                {exp.current ? (
                                  <div className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900">Present</div>
                                ) : (
                                  <div className="relative">
                                    <input type="date" value={exp.endDate} onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" />
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" checked={exp.current} onChange={(e) => updateWorkExperience(index, 'current', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#17960b] focus:ring-[#17960b]" />
                              <label className="text-sm text-[#364153]">I currently work here</label>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Description</label>
                              <textarea value={exp.description} onChange={(e) => updateWorkExperience(index, 'description', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none resize-none focus:ring-2 focus:ring-[#17960b]" rows={4} placeholder="Highlight specific achievements and quantify results (e.g., 'Increased sales by 30%'). Use bullet points starting with •" />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={addWorkExperience} className="w-full border-2 border-dashed border-[#17960b] rounded-lg py-3 text-[#17960b] font-semibold flex items-center justify-center gap-2 hover:bg-[#17960b]/5 transition-colors">
                        <Plus className="w-5 h-5" />
                        Add Another Experience
                      </button>
                    </div>
                  </>
                )}

                {/* Step 3: Certifications */}
                {currentStep === 3 && (
                  <>
                    <div className="mb-6">
                      <p className="text-lg sm:text-xl font-semibold text-[#101828] mb-2">Certifications</p>
                      <p className="text-sm sm:text-base text-[#4a5565]">Add your professional certifications.</p>
                    </div>

                    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                      {certifications.map((cert, index) => (
                        <div key={index} className="border border-[#e5e7eb] rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-base font-semibold text-[#101828]">Certification {index + 1}</p>
                            {certifications.length > 1 && (
                              <button onClick={() => removeCertification(index)} className="text-red-600 hover:text-red-700 p-2">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Certification Name</label>
                              <input type="text" value={cert.name} onChange={(e) => updateCertification(index, 'name', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" placeholder="e.g., Certification of Master Plumbing" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Type</label>
                              <select value={cert.type} onChange={(e) => updateCertification(index, 'type', e.target.value as 'certificate' | 'training')} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]">
                                <option value="certificate">Certificate</option>
                                <option value="training">Training</option>
                              </select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">Issuing Organization</label>
                                <input type="text" value={cert.organization} onChange={(e) => updateCertification(index, 'organization', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" placeholder="e.g., Philippine Tubero Association" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">Date Issued</label>
                                <div className="relative">
                                  <input type="date" value={cert.dateIssued} onChange={(e) => updateCertification(index, 'dateIssued', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" />
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Proof of Certification (Optional)</label>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    updateCertification(index, 'proofFile', file);
                                    updateCertification(index, 'proofFileName', file.name);
                                  }
                                }}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#17960b] file:text-white hover:file:bg-[#148509] file:cursor-pointer"
                              />
                              {cert.proofFileName && (
                                <p className="text-xs text-[#4a5565] mt-2">Selected: {cert.proofFileName}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={addCertification} className="w-full border-2 border-dashed border-[#17960b] rounded-lg py-3 text-[#17960b] font-semibold flex items-center justify-center gap-2 hover:bg-[#17960b]/5 transition-colors">
                        <Plus className="w-5 h-5" />
                        Add Another Certification
                      </button>
                    </div>
                  </>
                )}

                {/* Step 4: Education */}
                {currentStep === 4 && (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg sm:text-xl font-semibold text-[#101828]">Education Level</p>
                        <button onClick={sortEducationByDate} className="text-sm text-[#17960b] hover:text-[#148509] font-medium flex items-center gap-1">
                          <ArrowRight className="w-4 h-4 rotate-90" />
                          Sort by Date
                        </button>
                      </div>
                      <p className="text-sm sm:text-base text-[#4a5565]">Add your educational background.</p>
                    </div>

                    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                      {education.map((edu, index) => (
                        <div key={index} className="border border-[#e5e7eb] rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-base font-semibold text-[#101828]">Education {index + 1}</p>
                            {education.length > 1 && (
                              <button onClick={() => removeEducation(index)} className="text-red-600 hover:text-red-700 p-2">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Education Level</label>
                              <select value={edu.level} onChange={(e) => updateEducation(index, 'level', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]">
                                <option value="">Select education level</option>
                                <option value="elementary">Elementary</option>
                                <option value="junior_high_school">Junior High School</option>
                                <option value="senior_high_school">Senior High School</option>
                                <option value="college_graduate">College Graduate/Bachelor's</option>
                                <option value="masters">Master's</option>
                                <option value="phd">PhD</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Degree</label>
                              <input type="text" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" placeholder="e.g., Bachelor of Marketing" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">School/University</label>
                              <input type="text" value={edu.school} onChange={(e) => updateEducation(index, 'school', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" placeholder="e.g., University of the Philippines" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">City</label>
                                <input type="text" value={edu.city} onChange={(e) => updateEducation(index, 'city', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" placeholder="Quezon City" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">State/Province</label>
                                <input type="text" value={edu.stateProvince} onChange={(e) => updateEducation(index, 'stateProvince', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" placeholder="Metro Manila" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">Country</label>
                                <input type="text" value={edu.country} onChange={(e) => updateEducation(index, 'country', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" placeholder="Philippines" />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">Start Date</label>
                                <div className="relative">
                                  <input type="date" value={edu.startDate} onChange={(e) => updateEducation(index, 'startDate', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" />
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">End Date</label>
                                <div className="relative">
                                  <input type="date" value={edu.endDate} onChange={(e) => updateEducation(index, 'endDate', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" />
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Grade/GPA</label>
                              <input type="text" value={edu.grade} onChange={(e) => updateEducation(index, 'grade', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" placeholder="e.g., 3.8 GPA or 85%" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Description</label>
                              <textarea value={edu.description} onChange={(e) => updateEducation(index, 'description', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none resize-none focus:ring-2 focus:ring-[#17960b]" rows={3} placeholder="Describe your major coursework, projects, or other relevant details" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Achievements/Honors</label>
                              <textarea value={edu.achievements} onChange={(e) => updateEducation(index, 'achievements', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none resize-none focus:ring-2 focus:ring-[#17960b]" rows={3} placeholder="Include CGPA, Dean's List, scholarships, awards, honors, etc." />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={addEducation} className="w-full border-2 border-dashed border-[#17960b] rounded-lg py-3 text-[#17960b] font-semibold flex items-center justify-center gap-2 hover:bg-[#17960b]/5 transition-colors">
                        <Plus className="w-5 h-5" />
                        Add Another Education
                      </button>
                    </div>
                  </>
                )}

                {/* Step 5: Skills */}
                {currentStep === 5 && (
                  <>
                    <div className="mb-6">
                      <p className="text-lg sm:text-xl font-semibold text-[#101828] mb-2">Skills</p>
                      <p className="text-sm sm:text-base text-[#4a5565]">Add your professional skills and competencies.</p>
                    </div>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                      {skills.map((skill, index) => (
                        <div key={index} className="border border-[#e5e7eb] rounded-lg p-4">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Skill Name</label>
                              <input type="text" value={skill.name} onChange={(e) => updateSkill(index, 'name', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]" placeholder="Technical: e.g., Microsoft Excel | Soft: e.g., Communication" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">Category</label>
                                <select value={skill.category} onChange={(e) => updateSkill(index, 'category', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]">
                                  <option value="technical">Technical</option>
                                  <option value="soft">Soft</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">Proficiency</label>
                                <select value={skill.level} onChange={(e) => updateSkill(index, 'level', e.target.value)} className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]">
                                  <option value="Beginner">Beginner</option>
                                  <option value="Intermediate">Intermediate</option>
                                  <option value="Advanced">Advanced</option>
                                  <option value="Expert">Expert</option>
                                </select>
                              </div>
                            </div>
                            {skills.length > 1 && (
                              <div className="flex justify-end">
                                <button onClick={() => removeSkill(index)} className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1">
                                  <Trash2 className="w-4 h-4" />
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <button onClick={addSkill} className="w-full border-2 border-dashed border-[#17960b] rounded-lg py-3 text-[#17960b] font-semibold flex items-center justify-center gap-2 hover:bg-[#17960b]/5 transition-colors">
                        <Plus className="w-5 h-5" />
                        Add Another Skill
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-3 sm:gap-4 pt-6 border-t border-[#e5e7eb] mt-6">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`px-6 sm:px-8 py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-colors ${
                    currentStep === 1
                      ? 'bg-[#e5e7eb] text-[#99a1af] cursor-not-allowed'
                      : 'bg-[#e5e7eb] text-[#4a5565] hover:bg-[#d1d5dc]'
                  }`}
                >
                  Previous
                </button>
                {currentStep < 5 ? (
                  <button onClick={handleNext} className="px-6 sm:px-8 py-2.5 bg-[#17960b] text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-[#148509] transition-colors">
                    Next
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 sm:px-8 py-2.5 bg-[#17960b] text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-[#148509] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Submitting...' : 'Submit Resume'}
                  </button>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-[#e5e7eb]">
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm text-[#4a5565]">powered by</p>
                  <img src={imgImageLandbase} alt="Landbase" className="w-5 h-5" />
                  <p className="text-sm font-medium text-[#101828]">Landbase</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Resume Preview */}
          <div className={`${showPreview ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-20">
              {/* Download Header */}
              <div className="bg-white rounded-t-lg shadow-sm p-4 border-b border-[#e5e7eb]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#101828]">Resume Preview</p>
                  <div className="relative">
                    <button
                      onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                      className="bg-[#17960b] text-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-semibold hover:bg-[#148509] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      DOWNLOAD
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {showDownloadDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowDownloadDropdown(false)} />
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                          <button onClick={handleDownloadPDF} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-[#364153] transition-colors flex items-center gap-3">
                            <FileText className="w-4 h-4 text-[#17960b]" />
                            Download as PDF
                          </button>
                          {/*<button onClick={handleDownloadDOCX} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-[#364153] transition-colors flex items-center gap-3">
                            <FileText className="w-4 h-4 text-[#17960b]" />
                            Download as DOC
                          </button> */}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Page Preview Container */}
              <div
                ref={previewContainerRef}
                className="bg-gray-200 rounded-b-lg shadow-sm"
                style={{ height: 'calc(100vh - 12rem)', overflowY: 'auto' }}
              >
                <div className="flex justify-center py-4">
                  <div   
                    style={{
                      width: '210mm',
                      minHeight: '297mm',
                      background: 'white',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                      transform: `scale(${previewScale})`,
                      transformOrigin: 'top center',
                      marginBottom: `${(previewScale - 1) * 297}mm`,
                    }}
                  >
                    <ResumePreview
                      personalInfo={personalInfo}
                      workExperiences={workExperiences}
                      certifications={certifications}
                      education={education}
                      skills={skills}
                      previewScale={1}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Jobs Section - Shows after resume upload */}
        {resumeUploaded && (
          <div className="mt-6 sm:mt-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8 md:p-10 text-center shadow-md border border-gray-200">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Want More Personalized Recommendations?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
                Update your profile, add more skills, and upload your latest resume to get even better job matches.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-[#ffca1a] hover:bg-[#e6b617] text-[#101828] px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg text-sm sm:text-base font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  Update Resume
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload CV Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setShowUploadModal(false)} />
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
              <button onClick={() => setShowUploadModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
              <div className="mb-6">
                <div className="w-14 h-14 bg-[#ffca1a] rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-7 h-7 text-[#101828]" />
                </div>
                <h2 className="text-2xl font-semibold text-[#101828] mb-2">Upload Your CV</h2>
                <p className="text-sm text-[#4a5565]">Upload your resume and we'll automatically fill in your information</p>
              </div>

              {isUploading ? (
                <div className="block w-full border-2 border-dashed border-[#17960b] rounded-xl p-8 text-center bg-[#17960b]/5">
                  <div className="w-12 h-12 mx-auto mb-3">
                    <div className="w-full h-full border-4 border-[#17960b] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-base font-medium text-[#101828] mb-1">Uploading your resume...</p>
                  <p className="text-sm text-[#4a5565]">Please wait while we process your file</p>
                </div>
              ) : (
                <div className="mb-6">
                  <label htmlFor="cv-upload" className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#17960b] transition-colors cursor-pointer group">
                    <input id="cv-upload" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={handleFileUpload} />
                    <FileText className="w-12 h-12 text-gray-400 group-hover:text-[#17960b] mx-auto mb-3 transition-colors" />
                    <p className="text-base font-medium text-[#101828] mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-[#4a5565]">PDF, JPG, JPEG, or WEBP (max. 5MB)</p>
                  </label>
                </div>
              )}

              <div className="bg-[#f9fafb] rounded-lg p-4 mb-6">
                <p className="text-xs font-semibold text-[#364153] mb-2">Supported Formats:</p>
                <div className="flex flex-wrap gap-2">
                  {['PDF', 'JPG/JPEG/PNG', 'WEBP'].map((fmt) => (
                    <span key={fmt} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-xs font-medium text-[#4a5565] border border-gray-200">
                      <Check className="w-3 h-3 text-[#17960b]" />
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button onClick={() => setShowUploadModal(false)} className="flex-1 px-6 py-3 border border-gray-300 text-[#364153] rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isUploading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#17960b] text-white hover:bg-[#148509]'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? 'Uploading...' : 'Browse Files'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setShowSuccessModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
              <div className="w-20 h-20 bg-[#17960b]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-[#17960b]" />
              </div>
              <h3 className="text-2xl font-bold text-[#101828] mb-3">Upload Complete!</h3>
              <p className="text-base text-[#4a5565] mb-2">
                Your resume <span className="font-semibold text-[#101828]">"{uploadedFileName}"</span> has been uploaded successfully.
              </p>
              <p className="text-sm text-[#4a5565] mb-8">You can now edit or submit your resume.</p>
              <button onClick={() => setShowSuccessModal(false)} className="w-full px-6 py-3 bg-[#17960b] text-white rounded-lg font-semibold hover:bg-[#148509] transition-colors">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
