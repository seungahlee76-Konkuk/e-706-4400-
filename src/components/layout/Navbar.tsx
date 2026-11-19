import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, PenLine } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PROJECT_INFO } from '../../constants';
import { Link, useIsChooserView, usePath } from '../../lib/router';

export default function Navbar() {
  const path = usePath();
  const isChooserView = useIsChooserView();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const isHome = isChooserView || path === '/';
  const isOfficetel = !isHome && path === '/officetel';
  const isStoreHome = !isHome && path === '/store';

  const logoTo = isOfficetel ? '/officetel' : isHome ? '/' : '/store';
  const logoLabel = isOfficetel ? '고색 오피스텔' : isHome ? '고색' : '고색 상가';
  const contactHref = isOfficetel ? '/officetel#contact' : '/store#contact';

  const navItems = isHome
    ? []
    : isOfficetel
      ? [{ name: '상품안내', to: '/officetel#officetel', matchPath: '/officetel', hashId: '#officetel' }]
      : [
          { name: '사업개요', to: '/store/overview', matchPath: '/store/overview', hashId: '#overview' },
          { name: '입지분석', to: '/store/location', matchPath: '/store/location', hashId: '#location' },
        ];

  // Keep mobile menu closed on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [path]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    if (!isStoreHome) {
      setActiveSection('');
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    ['overview', 'location', 'md', 'officetel', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [isStoreHome]);

  const showSolidNav = true;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        showSolidNav ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100' : 'bg-transparent text-white'
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to={logoTo} className="flex items-center gap-2">
          <span className={cn("text-2xl font-black tracking-tight", showSolidNav ? "text-primary" : "text-white")}>
            e편한세상<span className="text-accent font-medium ml-1 text-lg">CITY</span>
          </span>
          <span className={cn("text-sm font-medium border-l pl-2 ml-2", showSolidNav ? "border-gray-200 text-gray-600" : "border-white/30 text-white/80")}>
            {logoLabel}
          </span>
        </Link>

        {/* Desktop Menu (Officetel keeps center placement) */}
        {isOfficetel && (
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {navItems.map((item) => {
              const isActive = isStoreHome
                ? activeSection === item.hashId
                : path === item.matchPath;
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className={cn(
                    'font-title text-sm font-semibold tracking-wide transition-colors hover:text-accent relative py-1 whitespace-nowrap',
                    isActive 
                      ? 'text-accent' 
                      : (showSolidNav ? 'text-gray-800' : 'text-white')
                  )}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Desktop Right Utility: Store Menu + Phone + Consultation Link */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          {!isOfficetel && navItems.length > 0 && (
            <div className="flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = isStoreHome
                  ? activeSection === item.hashId
                  : path === item.matchPath;
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={cn(
                      'font-title text-sm font-semibold tracking-wide transition-colors hover:text-accent relative py-1 whitespace-nowrap',
                      isActive 
                        ? 'text-accent' 
                        : (showSolidNav ? 'text-gray-800' : 'text-white')
                    )}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
          <div className={cn("h-7 w-px transition-colors", showSolidNav ? "bg-gray-200" : "bg-white/25")} />
          <a
            href={`tel:${PROJECT_INFO.representativeNumber.replace(/[^0-9]/g, '')}`}
            className="flex flex-col leading-tight group whitespace-nowrap"
          >
            <span className={cn("text-[11px] font-bold tracking-tight transition-colors", showSolidNav ? "text-gray-500" : "text-white/75")}>
              분양·임대 문의
            </span>
            <span className="font-title text-[20px] font-extrabold text-accent tracking-tight group-hover:opacity-90 transition-opacity">
              {PROJECT_INFO.representativeNumber}
            </span>
          </a>
          <div className={cn("h-7 w-px transition-colors", showSolidNav ? "bg-gray-200" : "bg-white/25")} />
          <Link
            to={contactHref}
            className={cn(
              "text-[14px] font-bold flex items-center gap-1.5 transition-colors hover:text-accent whitespace-nowrap",
              showSolidNav ? "text-gray-800" : "text-white"
            )}
          >
            <span>상담 신청</span>
            <PenLine className="w-[15px] h-[15px]" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        {navItems.length > 0 && (
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={showSolidNav ? 'text-gray-900' : 'text-white'} />
            ) : (
              <Menu className={showSolidNav ? 'text-gray-900' : 'text-white'} />
            )}
          </button>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && navItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl md:hidden border-t border-gray-100"
          >
            <div className="flex flex-col p-6 gap-6">
              {navItems.map((item) => {
                const isActive = isStoreHome
                  ? activeSection === item.hashId
                  : path === item.matchPath;
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 px-2 border-b border-gray-100 transition-all duration-200 group active:bg-gray-50/50 rounded-lg"
                  >
                    <span 
                      className={cn(
                        "text-[1.1rem] tracking-tight transition-colors duration-200",
                        isActive 
                          ? "text-accent font-extrabold" 
                          : "text-[#0A1931] font-bold"
                      )}
                    >
                      {item.name}
                    </span>
                    <ChevronRight 
                      className={cn(
                        "w-5 h-5 transition-transform duration-200 group-hover:translate-x-1",
                        isActive 
                          ? "text-accent opacity-100" 
                          : "text-[#0A1931] opacity-40"
                      )}
                    />
                  </Link>
                );
              })}
              <a
                href={`tel:${PROJECT_INFO.representativeNumber.replace(/[^0-9]/g, '')}`}
                className="bg-primary text-white py-4 rounded-lg flex items-center justify-center gap-2 font-bold shadow-md active:scale-[0.98] transition-transform duration-100"
              >
                상담 전화하기
              </a>
              <div className="border-t border-gray-200 pt-4">
                <Link
                  to={isOfficetel ? '/store' : '/officetel'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-1 px-2 text-[1.1rem] font-bold tracking-tight text-[#D24A0E] hover:opacity-80 transition-opacity"
                >
                  {isOfficetel ? '← 상가 보기' : '오피스텔 보기 →'}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
