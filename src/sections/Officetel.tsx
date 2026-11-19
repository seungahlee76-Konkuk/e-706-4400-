import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { officetelData } from '../constants';

export default function Officetel() {
  return (
    <section id="officetel" className="py-10 md:py-16 px-6 bg-[#F8F9FA] border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-12">
        <div className="pt-8 md:pt-14 border-t border-stone-200/50">
          <div className="text-center mb-8 md:mb-12">
            <span className="text-accent font-black tracking-[0.25em] text-[11px] uppercase block mb-3">PREMIUM RESIDENCE</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight mb-6 break-keep">주거용 오피스텔 상품안내</h2>
            <div className="mt-2.5">
              <span className="text-sm sm:text-base md:text-[17.5px] text-gray-900 font-semibold tracking-[-0.04em] block leading-[1.4]">
                시행사 <span className="text-[#FF6600] font-bold">특별 보유분</span> 한정
                <br />
                프리미엄 리저브 세대
              </span>
            </div>
          </div>

          {/* Pyramid Structure Grid Layout */}
          <div className="flex flex-col gap-10 md:gap-14 w-full">
            {/* 1. 상단 섹션 (Hero 영역): 쇼츠 + 1번 텍스트 단독 배치 */}
            {officetelData[0] && (
              <div className="w-full">
                <OfficetelHeroCard unit={officetelData[0]} idx={0} />
              </div>
            )}

            {/* 2. 하단 섹션 (Sub 영역): 2번 & 3번 카드 나란히 배치 */}
            {officetelData.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full md:max-w-6xl md:mx-auto">
                {officetelData.slice(1).map((unit: any, subIdx: number) => (
                  <OfficetelProductCard key={subIdx + 1} unit={unit} idx={subIdx + 1} />
                ))}
              </div>
            )}
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
      <div className="w-full bg-transparent pb-8 border-b border-stone-200/50 last:border-b-0 flex flex-col md:rounded-none md:overflow-hidden md:border md:border-stone-200 md:bg-white md:h-full md:pb-0 md:transition-all md:duration-500 md:hover:border-accent">
        {/* 이미지 영역 슬라이더 */}
        <div className="w-full aspect-[16/10] md:h-64 md:aspect-auto overflow-hidden relative group/slider bg-stone-50">
          <img 
            src={images[currentImgIndex]} 
            alt={unit.title} 
            className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          
          {/* 이전/다음 버튼 - 모바일에서는 상시 노출 */}
          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-none bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 transition-opacity duration-300 pointer-events-auto z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-none bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 transition-opacity duration-300 pointer-events-auto z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* 슬라이드 대쉬 인디케이터 */}
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
        <div className="pt-5 px-5 md:p-6 md:flex-1 md:flex md:flex-col md:justify-between">
          <div>
            <h4 className="font-black text-[18px] sm:text-[20px] md:text-lg text-gray-900 mb-2.5 group-hover:text-accent transition-colors leading-tight">{unit.title}</h4>
            <p className="text-sm sm:text-[15px] text-[#555555] leading-relaxed font-semibold">{unit.desc}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function OfficetelHeroCard({ unit, idx }: { unit: any; idx: number }) {
  const images = unit.images && unit.images.length > 0 
    ? unit.images.filter((img: string) => img && img.trim() !== '') 
    : ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800'];

  const mediaSource = images[0] || '';
  
  // Robust internal embed parser to safeguard runtime compatibility
  const getEmbedUrl = (url: string): string => {
    if (!url) return "";
    const trimmed = url.trim();
    
    // Match youtube shorts
    const shortsRegex = /\/shorts\/([a-zA-Z0-9_-]+)/i;
    const shortsMatch = trimmed.match(shortsRegex);
    if (shortsMatch && shortsMatch[1]) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }
    
    // Match standard youtube
    const standardRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/i;
    const standardMatch = trimmed.match(standardRegex);
    if (standardMatch && standardMatch[1]) {
      return `https://www.youtube.com/embed/${standardMatch[1]}`;
    }
    
    return trimmed;
  };

  const embedUrl = getEmbedUrl(mediaSource);
  const isYoutube = embedUrl && embedUrl.includes('youtube.com/embed/');

  // Slider state for fallback images
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
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex flex-col items-center"
    >
      <div className="w-full bg-white border border-stone-200/60 p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.04)] flex flex-col items-center">
        
        {/* 미디어 영역: 유튜브 쇼츠 또는 이미지 슬라이더 */}
        <div className="w-full max-w-[360px] md:max-w-[400px] mx-auto select-none overflow-hidden relative">
          {isYoutube ? (
            <div className="w-full aspect-[9/16] relative bg-[#020914] rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.15)] border border-stone-200/20 overflow-hidden">
              <iframe
                src={`${embedUrl}?autoplay=0&mute=1&loop=1&playlist=${embedUrl.split('/embed/')[1] || ''}`}
                title="YouTube Shorts video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-view-mode; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
              />
            </div>
          ) : (
            // Fallback Image Slider if no YouTube URL is specified
            <div className="w-full aspect-[9/16] overflow-hidden relative group/slider bg-stone-50 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
              <img 
                src={images[currentImgIndex]} 
                alt={unit.title} 
                className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover/slider:scale-105"
                referrerPolicy="no-referrer"
              />
              {images.length > 1 && (
                <>
                  <button 
                    onClick={handlePrev}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 transition-opacity duration-300 pointer-events-auto z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 transition-opacity duration-300 pointer-events-auto z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
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
          )}
        </div>

        {/* 중앙 정렬 텍스트 영역 */}
        <div className="mt-8 text-center max-w-2xl px-2 sm:px-4">
          <h4 className="font-extrabold text-[20px] sm:text-[22px] md:text-[24px] text-gray-900 mb-3 md:mb-3.5 tracking-tight leading-tight">
            {unit.title}
          </h4>
          <p className="text-xs sm:text-sm sm:text-[15px] md:text-[15.5px] text-[#555555] leading-relaxed font-semibold break-keep">
            {unit.desc}
          </p>
        </div>

      </div>
    </motion.div>
  );
}
