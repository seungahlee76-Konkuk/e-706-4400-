import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PROJECT_INFO } from '../../constants';

const navItems = [
  { name: '사업개요', href: '#overview' },
  { name: '입지분석', href: '#location' },
  { name: '상품안내', href: '#md' },
  { name: '문의하기', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                'text-sm font-semibold tracking-wide transition-colors hover:text-accent',
                isScrolled ? 'text-gray-800' : 'text-white'
              )}
            >
              {item.name}
            </a>
          ))}
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
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-800 border-b border-gray-50 pb-2"
                >
                  {item.name}
                </a>
              ))}
              <a
                href={`tel:${PROJECT_INFO.representativeNumber.replace(/[^0-9]/g, '')}`}
                className="bg-primary text-white py-4 rounded-lg flex items-center justify-center gap-2 font-bold"
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
