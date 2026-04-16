import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Check, X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import logo from 'figma:asset/636ded4fbbb48605dae08d3a89a37f53cf3273be.png';
import { ForgotPassword } from './ForgotPassword';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    middleName: '',
    lastName: '',
    signupUsername: '',
    heardFrom: ''
  });

  // Mock list of taken usernames (in real app, this would be checked via API)
  const takenUsernames = ['admin', 'user', 'test', 'john', 'jane', 'naomi', 'landbase'];

  // Password validation function
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('One number');
    }
    
    return errors;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({
      ...formData,
      password: newPassword
    });
    
    // Only validate on signup
    if (!isLogin) {
      setPasswordErrors(validatePassword(newPassword));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation for demo
    if (isLogin) {
      if (formData.username && formData.password) {
        onLogin();
      }
    } else {
      if (formData.firstName && formData.lastName && formData.email && formData.password && formData.confirmPassword) {
        if (!usernameAvailable) {
          alert('Please choose an available username');
          return;
        }
        
        // Validate password requirements
        const errors = validatePassword(formData.password);
        if (errors.length > 0) {
          alert('Password must meet all requirements: ' + errors.join(', '));
          return;
        }
        
        if (formData.password === formData.confirmPassword) {
          onLogin();
        } else {
          alert('Passwords do not match!');
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      heardFrom: value
    });
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

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setFormData({
      ...formData,
      signupUsername: username
    });
    
    // Reset availability state
    setUsernameAvailable(null);
    
    // Check username availability
    if (username.length >= 3) {
      checkUsername(username);
    }
  };

  return (
    <>
      {showForgotPassword ? (
        <ForgotPassword onBack={() => setShowForgotPassword(false)} />
      ) : (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7f0] to-[#e8f5e3] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-4 sm:space-y-6">
          <div className="flex justify-center lg:justify-start">
            <img src={logo} alt="Landbase HR" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#17960b] mb-3 sm:mb-4">
              Welcome to Landbase HR Portal
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 font-medium">
              Recruiting the right people with the right skills at the right time
            </p>
          </div>
          <div className="hidden lg:block space-y-4 text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#17960b] rounded-full mt-2"></div>
              <p className="text-base">Browse thousands of job opportunities worldwide</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#17960b] rounded-full mt-2"></div>
              <p className="text-base">Build your professional resume with our easy-to-use builder</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#17960b] rounded-full mt-2"></div>
              <p className="text-base">Get personalized job recommendations based on your profile</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login/Signup Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-[#17960b] p-6 sm:p-8">
            {/* Tab Toggle */}
            <div className="flex gap-2 mb-6 sm:mb-8 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-md font-semibold text-sm sm:text-base transition-all ${
                  isLogin
                    ? 'bg-[#17960b] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                LOGIN
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-md font-semibold text-sm sm:text-base transition-all ${
                  !isLogin
                    ? 'bg-[#17960b] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                SIGN UP
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {!isLogin && (
                <div>
                  <Label htmlFor="firstName" className="text-gray-700 font-semibold mb-2 block">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="h-12 border-2 border-gray-300 focus:border-[#17960b] rounded-lg"
                    required={!isLogin}
                  />
                </div>
              )}

              {!isLogin && (
                <div>
                  <Label htmlFor="middleName" className="text-gray-700 font-semibold mb-2 block">
                    Middle Name
                  </Label>
                  <Input
                    id="middleName"
                    name="middleName"
                    type="text"
                    placeholder="Enter your middle name"
                    value={formData.middleName}
                    onChange={handleChange}
                    className="h-12 border-2 border-gray-300 focus:border-[#17960b] rounded-lg"
                  />
                </div>
              )}

              {!isLogin && (
                <div>
                  <Label htmlFor="lastName" className="text-gray-700 font-semibold mb-2 block">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="h-12 border-2 border-gray-300 focus:border-[#17960b] rounded-lg"
                    required={!isLogin}
                  />
                </div>
              )}

              {isLogin ? (
                <div>
                  <Label htmlFor="username" className="text-gray-700 font-semibold mb-2 block">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    className="h-12 border-2 border-gray-300 focus:border-[#17960b] rounded-lg"
                    required={isLogin}
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-semibold mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 border-2 border-gray-300 focus:border-[#17960b] rounded-lg"
                    required={!isLogin}
                  />
                </div>
              )}

              {!isLogin && (
                <div>
                  <Label htmlFor="signupUsername" className="text-gray-700 font-semibold mb-2 block">
                    Username
                  </Label>
                  <div className="relative">
                    <Input
                      id="signupUsername"
                      name="signupUsername"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.signupUsername}
                      onChange={handleUsernameChange}
                      className="h-12 border-2 border-gray-300 focus:border-[#17960b] rounded-lg pr-10"
                      required={!isLogin}
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
                  {/* Username validation feedback */}
                  {formData.signupUsername.length > 0 && formData.signupUsername.length < 3 && (
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
              )}

              {!isLogin && (
                <div>
                  <Label htmlFor="heardFrom" className="text-gray-700 font-semibold mb-2 block">
                    Where did you hear about Landbase?
                  </Label>
                  <Select onValueChange={handleSelectChange} value={formData.heardFrom} required>
                    <SelectTrigger className="h-12 border-2 border-gray-300 focus:border-[#17960b] rounded-lg">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="jobboard">Job Board/Website</SelectItem>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="referral">Friend/Referral</SelectItem>
                      <SelectItem value="advertisement">Advertisement</SelectItem>
                      <SelectItem value="walkin">Walk-in</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="password" className="text-gray-700 font-semibold mb-2 block">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    className="h-12 border-2 border-gray-300 focus:border-[#17960b] rounded-lg pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {!isLogin && formData.password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Password must contain:</p>
                    <div className="flex items-center gap-1.5 text-xs">
                      {formData.password.length >= 8 ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-600'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      {/[A-Z]/.test(formData.password) ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}>
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      {/[0-9]/.test(formData.password) ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <span className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}>
                        One number
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold mb-2 block">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="h-12 border-2 border-gray-300 focus:border-[#17960b] rounded-lg"
                      required={!isLogin}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#17960b]" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[#17960b] hover:text-[#0d5e06] font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-[#17960b] hover:bg-[#0d5e06] text-white font-bold text-base rounded-lg shadow-lg"
              >
                {isLogin ? 'Login' : 'Create Account'}
              </Button>

              {!isLogin && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  By signing up, you agree to our{' '}
                  <a href="#" className="text-[#17960b] hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#17960b] hover:underline">
                    Privacy Policy
                  </a>
                </p>
              )}
            </form>
          </div>

          {/* Additional Info */}
          <p className="text-center text-gray-600 mt-6 text-sm">
            POEA Licensed • DMW Accredited • Trusted Since 2014
          </p>
        </div>
      </div>
    </div>
      )}
    </>
  );
}
