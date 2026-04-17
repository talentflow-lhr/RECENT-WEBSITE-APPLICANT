import { User, Mail, Phone, MapPin, Lock, FileText, Check, X, Calendar, AlertCircle, Briefcase, Edit2, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { useAuth } from "./AuthPass";
import { useState, useEffect } from 'react';

interface Applicant {
  app_first_name?: string;
  app_middle_name?: string;
  app_last_name?: string;
  app_email?: string;
  app_present_tele_mobile?: string;
  app_present_address_country?: string;
  app_present_address_province?: string;
  app_present_address_city?: string;
  app_dob_day?: string;
  app_dob_month?: string;
  app_dob_year?: string;
  app_marital_status?: string;
  app_height?: string;
  app_weight?: string;
  app_passport_number?: string;
  app_passport_place?: string;
  app_passport_issue_date?: string;
  app_passport_expiry_date?: string;
  app_nationality?: string;
  app_preference?: string[];
}

interface Account {
  account_id: number;
  applicant_id: number;
  acc_username: string;
  acc_email: string;
  is_active: boolean;
  acc_password: string;
  // for the other table
  t_applicant?: Applicant;
}

export function ProfileSettings() {
  /*
  const [profile, setProfile] = useState({
    // Basic Information
    firstName: 'John',
    middleName: '',
    lastName: 'Doe',
    birthDay: '15',
    birthMonth: '06',
    birthYear: '1995',
    username: 'johndoe',
    nationality: 'Filipino',
    email: 'john.doe@email.com',
    phone: '09345234576',
    
    // Physical Information
    maritalStatus: 'single',
    height: '175',
    weight: '70',
    
    // Preferred Job Fields
    preferredJobFields: ['Healthcare', 'Information Technology'] as string[],
    
    // Present Address
    country: 'Philippines',
    province: 'Metro Manila',
    city: 'Manila',
    
    // Emergency Contact
    emergencyContactName: 'Jane Doe',
    emergencyRelationship: 'sibling',
    emergencyContactNumber: '09123456789',
    
    // Provincial Address
    provincialCountry: 'Philippines',
    provincialProvince: 'Cebu',
    provincialCity: 'Cebu City',
    provincialContactPerson: 'Maria Doe',
    provincialMobile: '09987654321',
    
    // Passport Information
    passportNumber: 'P1234567',
    passportPlace: 'Manila, Philippines',
    passportIssueDate: '2020-01-15',
    passportExpiryDate: '2030-01-15',
    passportPicture:'';
    
    // Password
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });*/

  const { account } = useAuth();

  const [profile, setProfile] = useState({
      firstName: '',
      middleName: '',
      lastName: '',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      username: '',
      nationality: '',
      email: '',
      phone: '',
      maritalStatus: '',
      height: '',
      weight: '',
      preferredJobFields: [] as string[],
      country: '',
      province: '',
      city: '',
      emergencyContactName: '',
      emergencyRelationship: '',
      emergencyContactNumber: '',
      provincialCountry: '',
      provincialProvince: '',
      provincialCity: '',
      provincialContactPerson: '',
      provincialMobile: '',
      passportNumber: '',
      passportPlace: '',
      passportIssueDate: '',
      passportExpiryDate: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

     useEffect(() => {
      if (!account) return;
    
      const applicant = account.t_applicant;
    
      setProfile(prev => ({
        ...prev,
    
        // 🔥 FROM t_account
        username: account.acc_username || '',
        email: account.acc_email || applicant?.app_email || '',
    
        // 🔥 FROM t_applicant
        firstName: applicant?.app_first_name || '',
        middleName: applicant?.app_middle_name || '',
        lastName: applicant?.app_last_name || '',
        phone: applicant?.app_present_tele_mobile || '',
    
        country: applicant?.app_present_address_country || '',
        province: applicant?.app_present_address_province || '',
        city: applicant?.app_present_address_city || '',
    
        birthDay: applicant?.app_dob_day || '',
        birthMonth: applicant?.app_dob_month || '',
        birthYear: applicant?.app_dob_year || '',
    
        maritalStatus: applicant?.app_marital_status || '',
        height: applicant?.app_height || '',
        weight: applicant?.app_weight || '',
    
        passportNumber: applicant?.app_passport_number || '',
        passportPlace: applicant?.app_passport_place || '',
        passportIssueDate: applicant?.app_passport_issue_date || '',
        passportExpiryDate: applicant?.app_passport_expiry_date || '',
    
        nationality: applicant?.app_nationality || '',
        preferredJobFields: applicant?.app_preference || [],
      }));
    }, [account]);
  
  // Editing states for each section
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempProfile, setTempProfile] = useState(profile);
  
  const [sameAsPresent, setSameAsPresent] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [passportUploaded, setPassportUploaded] = useState(false);
  const [passportFileName, setPassportFileName] = useState('');

  // Mock list of taken usernames
  const takenUsernames = ['admin', 'user', 'test', 'john', 'jane', 'naomi', 'landbase'];

  const checkUsername = (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setUsernameChecking(true);
    
    setTimeout(() => {
      const isTaken = takenUsernames.includes(username.toLowerCase());
      setUsernameAvailable(!isTaken);
      setUsernameChecking(false);
    }, 500);
  };

  const handleUsernameChange = (value: string) => {
    setTempProfile({ ...tempProfile, username: value });
    setUsernameAvailable(null);
    if (value.length >= 3) {
      checkUsername(value);
    }
  };

  const handleEdit = (section: string) => {
    setEditingSection(section);
    setTempProfile(profile);
  };

  const handleSave = async (section: string) => {
    if (!user) return;
  
    const { error } = await supabase
      .from('profiles')
      .update(tempProfile)
      .eq('id', user.id);
  
    if (error) {
      console.error(error);
      alert("Failed to save");
      return;
    }

  setProfile(tempProfile);
  setEditingSection(null);
};

  const handleCancel = () => {
    setTempProfile(profile);
    setEditingSection(null);
    setUsernameAvailable(null);
  };

  const handleSameAsPresent = (checked: boolean) => {
    setSameAsPresent(checked);
    if (checked) {
      setTempProfile({
        ...tempProfile,
        provincialCountry: tempProfile.country,
        provincialProvince: tempProfile.province,
        provincialCity: tempProfile.city,
        provincialContactPerson: tempProfile.emergencyContactName,
        provincialMobile: tempProfile.emergencyContactNumber,
      });
    }
  };

  const handleJobFieldToggle = (field: string) => {
    const currentFields = tempProfile.preferredJobFields;
    if (currentFields.includes(field)) {
      setTempProfile({
        ...tempProfile,
        preferredJobFields: currentFields.filter(f => f !== field)
      });
    } else {
      setTempProfile({
        ...tempProfile,
        preferredJobFields: [...currentFields, field]
      });
    }
  };

  const jobCategories = [
    'Healthcare',
    'Construction',
    'Hospitality',
    'Information Technology',
    'Education',
    'Manufacturing',
    'Retail & Sales',
    'Transportation & Logistics',
    'Finance & Accounting',
    'Food & Beverage',
    'Customer Service',
    'Security & Safety',
    'Engineering',
    'Administrative & Clerical',
    'Agriculture',
    'Real Estate',
  ];

  const handlePassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid passport image (JPG, PNG) or PDF');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setPassportUploaded(true);
      setPassportFileName(file.name);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        {/* Basic Information Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-[#17960b]" />
              Basic Information
            </h2>
            {editingSection !== 'basic' ? (
              <button
                onClick={() => handleEdit('basic')}
                className="flex items-center gap-2 px-4 py-2 text-[#17960b] hover:bg-green-50 rounded-lg transition-colors font-semibold"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('basic')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#17960b] text-white hover:bg-[#0d5e06] rounded-lg transition-colors font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {editingSection === 'basic' ? (
            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tempProfile.firstName}
                    onChange={(e) => setTempProfile({ ...tempProfile, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={tempProfile.middleName}
                    onChange={(e) => setTempProfile({ ...tempProfile, middleName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tempProfile.lastName}
                    onChange={(e) => setTempProfile({ ...tempProfile, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={tempProfile.birthDay}
                    onChange={(e) => setTempProfile({ ...tempProfile, birthDay: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day.toString().padStart(2, '0')}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <select
                    value={tempProfile.birthMonth}
                    onChange={(e) => setTempProfile({ ...tempProfile, birthMonth: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  >
                    <option value="">Month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  <select
                    value={tempProfile.birthYear}
                    onChange={(e) => setTempProfile({ ...tempProfile, birthYear: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Username and Nationality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tempProfile.username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                      placeholder="johndoe"
                    />
                    {usernameChecking && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.928l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                    {usernameAvailable === true && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                    )}
                    {usernameAvailable === false && (
                      <X className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
                    )}
                  </div>
                  {tempProfile.username && tempProfile.username.length > 0 && tempProfile.username.length < 3 && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Username must be at least 3 characters
                    </p>
                  )}
                  {usernameAvailable === true && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Username is available
                    </p>
                  )}
                  {usernameAvailable === false && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" />
                      This username is already taken.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={tempProfile.nationality}
                    onChange={(e) => setTempProfile({ ...tempProfile, nationality: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  >
                    <option value="Filipino">Filipino</option>
                    <option value="American">American</option>
                    <option value="British">British</option>
                    <option value="Canadian">Canadian</option>
                    <option value="Australian">Australian</option>
                  </select>
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={tempProfile.email}
                      onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                      placeholder="john.doe@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={tempProfile.phone}
                      onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                      placeholder="09345234576"
                    />
                  </div>
                </div>
              </div>

              {/* Marital Status, Height, Weight */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Marital Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={tempProfile.maritalStatus}
                    onChange={(e) => setTempProfile({ ...tempProfile, maritalStatus: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="widowed">Widowed</option>
                    <option value="separated">Separated</option>
                    <option value="divorced">Divorced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Height (cm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={tempProfile.height}
                    onChange={(e) => setTempProfile({ ...tempProfile, height: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                    placeholder="175"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={tempProfile.weight}
                    onChange={(e) => setTempProfile({ ...tempProfile, weight: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                    placeholder="70"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <p className="text-gray-900 font-medium">{profile.firstName} {profile.middleName} {profile.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                <p className="text-gray-900 font-medium">
                  {profile.birthDay && profile.birthMonth && profile.birthYear 
                    ? `${profile.birthMonth}/${profile.birthDay}/${profile.birthYear}`
                    : 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Username</p>
                <p className="text-gray-900 font-medium">{profile.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Nationality</p>
                <p className="text-gray-900 font-medium">{profile.nationality}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <p className="text-gray-900 font-medium">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Mobile Number</p>
                <p className="text-gray-900 font-medium">{profile.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Marital Status</p>
                <p className="text-gray-900 font-medium capitalize">{profile.maritalStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Height & Weight</p>
                <p className="text-gray-900 font-medium">{profile.height} cm, {profile.weight} kg</p>
              </div>
            </div>
          )}
        </div>

        {/* Preferred Job Fields Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 text-lg font-semibold flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#17960b]" />
              Preferred Job Fields
            </h2>
            {editingSection !== 'jobs' ? (
              <button
                onClick={() => handleEdit('jobs')}
                className="flex items-center gap-2 px-4 py-2 text-[#17960b] hover:bg-green-50 rounded-lg transition-colors font-semibold"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('jobs')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#17960b] text-white hover:bg-[#0d5e06] rounded-lg transition-colors font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {editingSection === 'jobs' ? (
            <>
              <p className="text-gray-600 mb-6 text-sm">
                Select one or more job fields that match your interests and expertise.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {jobCategories.map((category) => (
                  <label
                    key={category}
                    className={`
                      flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${
                        tempProfile.preferredJobFields.includes(category)
                          ? 'border-[#17960b] bg-green-50'
                          : 'border-gray-300 bg-white hover:border-[#ffca1a] hover:bg-yellow-50'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={tempProfile.preferredJobFields.includes(category)}
                      onChange={() => handleJobFieldToggle(category)}
                      className="w-5 h-5 accent-[#17960b] rounded cursor-pointer"
                    />
                    <span className={`font-medium ${
                      tempProfile.preferredJobFields.includes(category)
                        ? 'text-[#17960b]'
                        : 'text-gray-700'
                    }`}>
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.preferredJobFields.length > 0 ? (
                profile.preferredJobFields.map((field) => (
                  <span
                    key={field}
                    className="inline-flex items-center px-4 py-2 bg-[#17960b] text-white rounded-full text-sm font-medium"
                  >
                    {field}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No job fields selected</p>
              )}
            </div>
          )}
        </div>

        {/* Present Address Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#17960b]" />
              Present Address
            </h2>
            {editingSection !== 'address' ? (
              <button
                onClick={() => handleEdit('address')}
                className="flex items-center gap-2 px-4 py-2 text-[#17960b] hover:bg-green-50 rounded-lg transition-colors font-semibold"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('address')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#17960b] text-white hover:bg-[#0d5e06] rounded-lg transition-colors font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {editingSection === 'address' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tempProfile.country}
                  onChange={(e) => setTempProfile({ ...tempProfile, country: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  placeholder="Philippines"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Province <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tempProfile.province}
                  onChange={(e) => setTempProfile({ ...tempProfile, province: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  placeholder="Metro Manila"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tempProfile.city}
                  onChange={(e) => setTempProfile({ ...tempProfile, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  placeholder="Manila"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Country</p>
                <p className="text-gray-900 font-medium">{profile.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Province</p>
                <p className="text-gray-900 font-medium">{profile.province}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">City</p>
                <p className="text-gray-900 font-medium">{profile.city}</p>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Contact Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 text-lg font-semibold flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#17960b]" />
              Emergency Contact
            </h2>
            {editingSection !== 'emergency' ? (
              <button
                onClick={() => handleEdit('emergency')}
                className="flex items-center gap-2 px-4 py-2 text-[#17960b] hover:bg-green-50 rounded-lg transition-colors font-semibold"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('emergency')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#17960b] text-white hover:bg-[#0d5e06] rounded-lg transition-colors font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {editingSection === 'emergency' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tempProfile.emergencyContactName}
                  onChange={(e) => setTempProfile({ ...tempProfile, emergencyContactName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <select
                  value={tempProfile.emergencyRelationship}
                  onChange={(e) => setTempProfile({ ...tempProfile, emergencyRelationship: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                >
                  <option value="mother">Mother</option>
                  <option value="father">Father</option>
                  <option value="spouse">Spouse</option>
                  <option value="sibling">Sibling</option>
                  <option value="child">Child</option>
                  <option value="guardian">Guardian</option>
                  <option value="friend">Friend</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={tempProfile.emergencyContactNumber}
                    onChange={(e) => setTempProfile({ ...tempProfile, emergencyContactNumber: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                    placeholder="09XXXXXXXXX"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Contact Person</p>
                <p className="text-gray-900 font-medium">{profile.emergencyContactName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Relationship</p>
                <p className="text-gray-900 font-medium capitalize">{profile.emergencyRelationship}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Mobile Number</p>
                <p className="text-gray-900 font-medium">{profile.emergencyContactNumber}</p>
              </div>
            </div>
          )}
        </div>

        {/* Provincial Address Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#17960b]" />
              Provincial Address
            </h2>
            {editingSection !== 'provincial' ? (
              <button
                onClick={() => handleEdit('provincial')}
                className="flex items-center gap-2 px-4 py-2 text-[#17960b] hover:bg-green-50 rounded-lg transition-colors font-semibold"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('provincial')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#17960b] text-white hover:bg-[#0d5e06] rounded-lg transition-colors font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {editingSection === 'provincial' && (
            <label className="flex items-center gap-2 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={sameAsPresent}
                onChange={(e) => handleSameAsPresent(e.target.checked)}
                className="w-4 h-4 accent-[#17960b] rounded"
              />
              <span className="text-sm text-gray-700 font-medium">Same as present address</span>
            </label>
          )}

          {editingSection === 'provincial' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tempProfile.provincialCountry}
                    onChange={(e) => setTempProfile({ ...tempProfile, provincialCountry: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent disabled:bg-gray-100"
                    placeholder="Philippines"
                    disabled={sameAsPresent}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Province <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tempProfile.provincialProvince}
                    onChange={(e) => setTempProfile({ ...tempProfile, provincialProvince: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent disabled:bg-gray-100"
                    placeholder="Cebu"
                    disabled={sameAsPresent}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tempProfile.provincialCity}
                    onChange={(e) => setTempProfile({ ...tempProfile, provincialCity: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent disabled:bg-gray-100"
                    placeholder="Cebu City"
                    disabled={sameAsPresent}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tempProfile.provincialContactPerson}
                    onChange={(e) => setTempProfile({ ...tempProfile, provincialContactPerson: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent disabled:bg-gray-100"
                    placeholder="Full name"
                    disabled={sameAsPresent}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={tempProfile.provincialMobile}
                      onChange={(e) => setTempProfile({ ...tempProfile, provincialMobile: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent disabled:bg-gray-100"
                      placeholder="09XXXXXXXXX"
                      disabled={sameAsPresent}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Country</p>
                <p className="text-gray-900 font-medium">{profile.provincialCountry}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Province</p>
                <p className="text-gray-900 font-medium">{profile.provincialProvince}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">City</p>
                <p className="text-gray-900 font-medium">{profile.provincialCity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Contact Person</p>
                <p className="text-gray-900 font-medium">{profile.provincialContactPerson}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Mobile Number</p>
                <p className="text-gray-900 font-medium">{profile.provincialMobile}</p>
              </div>
            </div>
          )}
        </div>

        {/* Passport Information Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#17960b]" />
              Passport Information
            </h2>
            {editingSection !== 'passport' ? (
              <button
                onClick={() => handleEdit('passport')}
                className="flex items-center gap-2 px-4 py-2 text-[#17960b] hover:bg-green-50 rounded-lg transition-colors font-semibold"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('passport')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#17960b] text-white hover:bg-[#0d5e06] rounded-lg transition-colors font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {editingSection === 'passport' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Passport Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tempProfile.passportNumber}
                    onChange={(e) => setTempProfile({ ...tempProfile, passportNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                    placeholder="P1234567"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Place of Issue <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tempProfile.passportPlace}
                    onChange={(e) => setTempProfile({ ...tempProfile, passportPlace: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                    placeholder="Manila, Philippines"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Issue Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={tempProfile.passportIssueDate}
                    onChange={(e) => setTempProfile({ ...tempProfile, passportIssueDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={tempProfile.passportExpiryDate}
                    onChange={(e) => setTempProfile({ ...tempProfile, passportExpiryDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Upload Passport <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      id="passport-upload"
                      accept="image/jpeg, image/png, image/jpg, application/pdf"
                      onChange={handlePassportUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="passport-upload"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ffca1a] to-[#17960b] text-white font-semibold rounded-lg cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                      <Upload className="w-5 h-5" />
                      Choose File
                    </label>
                    {passportFileName && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                        <ImageIcon className="w-5 h-5 text-[#17960b]" />
                        <span className="text-sm text-gray-700 font-medium truncate">{passportFileName}</span>
                      </div>
                    )}
                    {!passportFileName && (
                      <p className="text-xs text-gray-500">Accepted formats: JPG, PNG, PDF (Max 5MB)</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Passport Number</p>
                <p className="text-gray-900 font-medium">{profile.passportNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Place of Issue</p>
                <p className="text-gray-900 font-medium">{profile.passportPlace}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Issue Date</p>
                <p className="text-gray-900 font-medium">{profile.passportIssueDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Expiry Date</p>
                <p className="text-gray-900 font-medium">{profile.passportExpiryDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Passport Document</p>
                <div className="flex items-center gap-2">
                  {passportUploaded || passportFileName ? (
                    <>
                      <ImageIcon className="w-5 h-5 text-[#17960b]" />
                      <p className="text-gray-900 font-medium">{passportFileName || 'Passport uploaded'}</p>
                    </>
                  ) : (
                    <p className="text-gray-500">No document uploaded</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 text-lg font-semibold flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#17960b]" />
              Change Password
            </h2>
            {editingSection !== 'password' ? (
              <button
                onClick={() => handleEdit('password')}
                className="flex items-center gap-2 px-4 py-2 text-[#17960b] hover:bg-green-50 rounded-lg transition-colors font-semibold"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('password')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#17960b] text-white hover:bg-[#0d5e06] rounded-lg transition-colors font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {editingSection === 'password' ? (
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={tempProfile.currentPassword}
                  onChange={(e) => setTempProfile({ ...tempProfile, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={tempProfile.newPassword}
                  onChange={(e) => setTempProfile({ ...tempProfile, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={tempProfile.confirmPassword}
                  onChange={(e) => setTempProfile({ ...tempProfile, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Click edit to change your password</p>
          )}
        </div>
      </div>
    </div>
  );
}
