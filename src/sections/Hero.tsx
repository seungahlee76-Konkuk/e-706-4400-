import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { PROJECT_INFO } from '../constants';

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const heroImages = PROJECT_INFO.heroImages;

  const nextSlide = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
  }, [heroImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  }, [heroImages.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [nextSlide]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow - Pure & Responsive */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center brightness-[0.85] contrast-[1.05]"
            style={{ 
              backgroundImage: `url('${heroImages[currentImage]}')`,
              referrerPolicy: 'no-referrer' as any
            }}
          />
        </AnimatePresence>
        
        {/* Transparent Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-black/20 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-[2]" />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-[10] w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-[1.1] drop-shadow-[0_4px_15px_rgba(0,0,0,0.4)]">
            서수원 행정타운의 중심,<br />
            <span className="text-accent">브랜드 프리미엄</span>의 완성
          </h1>
          <p className="text-lg md:text-2xl text-white font-medium tracking-wide max-w-2xl mx-auto mb-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            {PROJECT_INFO.name} 상업시설 & 오피스텔<br/>
            서수원의 미래 가치를 선점하는 압도적 브랜드 파워
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#contact" 
              className="px-10 py-5 bg-accent text-white font-bold rounded shadow-2xl transition-all hover:bg-[#e66400] hover:scale-105 active:scale-95"
            >
              상담 신청하기
            </a>
            <a 
              href="#overview" 
              className="px-10 py-5 bg-white/10 backdrop-blur-md text-white font-bold border border-white/20 rounded transition-all hover:bg-white/20 shadow-xl"
            >
              자세히 보기
            </a>
          </div>
        </motion.div>

        {/* Feature Grid Layer - Bottom of Hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full">
          {[
            { id: "01", label: "고색1 · 2지구", desc: "총 4,400여 세대(예정)" },
            { id: "02", label: "706병상", desc: "수원덕산병원(예정)" },
            { id: "03", label: "즉시 입점", desc: "기완공 상업시설" },
            { id: "04", label: "행정타운 배후", desc: "인근 500m 이내" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="bg-white/10 backdrop-blur-sm p-4 md:p-6 border-l border-white/20 text-left"
            >
              <span className="text-accent text-[10px] font-bold block mb-1">{item.id}</span>
              <h3 className="text-white text-sm md:text-base font-bold leading-tight mb-1">{item.label}</h3>
              <p className="text-white/60 text-[10px] leading-tight">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Layer */}
      <div className="absolute inset-x-0 inset-y-0 z-[5] flex items-center justify-between px-4 md:px-12 pointer-events-none">
        <button 
          onClick={prevSlide}
          className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white/50 hover:text-white hover:bg-white/20 transition-all pointer-events-auto shadow-lg"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white/50 hover:text-white hover:bg-white/20 transition-all pointer-events-auto shadow-lg"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Pagination Layer */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[10] flex gap-3">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImage(idx)}
            className={cn(
              "h-1 transition-all duration-300 rounded-full",
              idx === currentImage ? "bg-accent w-12" : "bg-white/30 w-3"
            )}
          />
        ))}
      </div>

      <motion.div 
        animate={{ y: [0, 8, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 z-[10]"
      >
        <ArrowDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}
