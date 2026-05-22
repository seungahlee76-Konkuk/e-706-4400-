import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const analysisData = [
  {
    title: '수원덕산병원 프리미엄',
    desc: '약 706병상 규모의 대형 종합병원 바로 앞 입지로 안정적인 의료수요 및 관련 종사자 배후수요를 확보합니다.',
    images: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    title: '행정타운 배후수요',
    desc: '권선구청, 우체국, 보건소 등 공공기관이 밀집한 서수원 행정타운의 중심지로 공무원 및 방문객의 유입이 활발합니다.',
    images: [
      'https://images.unsplash.com/photo-1577416414929-7a4c9f17f6b4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    title: '고색역 역세권 입지',
    desc: '수인분당선 고색역 역세권으로 지하철 이용객의 풍부한 유동인구는 물론, 편리한 교통환경을 자랑합니다.',
    images: [
      'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    title: '탑동 이노베이션 밸리',
    desc: '인근 탑동 일대에 조성되는 첨단 산업 및 연구 단지로 대규모 기업 유입에 따른 고소득 배후수요 증대가 기대됩니다.',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800'
    ]
  },
];

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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={cn(
        "flex flex-col gap-12 lg:gap-20 items-center",
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      <div className="w-full md:w-1/2 relative group rounded-2xl overflow-hidden aspect-[16/10] shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-gray-100">
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
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/10 backdrop-blur-md rounded-full text-white hover:bg-black/30 transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextImg} 
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/10 backdrop-blur-md rounded-full text-white hover:bg-black/30 transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {item.images.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentImage ? 'bg-accent w-8' : 'bg-white/30 w-2'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className={cn(
        "w-full md:w-1/2 flex flex-col justify-center",
        index % 2 === 0 ? "md:pl-12 lg:pl-20" : "md:pr-12 lg:pr-20"
      )}>
        <div className="space-y-8">
          <div>
            <div className="inline-block px-3 py-1 bg-accent/[0.08] border border-accent/20 rounded text-accent font-bold text-[10px] tracking-widest uppercase mb-4">
              Premium Benefit 0{index + 1}
            </div>
            <h3 className="text-3xl md:text-5xl font-bold text-primary leading-[1.2] tracking-tight">
              {item.title}
            </h3>
          </div>
          
          <p className="text-gray-500 leading-relaxed text-lg md:text-xl font-medium break-keep">
            {item.desc}
          </p>

          <div className="pt-4">
            <div className="w-16 h-1 bg-accent rounded-full opacity-60" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function LocationAnalysis() {
  return (
    <section id="location" className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-40"
        >
          <span className="text-accent font-bold tracking-[0.2em] text-[11px] uppercase">Investment Point</span>
          <h2 className="text-4xl md:text-5xl font-black text-primary mt-4 tracking-tight">입지분석 및 프리미엄</h2>
          <div className="w-24 h-1.5 bg-accent mx-auto mt-10 rounded-full" />
        </motion.div>

        <div className="space-y-20 md:space-y-28">
          {analysisData.map((item, index) => (
            <AnalysisCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
