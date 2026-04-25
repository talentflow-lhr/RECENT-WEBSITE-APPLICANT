import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import logo from "../imports/Landbase-removebg-preview.png";
import { supabase } from "./supabaseClient";


interface ForgotPasswordProps {
  onBack: () => void;
}

export function ForgotPassword({
  onBack,
}: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    const { data, error } = await supabase.functions.invoke('send-reset-email', {
      body: { email },
    });
  
    setIsLoading(false);
  
    if (error || data?.error) {
      alert(data?.error || 'Email not found. Please check and try again.');
      return;
    }
  
    setIsSubmitted(true);
  };
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f7f0] to-[#e8f5e3] flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-[#17960b] p-6 sm:p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-[#17960b]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#17960b]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check Your Email
              </h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to:
              </p>
              <p className="font-semibold text-[#17960b] mb-6">
                {email}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Next Steps:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>
                    Check your email inbox (and spam folder)
                  </li>
                  <li>Click the reset link in the email</li>
                  <li>Create your new password</li>
                  <li>Log in with your new credentials</li>
                </ol>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                The link will expire in 24 hours for security
                reasons.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={onBack}
                className="w-full h-12 bg-[#17960b] hover:bg-[#0d5e06] text-white font-bold text-base rounded-lg"
              >
                Back to Login
              </Button>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                className="w-full text-sm text-[#17960b] hover:text-[#0d5e06] font-medium"
              >
                Resend Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7f0] to-[#e8f5e3] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border-4 border-[#17960b] p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <img
                src={logo}
                alt="Landbase HR"
                className="w-16 h-16 sm:w-20 sm:h-20"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#17960b] mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              No worries! Enter your email and we'll send you
              reset instructions.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label
                htmlFor="email"
                className="text-gray-700 font-semibold mb-2 block"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-10 border-2 border-gray-300 focus:border-[#17960b] rounded-lg"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                We'll send a password reset link to this email
                address.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#17960b] hover:bg-[#0d5e06] text-white font-bold text-base rounded-lg shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.928l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <button
              type="button"
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 text-[#17960b] hover:text-[#0d5e06] font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              Having trouble?
            </h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                • Make sure you're using the email address
                associated with your account
              </li>
              <li>
                • Check your spam or junk folder for the reset
                email
              </li>
              <li>
                • Contact support at{" "}
                <a
                  href="tel:09688809775"
                  className="text-[#17960b] hover:underline"
                >
                  0968 880 9775
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
