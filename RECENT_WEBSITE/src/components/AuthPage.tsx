import { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import imgLogo from 'figma:asset/636ded4fbbb48605dae08d3a89a37f53cf3273be.png';

interface AuthPageProps {
  onLogin: () => void;
  onClose?: () => void;
}

export function AuthPage({ onLogin, onClose }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    phone: ''
  });

  // Mock list of taken usernames (in real app, this would be checked via API)
  const takenUsernames = ['admin', 'user', 'test', 'john', 'jane', 'naomi', 'landbase'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate username availability before submission
    if (!isLogin && !usernameAvailable) {
      alert('Please choose an available username');
      return;
    }
    
    // Mock login/signup - in real app, this would call an API
    onLogin();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
      username: username
    });
    
    // Reset availability state
    setUsernameAvailable(null);
    
    // Check username availability
    if (username.length >= 3) {
      checkUsername(username);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d5606] to-[#1e2939] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#17960b] to-[#ffca1a] p-6 text-center">
          <div className="flex justify-center mb-4">
            <img src={imgLogo} alt="Landbase" className="w-20 h-20" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Landbase Human Resources
          </h1>
          <p className="text-white/90 text-sm">
            {isLogin ? 'Welcome back! Please login to continue' : 'Create your account to get started'}
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                isLogin
                  ? 'bg-[#17960b] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                !isLogin
                  ? 'bg-[#17960b] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17960b] focus:border-transparent outline-none transition-all"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17960b] focus:border-transparent outline-none transition-all"
                    placeholder="Enter your middle name"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17960b] focus:border-transparent outline-none transition-all"
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleUsernameChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17960b] focus:border-transparent outline-none transition-all pr-10"
                      placeholder="Enter your username"
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
                  {formData.username.length > 0 && formData.username.length < 3 && (
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

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17960b] focus:border-transparent outline-none transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17960b] focus:border-transparent outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17960b] focus:border-transparent outline-none transition-all pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17960b] focus:border-transparent outline-none transition-all pr-10"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#17960b] border-gray-300 rounded focus:ring-[#17960b]"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-[#17960b] hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#17960b] text-white py-3 rounded-lg font-semibold hover:bg-[#17960b]/90 transition-colors shadow-lg hover:shadow-xl"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>

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

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#17960b] font-semibold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="mt-4 w-full text-gray-600 hover:text-gray-800 text-sm"
            >
              Continue as Guest
            </button>
          )}
        </div>
      </div>
    </div>
  );
}