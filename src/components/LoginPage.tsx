import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Check, X } from 'lucide-react';
import logo from 'figma:asset/636ded4fbbb48605dae08d3a89a37f53cf3273be.png';
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthPass";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const { setAccount } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setLoading(true);
    
  try {
    if (isLogin) {
      // LOGIN FLOW
      const { data, error: loginError } = await supabase
        .from("t_account")
        .select(`
          account_id,
          acc_username,
          acc_email,
          is_active,
          applicant_id,
          t_applicant (
            applicant_id,
            app_first_name,
            app_middle_name,
            app_last_name
          )
        `)
        .eq("acc_username", formData.username)
        .eq("acc_password", formData.password)
        .eq("is_active", true)
        .single();

      if (loginError || !data) {
        setError("Invalid username or password.");
        setLoading(false);
        return;
      }

      setAccount(data);
      localStorage.setItem("account", JSON.stringify(data));
      onLogin();
    } else {
      // SIGNUP FLOW

      // 1. Password check
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      // 2. Check email duplicate
      const { data: existingEmail } = await supabase
        .from("t_account")
        .select("account_id")
        .eq("acc_email", formData.email)
        .maybeSingle();

      if (existingEmail) {
        setError("Email already exists.");
        setLoading(false);
        return;
      }

      // 3. Check username duplicate
      const { data: existingUsername } = await supabase
        .from("t_account")
        .select("account_id")
        .eq("acc_username", formData.signupUsername)
        .maybeSingle();

      if (!usernameAvailable) {
        setError("Username is not available.");
        setLoading(false);
        return;
      }

      if (usernameAvailable === false) {
        setError("Username is already taken.");
        setLoading(false);
        return;
      }

      if (!formData.heardFrom) {
        setError("Please select where you heard about Landbase.");
        setLoading(false);
        return;
      }

      // 4. INSERT applicant
      const { data: applicantData, error: applicantError } = await supabase
        .from("t_applicant")
        .insert([
          {
            app_first_name: formData.firstName,
            app_middle_name: formData.middleName,
            app_last_name: formData.lastName,
            app_email: formData.email,
          },
        ])
        .select()
        .single();

      if (applicantError) {
        setError(applicantError.message);
        setLoading(false);
        return;
      }

      // 5. INSERT account (linked)
      const { error: accountError } = await supabase
        .from("t_account")
        .insert([
          {
            applicant_id: applicantData.applicant_id,
            acc_username: formData.signupUsername,
            acc_email: formData.email,
            acc_password: formData.password, // ⚠️ hash later
            acc_hear: formData.heardFrom,
            is_active: true,
          },
        ]);

      if (accountError) {
        setError(accountError.message);
        setLoading(false);
        return;
      }

      setSuccess("Account created successfully!");
      setIsLogin(true);

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        middleName: "",
        lastName: "",
        signupUsername: "",
        heardFrom: "",
      });
    }
  } catch (err) {
    setError("Something went wrong.");
  } finally {
    setLoading(false);
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

   const checkUsername = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
  
    setUsernameChecking(true);
  
    const { data } = await supabase
      .from("t_account")
      .select("account_id")
      .eq("acc_username", username)
      .maybeSingle();
  
    setUsernameAvailable(!data);
    setUsernameChecking(false);
  };

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
  
    setFormData({
      ...formData,
      signupUsername: username
    });
  
    setUsernameAvailable(null);
  
    if (username.length >= 3) {
      await checkUsername(username);
    }
  };
  
  return (
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
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12 border-2 border-gray-300 focus:border-[#17960b] rounded-lg"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold mb-2 block">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="h-12 border-2 border-gray-300 focus:border-[#17960b] rounded-lg"
                    required={!isLogin}
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#17960b]" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-[#17960b] hover:text-[#0d5e06] font-medium">
                    Forgot Password?
                  </a>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#17960b] hover:bg-[#0d5e06] text-white font-bold text-base rounded-lg shadow-lg"
              >
                {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
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
  );
}
