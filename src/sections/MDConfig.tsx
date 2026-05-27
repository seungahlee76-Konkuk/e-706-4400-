import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mdData, officetelData } from '../constants';

export default function MDConfig() {
  const [activeIndex, setActiveIndex] = useState(() => {
    const idx = mdData.findIndex(item => item.id === '118호');
    return idx !== -1 ? idx : 0;
  });

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % mdData.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + mdData.length) % mdData.length);

  return (
    <section id="md" className="py-28 px-6 border-b border-gray-100 bg-[#FAF8F5]">
      <div className="max-w-[1600px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20 md:mb-24"
        >
          <span className="text-accent font-black tracking-[0.25em] text-[11px] uppercase">COMMERCIAL & RESIDENTIAL GUIDE</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-4 tracking-tight leading-tight">
            근린생활시설<br className="sm:hidden" /> 입점 추천 업종
          </h2>
          <div className="w-20 h-1.5 bg-accent mx-auto mt-8 rounded-full" />
        </motion.div>

        {/* 상업시설 섹션 - Clean, Architectural Flat Layout (No bloated rounded frames or IT shadows) */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid lg:grid-cols-12 gap-10 sm:gap-12 lg:items-stretch mb-28 w-full"
        >
          {/* 상업시설 캐러셀 */}
          <div className="lg:col-span-5 relative group w-full flex flex-col justify-between self-stretch">
            <div className="rounded-none overflow-hidden border border-stone-200/60 aspect-[4/5] lg:aspect-auto lg:flex-1 relative bg-stone-50 min-h-[450px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={mdData[activeIndex].image}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-accent font-black text-[10px] mb-1.5 uppercase tracking-widest leading-none">RECOMMENDED UNIT</p>
                <h3 className="text-3.5xl font-black tracking-tight">{mdData[activeIndex].id}</h3>
              </div>
              
              <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between">
                <button 
                  onClick={prevSlide}
                  className="p-2.5 bg-black/10 backdrop-blur-md rounded-none text-white hover:bg-black/30 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="p-2.5 bg-black/10 backdrop-blur-md rounded-none text-white hover:bg-black/30 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2 justify-center shrink-0">
              {mdData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-[2px] transition-all duration-300 ${idx === activeIndex ? 'bg-accent w-8' : 'bg-stone-350 w-2'}`}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 overflow-hidden bg-white p-5 sm:p-8 rounded-none border border-stone-200/50 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="py-3.5 px-2 sm:px-4 font-black text-xs sm:text-sm uppercase tracking-[0.12em] text-stone-700 w-20 sm:w-24">호수</th>
                  <th className="py-3.5 px-3 sm:px-5 md:px-6 font-black text-xs sm:text-sm uppercase tracking-[0.12em] text-stone-700">추천 업종 및 상세 안내</th>
                  <th className="py-3.5 px-2 sm:px-4 font-black text-xs sm:text-sm uppercase tracking-[0.12em] text-stone-700 text-right w-24 sm:w-28">전용면적</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {mdData.map((item, index) => {
                  const isHighTarget = item.id === '118호' || item.id === '119호';
                  return (
                    <tr 
                      key={index} 
                      onClick={() => setActiveIndex(index)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`group cursor-pointer transition-all duration-350 ${
                        index === activeIndex 
                          ? 'bg-[#EBEBE4]/70 border-b border-stone-200' 
                          : 'hover:bg-[#EBEBE4]/30 border-b border-stone-100'
                      }`}
                    >
                      <td className="py-4 px-2 sm:px-4 align-middle">
                        {/* Enlarged Room Numbers as a Bold Architecture/Spec element with custom coloring */}
                        <div className="flex items-baseline">
                          <span className={`text-2xl sm:text-3.5xl font-black transition-colors tracking-tighter block leading-none select-none ${
                            index === activeIndex 
                              ? 'text-accent' 
                              : 'text-stone-350 group-hover:text-accent'
                          }`}>
                            {item.id.replace('호', '')}
                          </span>
                          <span className={`text-[10px] sm:text-xs font-bold tracking-normal ml-0.5 transition-colors ${
                            index === activeIndex 
                              ? 'text-accent md:text-accent' 
                              : 'text-stone-400 group-hover:text-accent'
                          }`}>호</span>
                        </div>
                      </td>
                      <td className="py-4 px-3 sm:px-5 md:px-6 align-middle">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-1.5 md:gap-2.5">
                            <h4 className={`text-sm sm:text-base font-extrabold tracking-tight transition-colors ${
                              isHighTarget ? 'text-accent' : 'text-gray-900 group-hover:text-accent'
                            }`}>
                              {item.type}
                            </h4>
                            {isHighTarget && (
                              <span className="text-[8px] sm:text-[9px] bg-accent text-white px-2 py-0.5 rounded-none font-black tracking-widest shrink-0 uppercase select-none">
                                KEY TENANT
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm md:text-[14px] text-[#555555] leading-relaxed font-semibold">
                            {item.desc}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-right align-middle">
                        <div className="flex flex-col justify-center">
                          <span className="text-[9px] text-stone-400 font-bold tracking-wider uppercase block mb-0.5">전용면적</span>
                          <span className={`text-sm sm:text-base md:text-[16px] font-black ${
                            isHighTarget ? 'text-accent' : 'text-stone-800'
                          }`}>
                            {item.area}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* 오피스텔 섹션 추가 - Refined to match modern design guides */}
        <div className="pt-24 border-t border-stone-200/50">
          <div className="text-center mb-20">
            <span className="text-accent font-black tracking-[0.25em] text-[11px] uppercase block mb-3">PREMIUM RESIDENCE</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-6">주거용 오피스텔 상품안내</h2>
            <div className="mt-4">
              <span className="text-sm sm:text-base md:text-[17px] text-[#555555] font-semibold uppercase tracking-[0.08em] block sm:inline">
                시행사 특별 보유분 한정 프리미엄 리저브 세대
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {officetelData.map((unit: any, idx: number) => (
              <OfficetelProductCard key={idx} unit={unit} idx={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function OfficetelProductCard({ unit, idx }: { unit: any; idx: number; key?: any }) {
  const images = unit.images && unit.images.length > 0 
    ? unit.images.filter((img: string) => img && img.trim() !== '') 
    : ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800'];
  
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 }}
      className="group h-full"
    >
      {/* Sharp Flat Frame: zero bloated rounding, zero floating IT shadows, crisp architectural integrity */}
      <div className="rounded-none overflow-hidden border border-stone-200 bg-white flex flex-col h-full transition-all duration-500 hover:border-accent">
        {/* 이미지 영역 슬라이더 */}
        <div className="h-64 overflow-hidden relative group/slider bg-stone-50">
          <img 
            src={images[currentImgIndex]} 
            alt={unit.title} 
            className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          
          {/* 이전/다음 버튼 */}
          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-none bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 pointer-events-auto z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-none bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 pointer-events-auto z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* 슬라이드 대쉬 인디케이터 (Architectural Slide Line style instead of dots) */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_: any, imgIdx: number) => (
                <button
                  key={imgIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImgIndex(imgIdx);
                  }}
                  className={`h-[2px] transition-all duration-300 ${
                    currentImgIndex === imgIdx ? 'bg-white w-6' : 'bg-white/40 w-1.5'
                  }`}
                  aria-label={`Go to slide ${imgIdx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* 텍스트 내용 */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-black text-lg text-gray-900 mb-2.5 group-hover:text-accent transition-colors">{unit.title}</h4>
            <p className="text-sm sm:text-[15px] text-[#555555] leading-relaxed font-semibold">{unit.desc}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
