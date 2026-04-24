import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Target, Users, Award, TrendingUp, CheckCircle, Globe, Phone, Mail, MapPin } from 'lucide-react';
import logo from '../imports/Landbase-removebg-preview.png';  

export function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#17960b] to-[#0d5e06] text-white py-10 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <img src={logo} alt="Landbase" className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-white mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">About Us</h1>
            <p className="text-white/95 text-base sm:text-lg md:text-xl font-medium">
              We recruit the right people with the right skills at the right time.
            </p>
          </div>
        </div>
      </div>

      {/* About Landbase */}
      <div className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-gray-900 mb-6 sm:mb-8 text-center text-xl sm:text-2xl">About Landbase</h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4 sm:mb-6">
              LANDBASE HUMAN RESOURCES COMPANY is a duly licensed and authorized agency by the Department of Migrant Workers (DMW). The Company is principally engaged in the recruitment and placement of Filipino Workers in various countries overseas.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4 sm:mb-6">
              The Company is committed to provide excellent services to all its clients and in pursuing this objective, the Company will provide the right people, at the right time and cost, without sacrificing the quality and qualifications of the candidates that conform to all the requirements of the client.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              The management together with its professional staff will ensure that all applicants will be treated fairly and professionally.
            </p>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="py-10 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
            <Card className="border-[#17960b]/20">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#17960b]/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 sm:w-7 sm:h-7 text-[#17960b]" />
                  </div>
                  <h2 className="text-gray-900 text-lg sm:text-xl">Vision</h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  To be the leading Human Resources Service provider in the region, providing our clients with the best-fit, industry-leading and highly-qualified professionals and workers, in consideration of the Company's recruitment process, core values and corporate social responsibility.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#17960b]/20">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#ffca1a]/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 sm:w-7 sm:h-7 text-[#ffca1a]" />
                  </div>
                  <h2 className="text-gray-900 text-lg sm:text-xl">Mission</h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  We commit to serve our clients with passion and dedication by providing sustainable high quality and cost-effective Human Resources Services through the employment of highly competent, professional, and dedicated employees guided by the principles of honesty, integrity and excellence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-gray-900 mb-3 sm:mb-4 text-xl sm:text-2xl">Contact Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Get in touch with us for any inquiries or assistance.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <Card className="border-[#17960b]/20">
                <CardContent className="pt-5 sm:pt-6 pb-5 sm:pb-6 px-4">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#17960b]/10 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-[#17960b]" />
                    </div>
                    <h3 className="text-gray-900 mb-2 text-base sm:text-lg">Phone</h3>
                    <p className="text-gray-600 text-sm">
                      09345234576
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#17960b]/20">
                <CardContent className="pt-5 sm:pt-6 pb-5 sm:pb-6 px-4">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#ffca1a]/10 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-[#ffca1a]" />
                    </div>
                    <h3 className="text-gray-900 mb-2 text-base sm:text-lg">Email</h3>
                    <p className="text-gray-600 text-sm break-all">
                      landbasehr@gmail.com
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#17960b]/20">
                <CardContent className="pt-5 sm:pt-6 pb-5 sm:pb-6 px-4">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#17960b]/10 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-[#17960b]" />
                    </div>
                    <h3 className="text-gray-900 mb-2 text-base sm:text-lg">Address</h3>
                    <p className="text-gray-600 text-sm">
                      San Carlos City, Negros Occidental, Philippines
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-10 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-gray-900 mb-3 sm:mb-4 text-xl sm:text-2xl">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
              These values guide everything we do at Landbase Human Resources.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            <Card className="border-[#17960b]/20 hover:shadow-lg transition-shadow">
              <CardContent className="pt-5 sm:pt-6 pb-5 sm:pb-6 px-4">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#17960b]/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-[#17960b]" />
                  </div>
                  <h3 className="text-gray-900 mb-2 text-base sm:text-lg">Integrity</h3>
                  <p className="text-gray-600 text-sm">
                    We conduct our business with honesty, transparency, and ethical practices.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#17960b]/20 hover:shadow-lg transition-shadow">
              <CardContent className="pt-5 sm:pt-6 pb-5 sm:pb-6 px-4">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#ffca1a]/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-[#ffca1a]" />
                  </div>
                  <h3 className="text-gray-900 mb-2 text-base sm:text-lg">Excellence</h3>
                  <p className="text-gray-600 text-sm">
                    We strive for the highest quality in our services and placements.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#17960b]/20 hover:shadow-lg transition-shadow">
              <CardContent className="pt-5 sm:pt-6 pb-5 sm:pb-6 px-4">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#17960b]/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#17960b]" />
                  </div>
                  <h3 className="text-gray-900 mb-2 text-base sm:text-lg">Care</h3>
                  <p className="text-gray-600 text-sm">
                    We prioritize the welfare and safety of every worker we place.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#17960b]/20 hover:shadow-lg transition-shadow">
              <CardContent className="pt-5 sm:pt-6 pb-5 sm:pb-6 px-4">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#ffca1a]/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#ffca1a]" />
                  </div>
                  <h3 className="text-gray-900 mb-2 text-base sm:text-lg">Innovation</h3>
                  <p className="text-gray-600 text-sm">
                    We embrace modern technology to improve our recruitment processes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-gray-900 mb-3 sm:mb-4 text-xl sm:text-2xl">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Comprehensive recruitment solutions tailored to meet the needs of both workers and employers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <Card className="border-[#17960b]/20">
              <CardContent className="pt-5 sm:pt-6 pb-5 sm:pb-6 px-4 sm:px-6">
                <h3 className="text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">For Job Seekers</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#17960b] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">Career counseling and job matching services.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#17960b] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">Document processing and visa assistance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#17960b] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">Pre-departure orientation and training.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#17960b] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">Post-placement support and welfare monitoring.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#17960b] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">Resume building and interview preparation.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-[#17960b]/20">
              <CardContent className="pt-5 sm:pt-6 pb-5 sm:pb-6 px-4 sm:px-6">
                <h3 className="text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">For Employers</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#17960b] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">Manpower sourcing and recruitment services.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#17960b] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">Candidate screening and skills assessment.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#17960b] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">Compliance with Philippine labor regulations.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#17960b] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">Deployment and mobilization services.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#17960b] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">Customized recruitment solutions.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="py-10 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-gray-900 mb-3 sm:mb-4 text-xl sm:text-2xl">Our Track Record</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-[#17960b] mb-2 text-2xl sm:text-3xl md:text-4xl font-bold">15,000+</div>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">Workers Deployed</p>
            </div>
            <div className="text-center">
              <div className="text-[#17960b] mb-2 text-2xl sm:text-3xl md:text-4xl font-bold">250+</div>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">Partner Companies</p>
            </div>
            <div className="text-center">
              <div className="text-[#17960b] mb-2 text-2xl sm:text-3xl md:text-4xl font-bold">92%</div>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-[#17960b] mb-2 text-2xl sm:text-3xl md:text-4xl font-bold">98%</div>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#17960b] to-[#0d5e06] py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl">Ready to Start Your Journey?</h2>
          <p className="text-white/90 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            Whether you're looking for overseas employment or seeking quality Filipino workers, we're here to help.
          </p>
        </div>
      </div>
    </div>
  );
}
