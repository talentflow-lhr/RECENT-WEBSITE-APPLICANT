import { LayoutDashboard, FileText, Briefcase, User, LogOut, Search, Info } from 'lucide-react';
import logo from 'figma:asset/636ded4fbbb48605dae08d3a89a37f53cf3273be.png';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'jobs', label: 'Job Portal', icon: Search },
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'My Applications', icon: Briefcase },
    { id: 'resume', label: 'Resume Builder', icon: FileText },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Landbase" className="w-10 h-10" />
          <div>
            <h1 className="font-bold text-gray-900">Landbase</h1>
            <p className="text-xs text-gray-500">Human Resources</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#ffca1a] text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3 px-4 py-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">john.doe@email.com</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}