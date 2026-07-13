import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, User, BookOpenCheck, LogOut, GraduationCap, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBrandingConfig } from '../../hooks/useBrandingConfig';

interface NavbarProps {
  onOpenDemo: () => void;
}

export default function Navbar({ onOpenDemo }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  
  const { currentUser, logout: firebaseLogout } = useAuth();
  const { config: brandingConfig } = useBrandingConfig();
  const navigate = useNavigate();

  // Listen to sticky scroll status
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update logic to watch mock session state for Admin only
  const checkAdminSession = () => {
    const role = localStorage.getItem('vihaan_user_role');
    if (role === 'admin') {
      setAdminRole(role);
    } else {
      setAdminRole(null);
    }
  };

  useEffect(() => {
    checkAdminSession();
    const handler = () => checkAdminSession();
    window.addEventListener('storage', handler);
    const interval = setInterval(checkAdminSession, 1000); 
    
    return () => {
      window.removeEventListener('storage', handler);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    if (adminRole) {
      localStorage.removeItem('vihaan_user_role');
      localStorage.removeItem('vihaan_user_email');
      setAdminRole(null);
      navigate('/login');
    } else if (currentUser) {
      await firebaseLogout();
      navigate('/');
    }
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Why Sri Vihaan Consulting', path: '/why-vihaan' },
    { name: 'SAP Courses', path: '/courses' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'FAQ', path: '/faq' },
    { name: 'About Us', path: '/about' },
    { name: '⭐ Get SAP Server Access', path: '/server-access', isHighlighted: true }
  ];

  return (
    <nav
      id="main-navbar"
      className={`sticky top-0 w-full z-30 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
          : 'bg-white py-4 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo / Brand */}
          <div className="flex-1 flex justify-start">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 group pointer-events-auto shrink-0"
            id="nav-logo-link"
          >
            {brandingConfig?.logoUrl ? (
              <img src={brandingConfig.logoUrl} alt="Logo" className="max-h-[40px] sm:max-h-[50px] max-w-[180px] sm:max-w-[240px] object-contain transition-transform group-hover:scale-105" />
            ) : (
              <>
                <div className="bg-[#1763B6] p-1.5 sm:p-2 rounded-lg text-white group-hover:bg-[#277EDC] transition-all shadow-sm">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-sm sm:text-lg text-[#1763B6] tracking-tight hover:text-[#277EDC] transition-all leading-tight">
                    SRI VIHAAN
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-semibold text-orange-500 uppercase tracking-widest leading-none">
                    CONSULTING
                  </span>
                </div>
              </>
            )}
          </Link>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden lg:flex flex-none items-center justify-center gap-2 xl:gap-3 mx-4" id="desktop-links">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 pointer-events-auto relative ${
                    link.isHighlighted
                      ? isActive 
                        ? 'text-orange-600 bg-orange-50 font-bold border border-orange-200' 
                        : 'text-orange-600 font-bold border border-orange-100 hover:bg-orange-50'
                      : isActive
                        ? 'text-[#1763B6] bg-slate-50 font-semibold'
                        : 'text-slate-600 hover:text-[#1763B6] hover:bg-slate-50/50'
                  }`
                }
                id={`nav-link-${link.name.toLowerCase().replace(/\s/g, '-')}`}
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-orange-500 rounded-full"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="flex-1 flex justify-end items-center gap-3 xl:gap-4 shrink-0 hidden lg:flex" id="desktop-actions">
            {(adminRole || currentUser) ? (
              <div className="flex items-center gap-2" id="nav-user-indicator">
                <Link
                  to={adminRole === 'admin' ? '/admin-dashboard' : '/student/dashboard'}
                  className="flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#1763B6] hover:text-white px-5 py-2.5 rounded-full border border-[#1763B6] hover:bg-[#1763B6] transition-all pointer-events-auto shadow-sm h-full"
                  id="btn-nav-dashboard"
                >
                  <User className="w-4 h-4" />
                  <span>Portal</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-slate-400 hover:text-white rounded-full hover:bg-red-500 hover:border-red-500 transition-all cursor-pointer pointer-events-auto border border-transparent shadow-sm"
                  title="Logout"
                  id="btn-nav-logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#1763B6] hover:text-white px-5 py-2.5 rounded-full border border-[#1763B6] hover:bg-[#1763B6] transition-all pointer-events-auto shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

            <button
              onClick={onOpenDemo}
              className="px-5 py-2.5 text-[13px] font-semibold text-white bg-[#F4A62A] rounded-full shadow-lg shadow-amber-500/10 hover:bg-[#e09521] transition-all cursor-pointer pointer-events-auto border border-[#e09521]"
              id="btn-nav-demo"
            >
              Book Free Demo
            </button>
          </div>

          {/* Responsive Hamburger Icon (Mobile) */}
          <div className="flex xl:hidden items-center" id="hamburger-container">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-[#1763B6] p-2 focus:outline-none cursor-pointer pointer-events-auto"
              aria-label="Toggle Navigation Menu"
              id="btn-hamburger"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isOpen && (
        <div className="xl:hidden bg-white border-b border-slate-100 shadow-lg absolute top-full left-0 w-full z-40 py-4 px-4 space-y-3" id="mobile-drawer">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-between ${
                    isActive
                      ? 'text-[#1763B6] bg-slate-50 font-bold'
                      : 'text-slate-600 hover:text-[#1763B6] hover:bg-slate-50/50'
                  }`
                }
                id={`mobile-nav-link-${link.name.toLowerCase().replace(/\s/g, '-')}`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </NavLink>
            ))}
          </div>

          <hr className="border-slate-100 my-2" />

          {/* Mobile Actions */}
          <div className="flex flex-col gap-2 px-3 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenDemo();
              }}
              className="w-full text-center bg-[#F4A62A] hover:bg-[#e09521] text-white font-semibold text-sm py-2.5 rounded-lg transition-colors cursor-pointer block pointer-events-auto shadow-sm"
              id="btn-mobile-demo"
            >
              Book Free Demo
            </button>

            {(adminRole || currentUser) ? (
              <div className="space-y-2 mt-2">
                <Link
                  to={adminRole === 'admin' ? '/admin-dashboard' : '/student/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-[#1763B6] border border-slate-200 font-semibold text-sm py-2.5 rounded-lg transition-colors pointer-events-auto"
                  id="btn-mobile-portal"
                >
                  <User className="w-4 h-4" />
                  <span>Go to My Portal</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-sm py-2.5 rounded-lg transition-colors cursor-pointer pointer-events-auto block border border-red-100"
                  id="btn-mobile-logout"
                >
                  Sign Out Account
                </button>
              </div>
            ) : (
              <Link
                to="/sign-in"
                onClick={() => setIsOpen(false)}
                className="w-full text-center mt-2 bg-slate-50 hover:bg-slate-100 text-[#1763B6] border border-slate-200 font-semibold text-sm py-2.5 rounded-lg transition-colors cursor-pointer block pointer-events-auto shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
