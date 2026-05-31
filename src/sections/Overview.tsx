import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { PROJECT_INFO } from '../constants';

export default function Overview() {
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showRightGradient, setShowRightGradient] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowRightGradient(scrollWidth > clientWidth && scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    // Re-check after a brief timeout to let table render fully
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  return (
    <section 
      id="overview" 
      className="relative py-14 md:py-28 px-6 overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Premium Ambient Background Orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-sky-200/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-10 md:mb-16 text-center md:text-left"
        >
          <span className="text-accent font-bold tracking-[0.2em] text-[11px] uppercase">PROJECT OVERVIEW</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mt-4 tracking-tight leading-tight break-keep">사업개요</h2>
          <div className="w-16 h-1 bg-accent mt-6 rounded-full hidden md:block" />
        </motion.div>

        {/* Top Section: Premium Bento Overview Cards */}
        <div className="mb-14 md:mb-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {PROJECT_INFO.overview.slice(0, 4).map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
                className="group relative flex flex-col justify-start p-5 md:p-8 bg-white border border-gray-100/85 rounded-none shadow-[0_12px_35px_-8px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500"
              >
                {/* Visual Accent Corner Border directly inside the card */}
                <div className="absolute inset-0 border border-transparent group-hover:border-accent/15 rounded-none transition-all duration-500 pointer-events-none" />
                
                <div className="mb-4 md:mb-5">
                  <span className="inline-block text-accent text-[10px] sm:text-xs md:text-sm font-black tracking-widest uppercase bg-accent/[0.04] px-2 md:px-3 py-1 rounded-md">
                    {item.label}
                  </span>
                  <div className="mt-3 md:mt-4 w-8 md:w-12 h-[2px] bg-slate-200 group-hover:bg-accent group-hover:w-20 transition-all duration-500" />
                </div>
                <p className="text-gray-900 text-sm sm:text-base md:text-xl font-extrabold leading-snug break-keep">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Collapsible Remaining Items */}
          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`overflow-hidden md:!h-auto md:!opacity-100 ${isExpanded ? 'mt-4 md:mt-6' : 'mt-0 md:mt-6'}`}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {PROJECT_INFO.overview.slice(4).map((item, idx) => (
                <div
                  key={idx + 4}
                  className="group relative flex flex-col justify-start p-5 md:p-8 bg-white border border-gray-100/85 rounded-none shadow-[0_12px_35px_-8px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500"
                >
                  {/* Visual Accent Corner Border directly inside the card */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-accent/15 rounded-none transition-all duration-500 pointer-events-none" />
                  
                  <div className="mb-4 md:mb-5">
                    <span className="inline-block text-accent text-[10px] sm:text-xs md:text-sm font-black tracking-widest uppercase bg-accent/[0.04] px-2 md:px-3 py-1 rounded-md">
                      {item.label}
                    </span>
                    <div className="mt-3 md:mt-4 w-8 md:w-12 h-[2px] bg-slate-200 group-hover:bg-accent group-hover:w-20 transition-all duration-500" />
                  </div>
                  <p className="text-gray-900 text-sm sm:text-base md:text-xl font-extrabold leading-snug break-keep">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Toggle Button for Mobile Only */}
          <div className="flex justify-center mt-6 md:hidden">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center gap-1.5 px-6 py-3 border border-slate-200 text-xs font-bold tracking-tight rounded-full text-slate-700 bg-white hover:bg-slate-50 select-none transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
            >
              <span>{isExpanded ? '∧ 사업개요 간략히 보기' : '∨ 사업개요 전체 보기'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Section: Unit Types Table with Premium Card Frame */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white p-5 sm:p-8 md:p-12 rounded-none border border-gray-100/90 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.04)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-10 border-b border-gray-100 pb-3 md:pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-1.5 h-6 bg-accent rounded-full" />
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">오피스텔 공급면적</h3>
            </div>
            <span 
              className="text-xs lg:hidden flex items-center gap-1 bg-[#002C5F] border border-[#001D3F] px-4 py-1.5 font-bold rounded-full shrink-0 self-start sm:self-center shadow-sm select-none"
              style={{ color: '#45ffde' }}
            >
              <span className="animate-pulse">👉</span> 좌우로 스크롤하여 확인하세요
            </span>
          </div>
          
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="overflow-x-auto rounded-none border border-gray-100 shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <table className="min-w-[800px] w-full text-xs md:text-sm border-collapse">
                <thead>
                  <tr className="bg-[#0f1d2d] text-white">
                    <th 
                      rowSpan={2} 
                      className="sticky left-0 bg-[#0f1d2d] p-4 font-bold border-r border-[#1e2d3d] text-center w-36 tracking-wider z-20 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.3)]"
                    >
                      구분<br/>(주택형)
                    </th>
                    <th rowSpan={2} className="p-4 font-bold border-r border-[#1e2d3d] text-center tracking-wider">세대수</th>
                    <th rowSpan={2} className="p-4 font-bold border-r border-[#1e2d3d] text-center tracking-wider">비율</th>
                    <th colSpan={2} className="p-3 font-bold border-b border-[#1e2d3d] border-r border-[#1e2d3d] text-center tracking-widest text-[11px] uppercase opacity-90">전용면적</th>
                    <th colSpan={2} className="p-3 font-bold border-b border-[#1e2d3d] border-r border-[#1e2d3d] text-center tracking-widest text-[11px] uppercase opacity-90">계약면적</th>
                    <th rowSpan={2} className="p-4 font-bold text-center tracking-wider pr-24 lg:pr-4">전용률</th>
                  </tr>
                  <tr className="bg-[#0f1d2d] text-white">
                    <th className="p-2.5 font-bold border-r border-[#1e2d3d] text-center text-xs">m²</th>
                    <th className="p-2.5 font-bold border-r border-[#1e2d3d] text-center text-xs">PY</th>
                    <th className="p-2.5 font-bold border-r border-[#1e2d3d] text-center text-xs">m²</th>
                    <th className="p-2.5 font-bold border-r border-[#1e2d3d] text-center text-xs">PY</th>
                  </tr>
                </thead>
                <tbody className="text-center divide-y divide-gray-100 bg-white">
                  {PROJECT_INFO.unitTypes?.map((unit, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors duration-200">
                      <td className="sticky left-0 bg-slate-50 font-extrabold border-r border-slate-200 text-gray-900 p-4 z-10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.15)] md:shadow-none">
                        {unit.type}
                      </td>
                      <td className="p-4 border-r border-gray-100 text-gray-900 font-bold">{unit.units}</td>
                      <td className="p-4 border-r border-gray-100 text-gray-900 font-bold text-gray-500">{unit.ratio}</td>
                      <td className="p-4 border-r border-gray-100 text-gray-900 font-bold">{unit.areaM2}</td>
                      <td className="p-4 border-r border-gray-100 text-gray-900 font-bold text-accent">{unit.areaPy}</td>
                      <td className="p-4 border-r border-gray-100 text-gray-900 font-bold">{unit.totalAreaM2}</td>
                      <td className="p-4 border-r border-gray-100 text-gray-900 font-bold text-gray-500">{unit.totalAreaPy}</td>
                      <td className="p-4 text-gray-900 font-bold pr-24 lg:pr-4">{unit.efficiency}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50/80 font-extrabold text-[#002C5F] divide-y divide-gray-100">
                    <td className="sticky left-0 bg-slate-100 font-black border-r border-slate-300 text-[#002C5F] p-4 z-10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.18)] md:shadow-none">
                      합  계
                    </td>
                    <td className="p-4 border-r border-gray-100 text-[#002C5F]">430</td>
                    <td className="p-4 border-r border-gray-100 text-[#002C5F]/70">100.0%</td>
                    <td colSpan={5} className="p-4 bg-slate-50/40 pr-24 lg:pr-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Premium scroll gradient overlay on the right edge */}
            <div 
              className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/95 via-white/40 to-transparent pointer-events-none z-20 md:hidden transition-opacity duration-300 ${
                showRightGradient ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
