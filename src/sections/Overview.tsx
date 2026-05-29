import { motion } from 'motion/react';
import { PROJECT_INFO } from '../constants';

export default function Overview() {
  return (
    <section id="overview" className="relative py-14 md:py-28 px-6 overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROJECT_INFO.overview.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                className="group relative flex flex-col justify-start p-8 bg-white border border-gray-100/85 rounded-none shadow-[0_12px_35px_-8px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500"
              >
                {/* Visual Accent Corner Border directly inside the card */}
                <div className="absolute inset-0 border border-transparent group-hover:border-accent/15 rounded-none transition-all duration-500 pointer-events-none" />
                
                <div className="mb-5">
                  <span className="inline-block text-accent text-xs md:text-sm font-black tracking-widest uppercase bg-accent/[0.04] px-3 py-1 rounded-md">
                    {item.label}
                  </span>
                  <div className="mt-4 w-12 h-[2px] bg-slate-200 group-hover:bg-accent group-hover:w-20 transition-all duration-500" />
                </div>
                <p className="text-gray-900 text-lg md:text-xl font-extrabold leading-snug break-keep">
                  {item.value}
                </p>
              </motion.div>
            ))}
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-10 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-1.5 h-6 bg-accent rounded-full" />
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">오피스텔 공급면적</h3>
            </div>
            <span className="text-xs text-stone-500 lg:hidden flex items-center gap-1 bg-stone-50 border border-stone-200/40 px-2.5 py-1 font-semibold rounded shrink-0 self-start sm:self-center shadow-sm">
              <span className="animate-pulse">👉</span> 좌우로 스크롤하여 확인하세요
            </span>
          </div>
          
          <div className="overflow-x-auto rounded-none border border-gray-100 shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="min-w-[800px] w-full text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-[#0f1d2d] text-white">
                  <th rowSpan={2} className="p-4 font-bold border-r border-[#1e2d3d] text-center w-36 tracking-wider">구분<br/>(주택형)</th>
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
                    <td className="p-4 bg-slate-50/30 font-extrabold border-r border-gray-100 text-gray-900">{unit.type}</td>
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
                  <td className="p-4 border-r border-gray-100 bg-slate-100/50">합  계</td>
                  <td className="p-4 border-r border-gray-100 text-[#002C5F]">430</td>
                  <td className="p-4 border-r border-gray-100 text-[#002C5F]/70">100.0%</td>
                  <td colSpan={5} className="p-4 bg-slate-50/40 pr-24 lg:pr-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
