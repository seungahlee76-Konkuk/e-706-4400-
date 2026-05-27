import { motion } from 'motion/react';
import { Phone, MessageSquare, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { PROJECT_INFO } from '../../constants';

export default function QuickMenu() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed right-6 top-1/3 z-50 hidden lg:flex flex-col gap-3">
      {/* Phone Inquiry */}
      <motion.a
        href={`tel:${PROJECT_INFO.representativeNumber.replace(/[^0-9]/g, '')}`}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        className="w-14 h-14 bg-white rounded-full shadow-2xl border-2 border-primary flex flex-col items-center justify-center text-primary cursor-pointer transition-transform"
      >
        <Phone className="w-4 h-4" />
        <span className="text-[7px] font-black mt-0.5">전화문의</span>
      </motion.a>

      {/* Reservation Bar */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-14 h-44 bg-primary rounded-full shadow-2xl flex flex-col items-center py-5 text-white border border-white/10"
      >
        <div className="writing-vertical-lr text-[9px] font-bold tracking-[0.2em] uppercase mb-2">RESERVATION</div>
        <div className="w-px h-8 bg-white/20 my-2"></div>
        <div className="text-[11px] font-black -rotate-90 origin-center whitespace-nowrap mt-5 text-accent tracking-tighter">{PROJECT_INFO.representativeNumber}</div>
      </motion.div>

      {/* Scroll to Top */}
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center w-12 h-12 bg-white text-primary rounded-full shadow-lg border border-gray-100 self-center transition-colors hover:bg-gray-50"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
