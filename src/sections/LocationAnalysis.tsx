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

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % item.images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-12 lg:gap-20 items-center w-full",
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      {/* Sharp Architectural Box: No rounded corners, no floating card frames, no IT-blog shadows */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-1/2 relative group rounded-none overflow-hidden aspect-[16/10] bg-stone-100 border border-stone-200/60"
      >
        <div className="relative w-full h-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={item.images[currentImage]}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7 }}
              className="w-full h-full object-cover"
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
                  <div key={i} className={`h-[2px] transition-all duration-500 ${i === currentImage ? 'bg-accent w-8' : 'bg-white/30 w-2'}`} />
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
          "w-full md:w-1/2 flex flex-col justify-center",
          index % 2 === 0 ? "md:pl-16 lg:pl-24" : "md:pr-16 lg:pr-24"
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
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[45px] font-black text-gray-900 leading-[1.15] tracking-tight"
            >
              {item.title}
            </motion.h3>
          </div>
          
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-[#555555] leading-relaxed sm:leading-[1.85] text-sm sm:text-lg md:text-[18px] font-semibold tracking-wide break-keep"
          >
            {item.desc}
          </motion.p>
 
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
    <section id="location" className="py-28 px-6 overflow-hidden bg-[#FAF8F5] border-t border-b border-stone-200/40">
      <div className="max-w-7xl mx-auto">
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
          className="text-center mb-28 md:mb-36"
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
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-4 tracking-tight"
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
