import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Lock, UserPlus, Sparkles, CheckCircle } from 'lucide-react';
import logo from '../../imports/Landbase-removebg-preview.png';
import { useState } from 'react';

interface SignUpPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
  onLogin: () => void;
}

export function SignUpPrompt({ isOpen, onClose, onSignUp, onLogin }: SignUpPromptProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      onLogin();
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupName && signupEmail && signupPassword && signupPassword === signupConfirmPassword) {
      onSignUp();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <img src={logo} alt="Landbase" className="w-16 h-16" />
          </div>
          <DialogTitle className="text-center">
            Join Landbase Human Resources
          </DialogTitle>
          <DialogDescription className="text-center">
            Create an account to access all features and apply for jobs
          </DialogDescription>
        </DialogHeader>

        {/* Benefits */}
        <div className="bg-gradient-to-br from-[#17960b]/10 to-[#ffca1a]/10 rounded-lg p-4 mb-4 border border-[#17960b]/20">
          <div className="flex items-start gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#17960b] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-gray-900 mb-2">Get access to:</h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#17960b] flex-shrink-0" />
                  <span>Professional Resume Builder</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#17960b] flex-shrink-0" />
                  <span>AI-Powered Resume Grading</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#17960b] flex-shrink-0" />
                  <span>Personalized Job Recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#17960b] flex-shrink-0" />
                  <span>Track Your Applications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#17960b] flex-shrink-0" />
                  <span>Direct Application to Top Companies</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>

          {/* Sign Up Tab */}
          <TabsContent value="signup">
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Juan Dela Cruz"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email Address</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-phone">Phone Number</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="09XX XXX XXXX"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a strong password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" required className="rounded mt-1" />
                <label className="text-sm text-gray-600">
                  I agree to the <button type="button" className="text-[#17960b] hover:underline">Terms of Service</button> and <button type="button" className="text-[#17960b] hover:underline">Privacy Policy</button>
                </label>
              </div>
              <Button type="submit" className="w-full bg-[#17960b] hover:bg-[#17960b]/90 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Free Account
              </Button>
            </form>
          </TabsContent>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email Address</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-[#17960b] hover:underline">
                  Forgot password?
                </button>
              </div>
              <Button type="submit" className="w-full bg-[#17960b] hover:bg-[#17960b]/90 text-white">
                <Lock className="w-4 h-4 mr-2" />
                Login to Your Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-xs text-gray-500 mt-4 pt-4 border-t">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
