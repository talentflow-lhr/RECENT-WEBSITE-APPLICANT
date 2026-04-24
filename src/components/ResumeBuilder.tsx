import { useState, useRef, useEffect } from 'react';
import svgPaths from '../imports/svg-65zdysylli';
import imgImageLandbase from '../../imports/Landbase-removebg-preview.png';
import { Download, Plus, Trash2, Eye, EyeOff, Upload, X, FileText, Check, ChevronDown, Star, Briefcase, MapPin, ArrowRight, Calendar } from 'lucide-react';
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

interface Education {
  level: string;
  degree: string;
  school: string;
  city: string;
  stateProvince: string;
  country: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
  achievements: string;
}

interface Organization {
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Skill {
  name: string;
  level: string;
  category: 'technical' | 'soft';
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

interface ResumeBuilderProps {
  onResumeSubmit?: () => void;
}

const formatDateToMonthYear = (dateString: string): string => {
  const [year, month] = dateString.split('-');
  return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(month,10)-1]} ${year}`;
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
  const context = canvas.getContext('2d')!;
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
 * @param source - HTMLImageElement or HTMLCanvasElement
 * @returns HTMLCanvasElement with grayscale image data
 */
function convertToGrayscale(source: HTMLImageElement | HTMLCanvasElement): HTMLCanvasElement {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to get 2D context');

    // Set canvas dimensions to match the source
    canvas.width = source.width;
    canvas.height = source.height;

    // Draw the source image onto the canvas
    if (source instanceof HTMLImageElement) {
        ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    } else if (source instanceof HTMLCanvasElement) {
        ctx.drawImage(source, 0, 0);
    }

    // Get pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert each pixel to grayscale using luminosity formula
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Standard luminosity formula: 0.299*R + 0.587*G + 0.114*B
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        data[i] = gray;     // Red
        data[i + 1] = gray; // Green
        data[i + 2] = gray; // Blue
        // Alpha remains unchanged (data[i+3])
    }

    // Put the modified data back
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

export function ResumeBuilder({ onResumeSubmit }: ResumeBuilderProps = {}) {

  const { account } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    middleInitial: '',
    lastName: '',
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
      grade: '',
      description: '',
      achievements: ''
    }
  ]);

  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      organization: 'Youth Leadership Council',
      role: 'Vice President',
      startDate: 'Jan 2019',
      endDate: 'Dec 2020',
      current: false,
      description: 'Led community outreach programs and managed a team of 15 volunteers'
    }
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { name: '', level: 'Beginner', category: 'technical' }
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    { name: '', type: 'certificate', organization: '', dateIssued: '' }
  ]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const uploadCertProof = async (file: File, resumeId: number) => {
    const filePath = `cert-proofs/${resumeId}/${file.name}`;

    const { error } = await supabase.storage
      .from('certificates')        // your storage bucket name
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    // get the public URL back
    const { data } = supabase.storage
      .from('certificates')
      .getPublicUrl(filePath);

    return data.publicUrl;         // store this in your DB
  };

  const handleSubmit = async () => {

    if (!account) return null;

    const list_of_education_levels = [
      "elementary",
      "junior_high_school",
      "senior_high_school",
      "college_graduate",
      "masters",
      "phd"
    ];

    const highestEducation = education.reduce((highest, edu) => {
      const currentIndex = list_of_education_levels.indexOf(edu.level);
      const highestIndex = list_of_education_levels.indexOf(highest);
      return currentIndex > highestIndex ? edu.level : highest;
    }, '');

    const certificationsWithUrls = await Promise.all(
      certifications.map(async (cert) => {
        if (cert.proofFile) {
          cert.proofUrl = await uploadCertProof(cert.proofFile, account.applicant_id);
        }
        const { proofFile, proofFileName, ...rest } = cert;
        return rest;  // proofUrl is now included, File objects are stripped
      })
    );

    // Separating date of birth parts first, since they are separated in the database
    let [dob_year, dob_month, dob_day] = personalInfo.dateOfBirth
    ? personalInfo.dateOfBirth.split('-').map(Number)  // ← convert to numbers here
    : [null, null, null];

    // check if resume already exists
    const { data: existingResume } = await supabase
      .from('t_resume')
      .select('resume_id')
      .eq('applicant_id', account.applicant_id)
      .order('res_last_updated', { ascending: false })
      .order('resume_id', { ascending: false })
      .limit(1)
      .maybeSingle();

    const rpcFunction = existingResume ? 'update_resume' : 'submit_resume';

    // submitting data to a transaction function in the database, to gurantee atomicity
    const { data, error } = await supabase.rpc(rpcFunction, {
      ...(existingResume && { p_resume_id: existingResume.resume_id }),
      p_applicant_id: account.applicant_id,
      p_dob_year: dob_year,
      p_dob_month: dob_month,
      p_dob_day: dob_day,
      p_highest_edu: highestEducation,
      p_education: education,
      p_work_experiences: workExperiences,
      p_skills: skills,
      p_certifications: certificationsWithUrls,
    });

    if (error) {
      console.error(error);
      alert('Submission failed.');
      return;
    }

    console.log('Created resume_id:', data); // the returned v_resume_id
    alert('Submitted successfully!');
    if (onResumeSubmit) onResumeSubmit();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, {
      position: '',
      company: '',
      city: '',
      stateProvince: '',
      country: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
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
      level: '',
      degree: '',
      school: '',
      city: '',
      stateProvince: '',
      country: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: '',
      achievements: ''
    }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const addOrganization = () => {
    setOrganizations([...organizations, {
      organization: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }]);
  };

  const removeOrganization = (index: number) => {
    setOrganizations(organizations.filter((_, i) => i !== index));
  };

  const updateOrganization = (index: number, field: keyof Organization, value: string | boolean) => {
    const updated = [...organizations];
    updated[index] = { ...updated[index], [field]: value };
    setOrganizations(updated);
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
      name: '',
      type: 'certificate',
      organization: '',
      dateIssued: '',
      proofFile: null,
      proofFileName: '',
      proofUrl: ''
    }]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string | File | null) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const handleUploadResumeFieldsPopulation = (resumeJSON: Record<string, unknown>) => {
    // --- Personal Info ---
    const p = resumeJSON.personal_info as Record<string, string> | undefined;
    if (p) {
      setPersonalInfo({
        firstName:     p.first_name      ?? '',
        middleInitial: p.middle_initial  ?? '',
        lastName:      p.last_name       ?? '',
        dateOfBirth:   p.date_of_birth   ?? '',   // was missing
        city:          p.city            ?? '',
        province:      p.province        ?? '',
        country:       p.country         ?? '',
        email:         p.email           ?? '',
        phone:         p.phone           ?? '',
      });
    }

    // --- Work Experience ---
    const experiences = resumeJSON.experiences as Record<string, unknown>[] | undefined;
    if (experiences && experiences.length > 0) {
      setWorkExperiences(experiences.map((exp) => ({
        position:      (exp.position     as string)  ?? '',
        company:       (exp.company      as string)  ?? '',
        city:          (exp.city         as string)  ?? '',
        stateProvince: (exp.province     as string)  ?? '',
        country:       (exp.country      as string)  ?? '',   // was missing
        startDate:     (exp.startDate    as string)  ?? '',
        endDate:       (exp.endDate      as string)  ?? '',
        current:       (exp.current      as boolean) ?? false,
        description:   (exp.description  as string)  ?? '',
      })));
    }

    // --- Education ---
    const educationEntries = resumeJSON.education as Record<string, unknown>[] | undefined;
    if (educationEntries && educationEntries.length > 0) {
      setEducation(educationEntries.map((edu) => ({
        level:         (edu.educational_level as string) ?? '',   // was missing
        degree:        (edu.degree            as string) ?? '',
        school:        (edu.school            as string) ?? '',
        city:          (edu.city              as string) ?? '',
        stateProvince: (edu.province          as string) ?? '',
        country:       (edu.country           as string) ?? '',   // was missing
        startDate:     (edu.startDate         as string) ?? '',
        endDate:       (edu.endDate           as string) ?? '',
        grade:         (edu.grade             as string) ?? '',   // was missing
        description:   (edu.info              as string) ?? '',   // was missing / wrong key
        achievements:  (edu.grade_honors      as string) ?? '',   // more accurate mapping
      })));
    }

    // --- Skills ---
    const skillEntries = resumeJSON.skills as Record<string, string>[] | undefined;
    if (skillEntries && skillEntries.length > 0) {
      setSkills(skillEntries.map((skill) => {
        const cat = skill.skill_category;
        const category: 'technical' | 'soft' =
          cat === 'technical' ? 'technical' : 'soft';   // normalize extras to 'soft'
        return {
          name:     skill.skill_name        ?? '',
          level:    skill.proficiency_level ?? '',
          category,
        };
      }));
    }

    // --- Certifications ---
    const certEntries = resumeJSON.certificates as Record<string, string>[] | undefined;
    if (certEntries && certEntries.length > 0) {
      setCertifications(certEntries.map((cert) => {
        const rawType = (cert.cred_type ?? '').toLowerCase();
        const type: 'certificate' | 'training' =
          rawType === 'training' ? 'training' : 'certificate';   // was missing
        return {
          name:          cert.certificate_title ?? '',
          type,
          organization:  cert.issuer            ?? '',
          dateIssued:    cert.date_obtained     ?? '',
          proofFile:     null,
          proofFileName: '',
        };
      }));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type

      const imgFileTypes = ['image/jpeg', 'image/png', 'image/webp']
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ...imgFileTypes
      ];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document (.pdf, .doc, .docx)');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      try {
        let resumeImg: HTMLImageElement;

        if (imgFileTypes.includes(file.type)) {
          resumeImg = await loadImage(URL.createObjectURL(file));
        } else if (file.type === 'application/pdf') {
          resumeImg = await parsePdfToImages(file);
        } else {
          alert('Word documents are not yet supported for auto-parsing.');
          setShowUploadModal(false);
          return;
        }

        const resumeJSON = await parseResumeLLM(resumeImg);
        handleUploadResumeFieldsPopulation(resumeJSON);
        setResumeUploaded(true);
        setShowUploadModal(false);
        alert(`Resume "${file.name}" parsed and fields populated successfully!`);

      } catch (err) {
        console.error('Resume parsing failed:', err);
        setShowUploadModal(false);
        alert('Failed to parse resume. Please fill in the fields manually.');
      }
    }
  };

  const steps = [
    { number: 1, title: 'Personal\nInformation', icon: 'personal' },
    { number: 2, title: 'Experience', icon: 'professional' },
    { number: 3, title: 'Education', icon: 'education' },
    { number: 4, title: 'Skills', icon: 'skills' },
    { number: 5, title: 'Certifications', icon: 'certifications' },
  ];

  const ResumePreview = () => {
    // All resume content in a single flow
    return (
      <div className="space-y-6">
        {/* Continuous content that flows across multiple pages */}
        <div className="bg-white shadow-2xl mx-auto relative" style={{ width: '210mm', maxWidth: '100%' }}>
          <div className="p-8 sm:p-12 md:p-16">
            {/* Name */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-[#101828] uppercase tracking-wide mb-2">
                {personalInfo.firstName || 'FIRST'} {personalInfo.middleInitial || 'M'} {personalInfo.lastName || 'LAST'}
              </h1>
              <div className="text-sm text-[#4a5565]">
                <p>{personalInfo.city || 'City'} {personalInfo.province || 'Province'}, {personalInfo.country || 'Country'} | {personalInfo.email || 'email@email.com'} | {personalInfo.phone || '+phone'}</p>
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

            {/* Page break indicator after work experience if content is long */}
            {(workExperiences.length > 2 || (education.length > 0 && education[0].degree)) && (
              <div className="border-t-2 border-dashed border-gray-300 my-8 relative">
                <span className="absolute -top-3 right-0 bg-white px-2 text-xs text-gray-400">Page Break</span>
              </div>
            )}

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
                  {/* Technical Skills */}
                  {skills.filter(s => s.category === 'technical' && s.name).length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-[#101828] mb-2">Technical Skills:</p>
                      <div className="space-y-1">
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
                  
                  {/* Soft Skills */}
                  {skills.filter(s => s.category === 'soft' && s.name).length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-[#101828] mb-2">Soft Skills:</p>
                      <div className="space-y-1">
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
                        <p className="text-sm text-[#4a5565]">
                          {cert.organization}
                        </p>
                        {cert.dateIssued && (
                          <p className="text-sm text-[#4a5565]">
                            Date Issued: { formatDateToMonthYear(cert.dateIssued)}
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
          </div>
        </div>
      </div>
    );
  };

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
            <>
              <EyeOff className="w-5 h-5" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="w-5 h-5" />
              Show Preview
            </>
          )}
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Panel - Form */}
          <div className={`${showPreview ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
              {/* Form Content */}
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
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <div className="mb-6 sm:mb-8">
                      <div className="flex-1">
                        <p className="text-lg sm:text-xl font-semibold text-[#101828] mb-2">Fill In Your Personal Information</p>
                        <p className="text-sm sm:text-base text-[#4a5565]">Help recruiters to get in touch with you.</p>
                      </div>
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
                            placeholder="Naomi"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#364153] mb-2">Middle Initial</label>
                          <input
                            type="text"
                            value={personalInfo.middleInitial}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, middleInitial: e.target.value })}
                            className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                            placeholder="C"
                            maxLength={1}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#364153] mb-2">Last Name</label>
                        <input
                          type="text"
                          value={personalInfo.lastName}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                          className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                          placeholder="Cuerdo"
                        />
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

                {/* Step 2: Professional Experience */}
                {currentStep === 2 && (
                  <>
                    <div className="mb-6">
                      <p className="text-lg sm:text-xl font-semibold text-[#101828] mb-2">Work Experience</p>
                      <p className="text-sm sm:text-base text-[#4a5565]">Add your professional experience.</p>
                    </div>

                    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                      {workExperiences.map((exp, index) => (
                        <div key={index} className="border border-[#e5e7eb] rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-base font-semibold text-[#101828]">Experience {index + 1}</p>
                            {workExperiences.length > 1 && (
                              <button
                                onClick={() => removeWorkExperience(index)}
                                className="text-red-600 hover:text-red-700 p-2"
                                aria-label="Remove experience"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Position</label>
                              <input
                                type="text"
                                value={exp.position}
                                onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                                className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                placeholder="e.g., Marketing Manager"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Company</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                                className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                placeholder="e.g., XYZ Corporation"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">City</label>
                                <input
                                  type="text"
                                  value={exp.city}
                                  onChange={(e) => updateWorkExperience(index, 'city', e.target.value)}
                                  className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                  placeholder="Sydney"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">State/Province</label>
                                <input
                                  type="text"
                                  value={exp.stateProvince}
                                  onChange={(e) => updateWorkExperience(index, 'stateProvince', e.target.value)}
                                  className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                  placeholder="NSW"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">Country</label>
                                <input
                                  type="text"
                                  value={exp.country}
                                  onChange={(e) => updateWorkExperience(index, 'country', e.target.value)}
                                  className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                  placeholder="Australia"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">Start Date</label>
                                <div className="relative">
                                  <input
                                    type="date"
                                    value={exp.startDate}
                                    onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                                    className="w-full bg-[#f3f3f5] rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                  />
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">End Date</label>
                                {exp.current ? (
                                  <div className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900">
                                    Present
                                  </div>
                                ) : (
                                  <div className="relative">
                                    <input
                                      type="date"
                                      value={exp.endDate}
                                      onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                                      className="w-full bg-[#f3f3f5] rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                    />
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) => updateWorkExperience(index, 'current', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-[#17960b] focus:ring-[#17960b]"
                              />
                              <label className="text-sm text-[#364153]">I currently work here</label>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Description</label>
                              <textarea
                                value={exp.description}
                                onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                                className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none resize-none focus:ring-2 focus:ring-[#17960b]"
                                rows={4}
                                placeholder="Highlight specific achievements and quantify results (e.g., 'Increased sales by 30%' instead of 'Responsible for sales'). Use bullet points starting with •"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={addWorkExperience}
                        className="w-full border-2 border-dashed border-[#17960b] rounded-lg py-3 text-[#17960b] font-semibold flex items-center justify-center gap-2 hover:bg-[#17960b]/5 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        Add Another Experience
                      </button>
                    </div>
                  </>
                )}

                {/* Step 3: Education */}
                {currentStep === 3 && (
                  <>
                    <div className="mb-6">
                      <p className="text-lg sm:text-xl font-semibold text-[#101828] mb-2">Education Level</p>
                      <p className="text-sm sm:text-base text-[#4a5565]">Add your educational background.</p>
                    </div>

                    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                      {education.map((edu, index) => (
                        <div key={index} className="border border-[#e5e7eb] rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-base font-semibold text-[#101828]">Education {index + 1}</p>
                            {education.length > 1 && (
                              <button
                                onClick={() => removeEducation(index)}
                                className="text-red-600 hover:text-red-700 p-2"
                                aria-label="Remove education"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Education Level</label>
                              <select
                                value={edu.level}
                                onChange={(e) => updateEducation(index, 'level', e.target.value)}
                                className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                              >
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
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                placeholder="e.g., Bachelor of Marketing"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">School/University</label>
                              <input
                                type="text"
                                value={edu.school}
                                onChange={(e) => updateEducation(index, 'school', e.target.value)}
                                className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                placeholder="e.g., University of Sydney"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">City</label>
                                <input
                                  type="text"
                                  value={edu.city}
                                  onChange={(e) => updateEducation(index, 'city', e.target.value)}
                                  className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                  placeholder="Sydney"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">State/Province</label>
                                <input
                                  type="text"
                                  value={edu.stateProvince}
                                  onChange={(e) => updateEducation(index, 'stateProvince', e.target.value)}
                                  className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                  placeholder="NSW"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">Country</label>
                                <input
                                  type="text"
                                  value={edu.country}
                                  onChange={(e) => updateEducation(index, 'country', e.target.value)}
                                  className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                  placeholder="Australia"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">Start Date</label>
                                <div className="relative">
                                  <input
                                    type="date"
                                    value={edu.startDate}
                                    onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                                    className="w-full bg-[#f3f3f5] rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                  />
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">End Date</label>
                                <div className="relative">
                                  <input
                                    type="date"
                                    value={edu.endDate}
                                    onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                                    className="w-full bg-[#f3f3f5] rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                  />
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Grade/GPA</label>
                              <input
                                type="text"
                                value={edu.grade}
                                onChange={(e) => updateEducation(index, 'grade', e.target.value)}
                                className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                placeholder="e.g., 3.8 GPA or 85%"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Description</label>
                              <textarea
                                value={edu.description}
                                onChange={(e) => updateEducation(index, 'description', e.target.value)}
                                className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none resize-none focus:ring-2 focus:ring-[#17960b]"
                                rows={3}
                                placeholder="Describe your major coursework, projects, or other relevant details"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Achievements/Honors</label>
                              <textarea
                                value={edu.achievements}
                                onChange={(e) => updateEducation(index, 'achievements', e.target.value)}
                                className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none resize-none focus:ring-2 focus:ring-[#17960b]"
                                rows={3}
                                placeholder="Well-documented educational background: Include CGPA, Dean's List, scholarships, awards, honors, etc."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={addEducation}
                        className="w-full border-2 border-dashed border-[#17960b] rounded-lg py-3 text-[#17960b] font-semibold flex items-center justify-center gap-2 hover:bg-[#17960b]/5 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        Add Another Education
                      </button>
                    </div>
                  </>
                )}

                {/* Step 4: Skills */}
                {currentStep === 4 && (
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
                              <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => updateSkill(index, 'name', e.target.value)}
                                className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                placeholder="Technical: e.g., Microsoft Excel, Programming | Soft: e.g., Communication, Leadership, Languages"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">Category</label>
                                <select
                                  value={skill.category}
                                  onChange={(e) => updateSkill(index, 'category', e.target.value as 'technical' | 'soft')}
                                  className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                >
                                  <option value="technical">Technical</option>
                                  <option value="soft">Soft</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">Proficiency</label>
                                <select
                                  value={skill.level}
                                  onChange={(e) => updateSkill(index, 'level', e.target.value)}
                                  className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                >
                                  <option value="Beginner">Beginner</option>
                                  <option value="Intermediate">Intermediate</option>
                                  <option value="Advanced">Advanced</option>
                                  <option value="Expert">Expert</option>
                                </select>
                              </div>
                            </div>
                            {skills.length > 1 && (
                              <div className="flex justify-end">
                                <button
                                  onClick={() => removeSkill(index)}
                                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                                  aria-label="Remove skill"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={addSkill}
                        className="w-full border-2 border-dashed border-[#17960b] rounded-lg py-3 text-[#17960b] font-semibold flex items-center justify-center gap-2 hover:bg-[#17960b]/5 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        Add Another Skill
                      </button>
                    </div>
                  </>
                )}

                {/* Step 5: Certifications */}
                {currentStep === 5 && (
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
                              <button
                                onClick={() => removeCertification(index)}
                                className="text-red-600 hover:text-red-700 p-2"
                                aria-label="Remove certification"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Certification Name</label>
                              <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => updateCertification(index, 'name', e.target.value)}
                                className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                placeholder="Add industry-specific certifications to stand out (e.g., Certification of Master Plumbing)"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Type</label>
                              <select
                                value={cert.type}
                                onChange={(e) => updateCertification(index, 'type', e.target.value as 'certificate' | 'training')}
                                className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                              >
                                <option value="certificate">Certificate</option>
                                <option value="training">Training</option>
                              </select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">Issuing Organization</label>
                                <input
                                  type="text"
                                  value={cert.organization}
                                  onChange={(e) => updateCertification(index, 'organization', e.target.value)}
                                  className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                  placeholder="e.g., Philippine Tubero Association"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#364153] mb-2">Date Issued</label>
                                <div className="relative">
                                  <input
                                    type="date"
                                    value={cert.dateIssued}
                                    onChange={(e) => updateCertification(index, 'dateIssued', e.target.value)}
                                    className="w-full bg-[#f3f3f5] rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 border-0 outline-none focus:ring-2 focus:ring-[#17960b]"
                                  />
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#364153] mb-2">Proof of Certification (Optional)</label>
                              <div className="flex items-center gap-3">
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
                              </div>
                              {cert.proofFileName && (
                                <p className="text-xs text-[#4a5565] mt-2">
                                  Selected: {cert.proofFileName}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={addCertification}
                        className="w-full border-2 border-dashed border-[#17960b] rounded-lg py-3 text-[#17960b] font-semibold flex items-center justify-center gap-2 hover:bg-[#17960b]/5 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        Add Another Certification
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
                  <button
                    onClick={handleNext}
                    className="px-6 sm:px-8 py-2.5 bg-[#17960b] text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-[#148509] transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 sm:px-8 py-2.5 bg-[#17960b] text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-[#148509] transition-colors"
                  >
                    Submit Resume
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
                    {/* Download Dropdown */}
                    <button 
                      onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                      className="bg-[#17960b] text-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-semibold hover:bg-[#148509] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      DOWNLOAD
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showDownloadDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowDownloadDropdown(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                          <button
                            onClick={() => {
                              alert('Downloading as PDF...');
                              setShowDownloadDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-[#364153] transition-colors flex items-center gap-3"
                          >
                            <FileText className="w-4 h-4 text-[#17960b]" />
                            Download as PDF
                          </button>
                          <button
                            onClick={() => {
                              alert('Downloading as DOC...');
                              setShowDownloadDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-[#364153] transition-colors flex items-center gap-3"
                          >
                            <FileText className="w-4 h-4 text-[#17960b]" />
                            Download as DOC
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Page Preview Container */}
              <div className="bg-gray-100 p-4 sm:p-6 rounded-b-lg shadow-sm">
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
                  <ResumePreview />
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
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowUploadModal(false)}
          />
          
          {/* Modal */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
              {/* Close Button */}
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <div className="w-14 h-14 bg-[#ffca1a] rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-7 h-7 text-[#101828]" />
                </div>
                <h2 className="text-2xl font-semibold text-[#101828] mb-2">Upload Your CV</h2>
                <p className="text-sm text-[#4a5565]">
                  Upload your resume and we'll automatically fill in your information
                </p>
              </div>

              {/* Upload Area */}
              <div className="mb-6">
                <label 
                  htmlFor="cv-upload"
                  className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#17960b] transition-colors cursor-pointer group"
                >
                  <input 
                    id="cv-upload" 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <FileText className="w-12 h-12 text-gray-400 group-hover:text-[#17960b] mx-auto mb-3 transition-colors" />
                  <p className="text-base font-medium text-[#101828] mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-[#4a5565]">
                    PDF, DOC, or DOCX (max. 10MB)
                  </p>
                </label>
              </div>

              {/* Supported Formats */}
              <div className="bg-[#f9fafb] rounded-lg p-4 mb-6">
                <p className="text-xs font-semibold text-[#364153] mb-2">Supported Formats:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-xs font-medium text-[#4a5565] border border-gray-200">
                    <Check className="w-3 h-3 text-[#17960b]" />
                    PDF
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-xs font-medium text-[#4a5565] border border-gray-200">
                    <Check className="w-3 h-3 text-[#17960b]" />
                    DOC
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-xs font-medium text-[#4a5565] border border-gray-200">
                    <Check className="w-3 h-3 text-[#17960b]" />
                    DOCX
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-[#364153] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadClick}
                  className="flex-1 px-6 py-3 bg-[#17960b] text-white rounded-lg font-semibold hover:bg-[#148509] transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Browse Files
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
