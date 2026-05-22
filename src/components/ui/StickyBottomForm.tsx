import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { Loader2, Phone } from 'lucide-react';
import { PROJECT_INFO } from '../../constants';

interface ContactFormData {
  name: string;
  phone: string;
  interest: string;
  privacy: boolean;
}

export default function StickyBottomForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<ContactFormData>();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://formspree.io/f/xnjrnolb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          interest: data.interest,
          _subject: `[${PROJECT_INFO.name}] 상담 신청(하단바) - ${data.name}`,
        }),
      });

      if (response.ok) {
        const existingLeads = JSON.parse(localStorage.getItem('property_leads') || '[]');
        const newLead = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('property_leads', JSON.stringify([newLead, ...existingLeads]));
        alert('상담 신청이 완료되었습니다.');
        reset();
      } else {
        throw new Error('Formspree submission failed');
      }
    } catch (e) {
      alert('오류가 발생했습니다. 잠시 후 다시 시도해주시거나 대표번호로 연락주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 h-24 bg-white border-t border-slate-200 z-[40] hidden lg:flex items-center px-8 gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
        >
          <div className="text-primary whitespace-nowrap flex items-center gap-4">
            <div>
              <span className="text-[10px] block text-slate-500 font-normal uppercase tracking-widest">Special Consultation</span>
              <span className="font-bold">분양 상담 예약</span>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden xl:block" />
            <a href={`tel:${PROJECT_INFO.representativeNumber.replace(/[^0-9]/g, '')}`} className="hidden xl:flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-primary tracking-tighter">{PROJECT_INFO.representativeNumber}</span>
            </a>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex gap-4 items-center">
            <input 
              {...register('name', { required: true })}
              type="text" 
              placeholder="성함" 
              className="flex-1 h-12 px-4 border border-slate-200 rounded text-slate-900 text-sm focus:outline-none focus:border-primary"
            />
            <input 
              {...register('phone', { required: true })}
              type="text" 
              placeholder="연락처" 
              className="flex-1 h-12 px-4 border border-slate-200 rounded text-slate-900 text-sm focus:outline-none focus:border-primary"
            />
            <select 
              {...register('interest', { required: true })}
              className="flex-1 h-12 px-4 border border-slate-200 rounded text-slate-600 text-sm focus:outline-none"
            >
              <option value="">관심호실 선택</option>
              <optgroup label="상업시설 (1F)">
                <option value="상업시설-117호">117호 (라멘/필라테스)</option>
                <option value="상업시설-118호">118호 (브런치/베이커리)</option>
                <option value="상업시설-119호">119호 (문전약국)</option>
                <option value="상업시설-126호">126호 (한식/샤브샤브)</option>
                <option value="상업시설-127호">127호 (한식/샤브샤브)</option>
                <option value="상업시설-128호">128호 (국밥/육개장)</option>
                <option value="상업시설-129호">129호 (맥주전문점)</option>
              </optgroup>
              <optgroup label="오피스텔">
                <option value="오피스텔-3룸">3룸 평면</option>
                <option value="오피스텔-기타">일반문의</option>
              </optgroup>
            </select>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-[10px] text-slate-500 cursor-pointer whitespace-nowrap">
                <input {...register('privacy', { required: true })} type="checkbox" className="rounded text-primary" /> 개인정보동의
              </label>
              <button 
                disabled={isSubmitting}
                className="bg-accent hover:bg-[#e66400] text-white px-8 h-12 rounded font-bold transition-colors whitespace-nowrap shadow-lg shadow-orange-500/20 flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                상담 예약하기
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
