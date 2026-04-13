import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ResumeData } from './ResumeBuilder';
import { Info, User, Mail, Phone, MapPin, Upload, FileText, Check, X, Calendar } from 'lucide-react';
import { useState } from 'react';

interface PersonalInfoFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onNext: () => void;
}

export function PersonalInfoForm({ data, onChange, onNext }: PersonalInfoFormProps) {
  const [sameAsPresent, setSameAsPresent] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [passportUploaded, setPassportUploaded] = useState(false);

  // Mock list of taken usernames
  const takenUsernames = ['admin', 'user', 'test', 'john', 'jane', 'naomi', 'landbase'];

  const handleChange = (field: keyof ResumeData, value: string) => {
    onChange({ ...data, [field]: value });
  };

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
    handleChange('username', value);
    setUsernameAvailable(null);
    if (value.length >= 3) {
      checkUsername(value);
    }
  };

  const handleSameAsPresent = (checked: boolean) => {
    setSameAsPresent(checked);
    if (checked) {
      handleChange('provincialCountry', data.country || '');
      handleChange('provincialProvince', data.province || '');
      handleChange('provincialCity', data.city || '');
      handleChange('provincialContactPerson', data.emergencyContactName || '');
      handleChange('provincialMobile', data.emergencyContactNumber || '');
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
      // In a real app, you would upload the file and get the URL
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-2">Personal Information</h2>
          <p className="text-gray-600">Complete your personal details for your profile.</p>
        </div>
        <div className="bg-[#ffca1a] text-gray-900 px-3 py-1 rounded flex items-center gap-1.5">
          <Info className="w-4 h-4" />
          <span className="font-semibold">STEP 1</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#17960b]" />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-gray-700 font-medium">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={data.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Enter first name"
                className="mt-1.5 h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="middleName" className="text-gray-700 font-medium">
                Middle Name
              </Label>
              <Input
                id="middleName"
                value={data.middleName || ''}
                onChange={(e) => handleChange('middleName', e.target.value)}
                placeholder="Enter middle name"
                className="mt-1.5 h-11"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-gray-700 font-medium">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={data.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Enter last name"
                className="mt-1.5 h-11"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label className="text-gray-700 font-medium mb-2 block">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Select 
                    value={data.birthDay || ''} 
                    onValueChange={(value) => handleChange('birthDay', value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <SelectItem key={day} value={day.toString().padStart(2, '0')}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select 
                    value={data.birthMonth || ''} 
                    onValueChange={(value) => handleChange('birthMonth', value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="01">January</SelectItem>
                      <SelectItem value="02">February</SelectItem>
                      <SelectItem value="03">March</SelectItem>
                      <SelectItem value="04">April</SelectItem>
                      <SelectItem value="05">May</SelectItem>
                      <SelectItem value="06">June</SelectItem>
                      <SelectItem value="07">July</SelectItem>
                      <SelectItem value="08">August</SelectItem>
                      <SelectItem value="09">September</SelectItem>
                      <SelectItem value="10">October</SelectItem>
                      <SelectItem value="11">November</SelectItem>
                      <SelectItem value="12">December</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select 
                    value={data.birthYear || ''} 
                    onValueChange={(value) => handleChange('birthYear', value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="username" className="text-gray-700 font-medium">
                Username <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  value={data.username || ''}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder="Choose a username"
                  className="mt-1.5 h-11 pr-10"
                  required
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
              {data.username && data.username.length > 0 && data.username.length < 3 && (
                <p className="text-xs text-gray-500 mt-1">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  value={data.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="john.doe@email.com"
                  className="mt-1.5 h-11 pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="mobile" className="text-gray-700 font-medium">
                Mobile/Tel Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="mobile"
                  value={data.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="09345234576"
                  className="mt-1.5 h-11 pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="maritalStatus" className="text-gray-700 font-medium">
                Marital Status <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={data.maritalStatus || ''} 
                onValueChange={(value) => handleChange('maritalStatus', value)}
              >
                <SelectTrigger className="mt-1.5 h-11">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height" className="text-gray-700 font-medium">
                  Height (cm) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={data.height || ''}
                  onChange={(e) => handleChange('height', e.target.value)}
                  placeholder="170"
                  className="mt-1.5 h-11"
                  required
                />
              </div>
              <div>
                <Label htmlFor="weight" className="text-gray-700 font-medium">
                  Weight (kg) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="weight"
                  type="number"
                  value={data.weight || ''}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  placeholder="65"
                  className="mt-1.5 h-11"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Present Address Section */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#17960b]" />
            Present Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="country" className="text-gray-700 font-medium">
                Country <span className="text-red-500">*</span>
              </Label>
              <Input
                id="country"
                value={data.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                placeholder="Philippines"
                className="mt-1.5 h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="province" className="text-gray-700 font-medium">
                Province <span className="text-red-500">*</span>
              </Label>
              <Input
                id="province"
                value={data.province || ''}
                onChange={(e) => handleChange('province', e.target.value)}
                placeholder="Metro Manila"
                className="mt-1.5 h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-gray-700 font-medium">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                value={data.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Manila"
                className="mt-1.5 h-11"
                required
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#17960b]" />
            Emergency Contact
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="emergencyContactName" className="text-gray-700 font-medium">
                Contact Person <span className="text-red-500">*</span>
              </Label>
              <Input
                id="emergencyContactName"
                value={data.emergencyContactName || ''}
                onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                placeholder="Full name"
                className="mt-1.5 h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="emergencyRelationship" className="text-gray-700 font-medium">
                Relationship <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={data.emergencyRelationship || ''} 
                onValueChange={(value) => handleChange('emergencyRelationship', value)}
              >
                <SelectTrigger className="mt-1.5 h-11">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mother">Mother</SelectItem>
                  <SelectItem value="father">Father</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="guardian">Guardian</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="emergencyContactNumber" className="text-gray-700 font-medium">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="emergencyContactNumber"
                  value={data.emergencyContactNumber || ''}
                  onChange={(e) => handleChange('emergencyContactNumber', e.target.value)}
                  placeholder="09XXXXXXXXX"
                  className="mt-1.5 h-11 pl-10"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Provincial Address Section */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#17960b]" />
              Provincial Address
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sameAsPresent}
                onChange={(e) => handleSameAsPresent(e.target.checked)}
                className="w-4 h-4 accent-[#17960b] rounded"
              />
              <span className="text-sm text-gray-700">Same as present address</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="provincialCountry" className="text-gray-700 font-medium">
                Country <span className="text-red-500">*</span>
              </Label>
              <Input
                id="provincialCountry"
                value={data.provincialCountry || ''}
                onChange={(e) => handleChange('provincialCountry', e.target.value)}
                placeholder="Philippines"
                className="mt-1.5 h-11"
                disabled={sameAsPresent}
                required
              />
            </div>
            <div>
              <Label htmlFor="provincialProvince" className="text-gray-700 font-medium">
                Province <span className="text-red-500">*</span>
              </Label>
              <Input
                id="provincialProvince"
                value={data.provincialProvince || ''}
                onChange={(e) => handleChange('provincialProvince', e.target.value)}
                placeholder="Cebu"
                className="mt-1.5 h-11"
                disabled={sameAsPresent}
                required
              />
            </div>
            <div>
              <Label htmlFor="provincialCity" className="text-gray-700 font-medium">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="provincialCity"
                value={data.provincialCity || ''}
                onChange={(e) => handleChange('provincialCity', e.target.value)}
                placeholder="Cebu City"
                className="mt-1.5 h-11"
                disabled={sameAsPresent}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="provincialContactPerson" className="text-gray-700 font-medium">
                Contact Person <span className="text-red-500">*</span>
              </Label>
              <Input
                id="provincialContactPerson"
                value={data.provincialContactPerson || ''}
                onChange={(e) => handleChange('provincialContactPerson', e.target.value)}
                placeholder="Full name"
                className="mt-1.5 h-11"
                disabled={sameAsPresent}
                required
              />
            </div>
            <div>
              <Label htmlFor="provincialMobile" className="text-gray-700 font-medium">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="provincialMobile"
                  value={data.provincialMobile || ''}
                  onChange={(e) => handleChange('provincialMobile', e.target.value)}
                  placeholder="09XXXXXXXXX"
                  className="mt-1.5 h-11 pl-10"
                  disabled={sameAsPresent}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Passport Information Section */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#17960b]" />
            Passport Information
          </h3>

          <div className="mb-4">
            <Label className="text-gray-700 font-medium mb-2 block">
              Upload Passport <span className="text-red-500">*</span>
            </Label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-in fade-in duration-300">
              <div>
                <Label htmlFor="passportNumber" className="text-gray-700 font-medium">
                  Passport Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="passportNumber"
                  value={data.passportNumber || ''}
                  onChange={(e) => handleChange('passportNumber', e.target.value)}
                  placeholder="P1234567"
                  className="mt-1.5 h-11"
                  required
                />
              </div>
              <div>
                <Label htmlFor="passportPlace" className="text-gray-700 font-medium">
                  Place of Issue <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="passportPlace"
                  value={data.passportPlace || ''}
                  onChange={(e) => handleChange('passportPlace', e.target.value)}
                  placeholder="Manila, Philippines"
                  className="mt-1.5 h-11"
                  required
                />
              </div>
              <div>
                <Label htmlFor="passportIssueDate" className="text-gray-700 font-medium">
                  Issue Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="passportIssueDate"
                    type="date"
                    value={data.passportIssueDate || ''}
                    onChange={(e) => handleChange('passportIssueDate', e.target.value)}
                    className="mt-1.5 h-11 pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="passportExpiryDate" className="text-gray-700 font-medium">
                  Expiry Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="passportExpiryDate"
                    type="date"
                    value={data.passportExpiryDate || ''}
                    onChange={(e) => handleChange('passportExpiryDate', e.target.value)}
                    className="mt-1.5 h-11 pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Button
          onClick={onNext}
          className="w-full sm:w-auto bg-[#17960b] hover:bg-[#17960b]/90 text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
}