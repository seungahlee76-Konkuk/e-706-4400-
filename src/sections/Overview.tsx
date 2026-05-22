import { motion } from 'motion/react';
import { PROJECT_INFO } from '../constants';

export default function Overview() {
  return (
    <section id="overview" className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">사업개요</h2>
        </motion.div>

        {/* Top Section: Overview Grid */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
          >
            {PROJECT_INFO.overview.map((item, idx) => (
              <div key={idx} className="flex flex-col group">
                <div className="mb-4">
                  <span className="text-accent text-xs md:text-sm font-bold tracking-tight">
                    {item.label}
                  </span>
                  <div className="mt-2 w-full h-[1px] bg-gray-800 group-hover:bg-accent transition-colors duration-500" />
                </div>
                <p className="text-gray-900 text-sm md:text-base font-bold leading-relaxed break-keep">
                  {item.value}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Section: Unit Types Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 bg-accent rounded-full" />
            <h3 className="text-xl font-bold text-gray-900">오피스텔 공급면적</h3>
          </div>
          <div className="overflow-x-auto border-t-2 border-gray-900">
            <table className="min-w-[800px] w-full text-xs md:text-sm border-collapse border border-gray-200">
              <thead>
                <tr className="bg-[#0f1d2d] text-white">
                  <th rowSpan={2} className="p-4 font-normal border-r border-[#1e2d3d] text-center w-32 tracking-wider">구분<br/>(주택형)</th>
                  <th rowSpan={2} className="p-4 font-normal border-r border-[#1e2d3d] text-center tracking-wider">세대수</th>
                  <th rowSpan={2} className="p-4 font-normal border-r border-[#1e2d3d] text-center tracking-wider">비율</th>
                  <th colSpan={2} className="p-2 font-normal border-b border-[#1e2d3d] border-r border-[#1e2d3d] text-center tracking-widest">전용면적</th>
                  <th colSpan={2} className="p-2 font-normal border-b border-[#1e2d3d] border-r border-[#1e2d3d] text-center tracking-widest">계약면적</th>
                  <th rowSpan={2} className="p-4 font-normal text-center tracking-wider">전용률</th>
                </tr>
                <tr className="bg-[#0f1d2d] text-white">
                  <th className="p-2 font-normal border-r border-[#1e2d3d] text-center">m²</th>
                  <th className="p-2 font-normal border-r border-[#1e2d3d] text-center">PY</th>
                  <th className="p-2 font-normal border-r border-[#1e2d3d] text-center">m²</th>
                  <th className="p-2 font-normal border-r border-[#1e2d3d] text-center">PY</th>
                </tr>
              </thead>
              <tbody className="text-center divide-y divide-gray-200">
                {PROJECT_INFO.unitTypes?.map((unit, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 bg-white font-bold border-r border-gray-200 text-gray-900">{unit.type}</td>
                    <td className="p-4 border-r border-gray-200 text-gray-900 font-bold">{unit.units}</td>
                    <td className="p-4 border-r border-gray-200 text-gray-900 font-bold">{unit.ratio}</td>
                    <td className="p-4 border-r border-gray-200 text-gray-900 font-bold">{unit.areaM2}</td>
                    <td className="p-4 border-r border-gray-200 text-gray-900 font-bold">{unit.areaPy}</td>
                    <td className="p-4 border-r border-gray-200 text-gray-900 font-bold">{unit.totalAreaM2}</td>
                    <td className="p-4 border-r border-gray-200 text-gray-900 font-bold">{unit.totalAreaPy}</td>
                    <td className="p-4 text-gray-900 font-bold">{unit.efficiency}</td>
                  </tr>
                ))}
                <tr className="bg-white font-bold text-[#002C5F]">
                  <td className="p-4 border-r border-gray-200">합  계</td>
                  <td className="p-4 border-r border-gray-200">430</td>
                  <td className="p-4 border-r border-gray-200">100.0%</td>
                  <td colSpan={5} className="p-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
