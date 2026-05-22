import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const mdData = [
  { 
    id: '117호', 
    type: '라멘집 / 개인 필라테스', 
    area: '15.99평', 
    desc: '입구 초입 가시성이 우수한 특화 호실',
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '118호', 
    type: '브런치 / 베이커리카페', 
    area: '36.35평', 
    desc: '모던한 감성의 세련된 공간 구성 가능',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '119호', 
    type: '문전약국', 
    area: '58.81평', 
    desc: '병원/의원 이용객 동선 확보 최적 입지',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '126호', 
    type: '한식 / 샤브샤브전문점', 
    area: '23.44평', 
    desc: '대로변 노출이 우수하여 집객력이 높은 곳',
    image: 'https://images.unsplash.com/photo-1634047462615-ca805e243956?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '127호', 
    type: '한식 / 샤브샤브전문점', 
    area: '25.47평', 
    desc: '가족 단위 고객 및 단체 방문 최적화',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '128호', 
    type: '국밥집 / 육개장', 
    area: '16.5평', 
    desc: '유동인구가 많은 동선의 생활 밀착형 업종',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '129호', 
    type: '프랜차이즈 맥주전문점', 
    area: '18.47평', 
    desc: '퇴근길이나 여가를 즐기기에 좋은 코너 입지',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800'
  }
];

export default function MDConfig() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % mdData.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + mdData.length) % mdData.length);

  return (
    <section id="md" className="py-24 px-6 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent font-bold tracking-widest text-xs uppercase">Commercial & Residential Guide</span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mt-3">근린생활시설 입점 추천 업종</h2>
          <div className="w-16 h-1 bg-accent mx-auto mt-6" />
        </motion.div>

        {/* 상업시설 섹션 - Wrapped in a Container for Depth */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-4 md:p-10 shadow-2xl border border-gray-100 mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 상업시설 캐러셀 */}
            <div className="relative group">
            <div className="rounded-none overflow-hidden shadow-2xl border border-gray-100 aspect-[4/5] relative bg-gray-50">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={mdData[activeIndex].image}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-accent font-black text-xs mb-1 uppercase tracking-widest leading-none">Recommended Unit</p>
                <h3 className="text-3xl font-black">{mdData[activeIndex].id}</h3>
              </div>

              <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between">
                <button 
                  onClick={prevSlide}
                  className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2 justify-center">
              {mdData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 transition-all rounded-full ${idx === activeIndex ? 'bg-accent w-8' : 'bg-gray-200 w-2'}`}
                />
              ))}
            </div>
          </div>

            <div className="overflow-hidden bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-900/10">
                    <th className="py-6 px-4 font-bold text-[12px] uppercase tracking-[0.1em] text-gray-500">호수</th>
                    <th className="py-6 px-8 font-bold text-[12px] uppercase tracking-[0.1em] text-gray-500">추천 업종 및 상세 안내</th>
                    <th className="py-6 px-4 font-bold text-[12px] uppercase tracking-[0.1em] text-gray-500 text-right">전용면적</th>
                  </tr>
                </thead>
                <tbody>
                  {mdData.map((item, index) => {
                    const isHighTarget = item.id === '118호' || item.id === '119호';
                    return (
                      <tr 
                        key={index} 
                        onClick={() => setActiveIndex(index)}
                        className={`group border-b border-gray-100/50 cursor-pointer transition-all duration-300 ${
                          index === activeIndex 
                            ? 'bg-accent/[0.03]' 
                            : isHighTarget 
                              ? 'bg-accent/[0.02] hover:bg-accent/[0.05]' 
                              : 'hover:bg-gray-50/80'
                        }`}
                      >
                        <td className="py-8 px-4 align-top">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-black text-primary tracking-tighter">{item.id}</span>
                          </div>
                        </td>
                        <td className="py-8 px-8 align-top">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-3">
                              <div className={`text-lg md:text-xl font-bold tracking-tight transition-colors ${
                                isHighTarget ? 'text-accent' : 'text-gray-900 group-hover:text-primary'
                              }`}>
                                {item.type}
                              </div>
                              {isHighTarget && (
                                <span className="text-[9px] bg-accent text-white px-2 py-0.5 rounded-sm font-bold shrink-0">KEY TENANT</span>
                              )}
                            </div>
                            <div className="text-xs md:text-[13px] text-gray-500 font-medium leading-relaxed max-w-sm">
                              {item.desc}
                            </div>
                          </div>
                        </td>
                        <td className="py-8 px-4 text-right align-top">
                          <span className={`text-[13px] font-bold ${
                            isHighTarget ? 'text-accent' : 'text-gray-400'
                          }`}>
                            {item.area}평
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* 오피스텔 섹션 추가 */}
        <div className="pt-16 border-t border-gray-200">
          <div className="text-center mb-16">
            <span className="text-accent font-bold tracking-widest text-xs uppercase">Premium Residence</span>
            <h2 className="text-3xl font-bold text-primary mt-2">주거용 오피스텔 상품안내</h2>
            <p className="mt-3 text-accent font-black text-xl bg-accent/5 inline-block px-4 py-2 rounded-full border border-accent/20">시행사 특별 보유분 한정 프리미엄 리저브 세대</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: '혁신적인 3룸 평면',
                desc: '아파트를 대체하는 3룸 구조와 넉넉한 수납공간으로 주거 만족도를 극대화했습니다.',
                image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800'
              },
              {
                title: '고품격 커뮤니티',
                desc: '입주민을 위한 피트니스, 실내놀이터, 공유오피스 등 차별화된 커뮤니티 시설을 제공합니다.',
                image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecee?auto=format&fit=crop&q=80&w=800'
              },
              {
                title: '스마트 홈 시스템',
                desc: '최첨단 IoT 시스템을 적용하여 보안부터 에너지 관리까지 편리한 생활이 가능합니다.',
                image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800'
              }
            ].map((unit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="rounded-none overflow-hidden shadow-lg border border-gray-100 bg-white">
                  <div className="h-56 overflow-hidden">
                    <img 
                      src={unit.image} 
                      alt={unit.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg text-primary mb-2">{unit.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{unit.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
