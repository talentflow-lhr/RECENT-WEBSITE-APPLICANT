import { Mail, Phone, MapPin, Globe, Facebook, Linkedin, Twitter } from 'lucide-react';
import logo from '../../imports/Landbase-removebg-preview.png';

interface FooterProps {
  onNavigate?: (page: 'jobs' | 'resume' | 'about' | 'dashboard' | 'applications' | 'profile' | 'jobsforyou' | 'apply' | 'savedjobs') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const branches = [
    { name: 'Cebu Branch', location: 'Rm. 221 Colon Development Corp. Bldg. Osmeña Blvd., Cebu City', phone: 'Tel. No. 0063-32-2555664' },
    { name: 'Batangas Branch', location: 'Rm. 301, 3rd Flr. Caedo Bldg. Kumintang Ibaba, Batangas City', phone: 'Tel. 0063-43-7230120' },
    { name: 'Bataan Branch', location: '151 D De Ocampo St., Limay Bataan', phone: 'Tel. 0063-908/6942377' },
    { name: 'Cagayan Branch', location: '2nd Flr MV Bldg. Thano del Pilar St. CDO', phone: 'Tel. 088-231-6776' },
    { name: 'Bacolod Branch', location: 'Rm. 205-207 Dona Milagrosa Bldg. San Juan St. Bacolod City', phone: 'Tel. 0063-3287506436' },
    { name: 'Iligan Branch', location: 'Rm 506, Alonto Bldg Gen. Aguinaldo St., Iligan City' }
  ];

  const quickLinks = [
    { name: 'Job Portal', page: 'jobs' as const },
    { name: 'Resume Builder', page: 'resume' as const },
    { name: 'About Us', page: 'about' as const },
    { name: 'My Dashboard', page: 'dashboard' as const },
    { name: 'My Applications', page: 'applications' as const }
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, page: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page as any);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-[#0d5606] to-[#1e2939] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <img src={logo} alt="Landbase Human Resources" className="w-20 h-20 sm:w-24 sm:h-24 mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-3 text-[#ffca1a]">LANDBASE HUMAN RESOURCES</h3>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              We recruit the right people with the right skills at the right time
            </p>
            <div className="text-xs text-gray-400">
              <p className="mb-1">POEA License No.</p>
              <p className="text-[#ffca1a]">POEA-252-LB-121411-R</p>
            </div>
          </div>

          {/* Main Office Contact */}
          <div className="lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold mb-4 text-[#ffca1a]">Main Office</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#17960b] mt-0.5 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>Unit 303-304 Taft Office Center</p>
                  <p>1986 Taft Avenue St. Buendia</p>
                  <p>Pasay City, Philippines</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#17960b] flex-shrink-0" />
                <div className="text-gray-300">
                  <p>(0632)-833-8741 / 9945481</p>
                  <p>Telefax: (0632)-833-86-26</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#17960b] flex-shrink-0" />
                <div className="text-gray-300">
                  <p>landbase@landbase.net</p>
                  <p>augustnacino@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-[#17960b] flex-shrink-0" />
                <a href="http://www.landbase.net" className="text-gray-300 hover:text-[#ffca1a] transition-colors">
                  www.landbase.net
                </a>
              </div>
            </div>
          </div>

          {/* Branch Offices */}
          <div className="lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold mb-4 text-[#ffca1a]">Branch Offices</h4>
            <div className="space-y-3 text-sm">
              {branches.map((branch, index) => (
                <div key={index} className="border-l-2 border-[#17960b] pl-3">
                  <p className="text-white font-medium">{branch.name}</p>
                  <p className="text-gray-400 text-xs mt-1">{branch.location}</p>
                  {branch.phone && <p className="text-gray-400 text-xs">{branch.phone}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links & Social */}
          <div className="lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold mb-4 text-[#ffca1a]">Quick Links</h4>
            <ul className="space-y-2 text-sm mb-6">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href="#"
                    className="text-gray-300 hover:text-[#ffca1a] transition-colors inline-block cursor-pointer"
                    onClick={(e) => handleLinkClick(e, link.page)}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="text-base sm:text-lg font-semibold mb-4 text-[#ffca1a]">Connect With Us</h4>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-[#17960b] hover:bg-[#17960b]/80 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-[#17960b] hover:bg-[#17960b]/80 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-[#17960b] hover:bg-[#17960b]/80 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-400">
            <p className="text-center md:text-left">© {new Date().getFullYear()} Landbase Human Resources. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="#" className="hover:text-[#ffca1a] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#ffca1a] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#ffca1a] transition-colors">Data Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
