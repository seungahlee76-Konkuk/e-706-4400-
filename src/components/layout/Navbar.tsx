import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PROJECT_INFO } from '../../constants';

const navItems = [
  { name: '사업개요', href: '#overview' },
  { name: '입지분석', href: '#location' },
  { name: '입점추천', href: '#md' },
  { name: '오피스텔 상품안내', href: '#officetel' },
  { name: '문의하기', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#overview');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

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
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100' : 'bg-transparent text-white'
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="#" className="flex items-center gap-2">
          <span className={cn("text-2xl font-black tracking-tight", isScrolled ? "text-primary" : "text-white")}>
            e편한세상<span className="text-accent font-medium ml-1 text-lg">CITY</span>
          </span>
          <span className={cn("text-sm font-medium border-l pl-2 ml-2", isScrolled ? "border-gray-200 text-gray-600" : "border-white/30 text-white/80")}>
            고색
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10">
          {navItems.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-semibold tracking-wide transition-colors hover:text-accent relative py-1',
                  isActive 
                    ? 'text-accent' 
                    : (isScrolled ? 'text-gray-800' : 'text-white')
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
              </a>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={isScrolled ? 'text-gray-900' : 'text-white'} />
          ) : (
            <Menu className={isScrolled ? 'text-gray-900' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl md:hidden border-t border-gray-100"
          >
            <div className="flex flex-col p-6 gap-6">
              {navItems.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
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
                  </a>
                );
              })}
              <a
                href={`tel:${PROJECT_INFO.representativeNumber.replace(/[^0-9]/g, '')}`}
                className="bg-primary text-white py-4 rounded-lg flex items-center justify-center gap-2 font-bold shadow-md active:scale-[0.98] transition-transform duration-100"
              >
                상담 전화하기
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
