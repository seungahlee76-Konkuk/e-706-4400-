import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { analysisData } from '../constants';

interface AnalysisCardProps {
  item: typeof analysisData[0];
  index: number;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ item, index }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Automatic slide transition with pause-on-hover interaction
  React.useEffect(() => {
    if (isHovered || item.images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % item.images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered, item.images.length]);

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % item.images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  const highlightTitle = (title: string) => {
    const keywords = [
      '수원 TOP 3',
      '메머드급 규모',
      '원스톱 진료 체계',
      '원스톱 진료',
      '최상위 의료진',
      '존스홉킨스',
      '빅5 출신',
      '경기 남부 중증 질환 치료',
      '안정적인 수익 창출'
    ];
    
    // Sort keywords by length descending to match longest first
    const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
    const regex = new RegExp(`(${sortedKeywords.map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})`, 'g');
    const parts = title.split(regex);
    
    return parts.map((part, i) => {
      if (keywords.includes(part)) {
        return <span key={i} className="text-accent font-black">{part}</span>;
      }
      return part;
    });
  };

  const renderStructuredDesc = (desc: string) => {
    // Check if it's a numbered list or has paragraphs
    if (!desc.includes('1. ') && !desc.includes('1차 ')) {
      return <p className="text-gray-900 leading-relaxed sm:leading-[1.85] text-sm sm:text-[16px] md:text-[17px] font-medium tracking-wide break-keep whitespace-pre-line">{desc}</p>;
    }

    // Split by empty lines or double newlines to isolate blocks
    const blocks = desc.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
    const groups: { title: string; body: string }[] = [];
    let currentGroup: { title: string; body: string } | null = null;

    blocks.forEach(block => {
      const isNumberedHeader = /^\d+\./.test(block);
      if (isNumberedHeader) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = { title: block, body: '' };
      } else {
        if (currentGroup) {
          currentGroup.body = currentGroup.body ? currentGroup.body + '\n' + block : block;
        } else {
          groups.push({ title: '', body: block });
        }
      }
    });
    if (currentGroup) {
      groups.push(currentGroup);
    }

    if (groups.length === 0) {
      return <p className="text-[#555555] leading-relaxed sm:leading-[1.85] text-sm sm:text-[16px] md:text-[17px] font-medium tracking-wide break-keep whitespace-pre-line">{desc}</p>;
    }

    return (
      <div className="space-y-8 sm:space-y-10">
        {groups.map((group, idx) => {
          const numberMatch = group.title.match(/^(\d+)\.\s*(.*)$/);
          let numStr = '';
          let cleanTitle = group.title;
          if (numberMatch) {
            numStr = numberMatch[1];
            cleanTitle = numberMatch[2];
          }

          return (
            <div key={idx} className="space-y-2">
              {group.title && (
                <div className="flex items-center gap-3">
                  {numStr ? (
                    <span className="flex items-center justify-center w-6 h-6 bg-accent text-white font-black text-xs rounded-md shadow-[0_2px_4px_rgba(244,63,94,0.15)] select-none shrink-0">
                      {numStr}
                    </span>
                  ) : (
                    <span className="text-accent font-black text-sm">✔</span>
                  )}
                  <h4 className="text-[#0a2240] font-black text-[15px] sm:text-[17px] md:text-[18px] tracking-tight leading-snug">
                    {cleanTitle}
                  </h4>
                </div>
              )}
              {group.body && (
                <p className="text-gray-900 font-normal text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed break-keep whitespace-pre-line pl-9">
                  {group.body}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Determine floating badge content depending on the section context
  const getBadgeText = () => {
    switch (index) {
      case 0: return "수원 TOP 3 규모";
      case 1: return "고색역 직접 역세권";
      case 2: return "트리플 복합상권";
      case 3: return "첨단 산업밸리 혁신지구";
      default: return "수원 TOP 3 규모";
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-10 md:gap-14 lg:gap-16 items-stretch w-full md:flex-row",
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      {/* High-end Framed Media Box with deep shadow and elegant rounded corners */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full md:w-[48%] relative group rounded-2xl overflow-hidden aspect-[16/10] bg-stone-100 border border-stone-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.08)] self-center"
      >
        <div className="relative w-full h-full">
          {/* Glowing Floating Badge with rich dark luxury glassmorphism */}
          <div className="absolute top-4 left-4 z-20 bg-slate-900/65 backdrop-blur-md text-white/95 text-[11px] sm:text-[12px] font-semibold tracking-[-0.03em] px-4.5 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] select-none">
            {getBadgeText()}
          </div>

          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={item.images[currentImage]}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7 }}
              className={cn(
                "w-full h-full",
                item.title.includes("고색역 역세권") && currentImage === 0 ? "object-contain bg-stone-100" : "object-cover"
              )}
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          
          {item.images.length > 1 && (
            <>
              <button 
                onClick={prevImg} 
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/10 backdrop-blur-md rounded-none text-white hover:bg-black/30 transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextImg} 
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/10 backdrop-blur-md rounded-none text-white hover:bg-black/30 transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {item.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImage(i);
                    }}
                    className={`h-[3px] transition-all duration-500 focus:outline-none rounded-full ${i === currentImage ? 'bg-[#f43f5e] w-8' : 'bg-white/40 w-2 hover:bg-white/70'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>
  
      {/* Solution 3: Staggered text fade-in triggered by scroll with grand contrast */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12
            }
          }
        }}
        className={cn(
          "w-full md:w-[52%] flex flex-col justify-center",
          index % 2 === 0 ? "md:pl-8 lg:pl-12" : "md:pr-8 lg:pr-12"
        )}
      >
        <div className="space-y-6 sm:space-y-8 font-sans">
          <div>
            {/* Elegant, thin uppercase indicator for "여백의 미" and brand tone */}
            <motion.span 
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="text-[10px] sm:text-xs text-accent font-black tracking-[0.25em] uppercase mb-3 sm:mb-4 block"
            >
              PREMIUM BENEFIT 0{index + 1}
            </motion.span>
            <motion.h3 
              variants={{
                hidden: { opacity: 0, y: 35 },
                visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 leading-[1.2] tracking-tight"
            >
              {highlightTitle(item.title)}
            </motion.h3>
          </div>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
            }}
          >
            {renderStructuredDesc(item.desc)}
          </motion.div>
 
          <motion.div 
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: { opacity: 1, scaleX: 1, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="pt-2 origin-left"
          >
            <div className="w-16 h-0.5 bg-accent/40" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default function LocationAnalysis() {
  return (
    <section id="location" className="py-14 md:py-28 px-6 overflow-hidden bg-[#FAF8F5] border-t border-b border-stone-200/40">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          className="text-center mb-12 md:mb-36"
        >
          <motion.span 
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-accent font-black tracking-[0.25em] text-[11px] uppercase block"
          >
            INVESTMENT POINT
          </motion.span>
          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 35 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black text-gray-900 mt-4 tracking-tight leading-tight break-keep"
          >
            입지분석 및 프리미엄
          </motion.h2>
          <motion.div 
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: { opacity: 1, scaleX: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="w-20 h-1 bg-accent mx-auto mt-8 origin-center"
          />
        </motion.div>

        <div className="space-y-28 md:space-y-40">
          {analysisData.map((item, index) => (
            <AnalysisCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
