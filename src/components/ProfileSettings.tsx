import { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Lock, Upload, FileText, Check, X, Calendar, AlertCircle, Briefcase } from 'lucide-react';
import { useAuth } from "./AuthPass";
import { useEffect } from 'react';

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
  /***
  const [profile, setProfile] = useState({
    // Basic Information
    firstName: 'John',
    middleName: '',
    lastName: 'Doe',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    username: 'johndoe',
    nationality: 'Filipino',
    email: 'john.doe@email.com',
    phone: '09345234576',
    
    // Physical Information
    maritalStatus: 'single',
    height: '175',
    weight: '70',
    
    // Preferred Job Fields
    preferredJobFields: [] as string[],
    
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
    
    // Password
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });**/

  const { account } = useAuth();

  useEffect(() => {
    if (!account?.t_applicant) return;
  
    const data = account.t_applicant;
  
    setProfile({
      firstName: data.app_first_name || '',
      ...
    });
  }, [account]);

  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [sameAsPresent, setSameAsPresent] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [passportUploaded, setPassportUploaded] = useState(true); // Set to true for demo
  const [passportImage, setPassportImage] = useState<string | null>(null);

  // Mock list of taken usernames
  const takenUsernames = ['admin', 'user', 'test', 'john', 'jane', 'naomi', 'landbase'];

  const checkUsername = (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setUsernameChecking(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const isTaken = takenUsernames.includes(username.toLowerCase());
      setUsernameAvailable(!isTaken);
      setUsernameChecking(false);
    }, 500);
  };

  const handleUsernameChange = (value: string) => {
    setProfile({ ...profile, username: value });
    setUsernameAvailable(null);
    if (value.length >= 3) {
      checkUsername(value);
    }
  };

  const handleSameAsPresent = (checked: boolean) => {
    setSameAsPresent(checked);
    if (checked) {
      setProfile({
        ...profile,
        provincialCountry: profile.country,
        provincialProvince: profile.province,
        provincialCity: profile.city,
        provincialContactPerson: profile.emergencyContactName,
        provincialMobile: profile.emergencyContactNumber,
      });
    }
  };

  const handleJobFieldToggle = (field: string) => {
    const currentFields = profile.preferredJobFields;
    if (currentFields.includes(field)) {
      setProfile({
        ...profile,
        preferredJobFields: currentFields.filter(f => f !== field)
      });
    } else {
      setProfile({
        ...profile,
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

  const handleSave = () => {
    alert('Profile updated successfully!');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      
      // Check file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        alert('Only JPG, PNG, or GIF files are allowed');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid passport image (JPG, PNG) or PDF');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setPassportUploaded(true);
      
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPassportImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
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

        {/* Profile Picture Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-gray-900 mb-6 text-lg font-semibold">Profile Picture</h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-[#ffca1a] to-[#17960b] rounded-full flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <label htmlFor="camera-upload" className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                <Camera className="w-4 h-4 text-gray-600" />
                <input
                  id="camera-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-gray-900 mb-2 font-medium">Update your profile picture</p>
              <p className="text-gray-500 text-sm mb-3">JPG, PNG or GIF. Max size 2MB</p>
              <label htmlFor="photo-upload" className="px-4 py-2 bg-[#ffca1a] hover:bg-[#e6b617] text-gray-900 rounded-lg transition-colors inline-block cursor-pointer font-semibold text-sm">
                Upload Photo
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-gray-900 mb-6 text-lg font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-[#17960b]" />
            Basic Information
          </h2>

          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
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
                  value={profile.middleName}
                  onChange={(e) => setProfile({ ...profile, middleName: e.target.value })}
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
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
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
                <div>
                  <select
                    value={profile.birthDay}
                    onChange={(e) => setProfile({ ...profile, birthDay: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day.toString().padStart(2, '0')}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={profile.birthMonth}
                    onChange={(e) => setProfile({ ...profile, birthMonth: e.target.value })}
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
                </div>
                <div>
                  <select
                    value={profile.birthYear}
                    onChange={(e) => setProfile({ ...profile, birthYear: e.target.value })}
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
                    value={profile.username}
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
                {profile.username && profile.username.length > 0 && profile.username.length < 3 && (
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
                    This username is already taken. Please choose another one.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nationality <span className="text-red-500">*</span>
                </label>
                <select
                  value={profile.nationality}
                  onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                >
                  <option value="Filipino">Filipino</option>
                  <option value="American">American</option>
                  <option value="British">British</option>
                  <option value="Canadian">Canadian</option>
                  <option value="Australian">Australian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Indonesian">Indonesian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Malaysian">Malaysian</option>
                  <option value="Singaporean">Singaporean</option>
                  <option value="Thai">Thai</option>
                  <option value="Vietnamese">Vietnamese</option>
                  <option value="Other">Other</option>
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
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                    placeholder="john.doe@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Mobile/Tel Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
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
                  value={profile.maritalStatus}
                  onChange={(e) => setProfile({ ...profile, maritalStatus: e.target.value })}
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
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: e.target.value })}
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
                  value={profile.weight}
                  onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  placeholder="70"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preferred Job Fields Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-gray-900 mb-4 text-lg font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#17960b]" />
            Preferred Job Fields
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Select one or more job fields that match your interests and expertise. This helps us recommend relevant job opportunities.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {jobCategories.map((category) => (
              <label
                key={category}
                className={`
                  flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${
                    profile.preferredJobFields.includes(category)
                      ? 'border-[#17960b] bg-green-50'
                      : 'border-gray-300 bg-white hover:border-[#ffca1a] hover:bg-yellow-50'
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={profile.preferredJobFields.includes(category)}
                  onChange={() => handleJobFieldToggle(category)}
                  className="w-5 h-5 accent-[#17960b] rounded cursor-pointer"
                />
                <span className={`font-medium ${
                  profile.preferredJobFields.includes(category)
                    ? 'text-[#17960b]'
                    : 'text-gray-700'
                }`}>
                  {category}
                </span>
              </label>
            ))}
          </div>

          {profile.preferredJobFields.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 border-2 border-[#17960b] rounded-lg">
              <p className="text-sm text-gray-700 mb-2 font-medium">
                Selected Fields ({profile.preferredJobFields.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.preferredJobFields.map((field) => (
                  <span
                    key={field}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#17960b] text-white rounded-full text-sm font-medium"
                  >
                    {field}
                    <button
                      onClick={() => handleJobFieldToggle(field)}
                      className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${field}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Present Address Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-gray-900 mb-6 text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#17960b]" />
            Present Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
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
                value={profile.province}
                onChange={(e) => setProfile({ ...profile, province: e.target.value })}
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
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                placeholder="Manila"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-gray-900 mb-6 text-lg font-semibold flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#17960b]" />
            Emergency Contact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={profile.emergencyContactName}
                onChange={(e) => setProfile({ ...profile, emergencyContactName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Relationship <span className="text-red-500">*</span>
              </label>
              <select
                value={profile.emergencyRelationship}
                onChange={(e) => setProfile({ ...profile, emergencyRelationship: e.target.value })}
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
                  value={profile.emergencyContactNumber}
                  onChange={(e) => setProfile({ ...profile, emergencyContactNumber: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  placeholder="09XXXXXXXXX"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Provincial Address Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#17960b]" />
              Provincial Address
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sameAsPresent}
                onChange={(e) => handleSameAsPresent(e.target.checked)}
                className="w-4 h-4 accent-[#17960b] rounded"
              />
              <span className="text-sm text-gray-700 font-medium">Same as present address</span>
            </label>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.provincialCountry}
                  onChange={(e) => setProfile({ ...profile, provincialCountry: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  value={profile.provincialProvince}
                  onChange={(e) => setProfile({ ...profile, provincialProvince: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  value={profile.provincialCity}
                  onChange={(e) => setProfile({ ...profile, provincialCity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  value={profile.provincialContactPerson}
                  onChange={(e) => setProfile({ ...profile, provincialContactPerson: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    value={profile.provincialMobile}
                    onChange={(e) => setProfile({ ...profile, provincialMobile: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="09XXXXXXXXX"
                    disabled={sameAsPresent}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Passport Information Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-gray-900 mb-6 text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#17960b]" />
            Passport Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Upload Passport <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#17960b] transition-colors">
                <input
                  type="file"
                  id="passportUpload"
                  accept="image/*,.pdf"
                  onChange={handlePassportUpload}
                  className="hidden"
                />
                <label
                  htmlFor="passportUpload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  {passportUploaded ? (
                    <>
                      <Check className="w-12 h-12 text-[#17960b]" />
                      <p className="text-[#17960b] font-semibold">Passport uploaded successfully!</p>
                      <p className="text-sm text-gray-500">Click to change</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400" />
                      <p className="text-gray-700 font-medium">Click to upload passport</p>
                      <p className="text-sm text-gray-500">JPG, PNG or PDF (Max 5MB)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {passportUploaded && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Passport Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.passportNumber}
                    onChange={(e) => setProfile({ ...profile, passportNumber: e.target.value })}
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
                    value={profile.passportPlace}
                    onChange={(e) => setProfile({ ...profile, passportPlace: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                    placeholder="Manila, Philippines"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Issue Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={profile.passportIssueDate}
                      onChange={(e) => setProfile({ ...profile, passportIssueDate: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={profile.passportExpiryDate}
                      onChange={(e) => setProfile({ ...profile, passportExpiryDate: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-gray-900 mb-6 text-lg font-semibold flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#17960b]" />
            Change Password
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={profile.currentPassword}
                  onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={profile.newPassword}
                  onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={profile.confirmPassword}
                  onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17960b] focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 bg-[#17960b] hover:bg-[#147509] text-white px-6 py-3 rounded-lg transition-colors font-semibold"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
          <button className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
            Cancel
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 sm:p-6">
          <h3 className="text-gray-900 mb-2 font-semibold">Danger Zone</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
