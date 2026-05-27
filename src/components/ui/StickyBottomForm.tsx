import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { Loader2, Phone } from 'lucide-react';
import { PROJECT_INFO } from '../../constants';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

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
    const leadId = 'lead-' + Math.random().toString(36).substring(2, 11);
    try {
      // 1. Submit to Firestore database
      await setDoc(doc(db, 'leads', leadId), {
        id: leadId,
        name: data.name,
        phone: data.phone,
        interest: data.interest,
        createdAt: serverTimestamp(),
      });

      // 2. Fallback or duplicate submission to Formspree for webhooks/email
      try {
        await fetch("https://formspree.io/f/xnjrnolb", {
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
      } catch (err) {
        console.warn('Formspree webhook fallback failed:', err);
      }

      alert('상담 신청이 완료되었습니다.');
      reset();
    } catch (e) {
      console.error('Submission failed:', e);
      try {
        handleFirestoreError(e, OperationType.WRITE, `leads/${leadId}`);
      } catch (fError) {
        // Log custom error JSON to developers
      }
      alert('오류가 발생했습니다. 잠시 후 다시 시도해주시거나 대표번호로 연락주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 150 }}
          animate={{ y: 0 }}
          exit={{ y: 150 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/80 z-[50] shadow-[0_-5px_15px_-1px_rgba(0,0,0,0.08)] lg:shadow-[0_-10px_40px_rgba(0,0,0,0.1)] px-4 py-3 pb-4 lg:py-0 lg:h-24 flex flex-col lg:flex-row items-center lg:px-8 lg:gap-6"
        >
          <div className="text-primary whitespace-nowrap hidden lg:flex items-center gap-4 shrink-0">
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
          
          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex-1 flex flex-col lg:flex-row gap-2 lg:gap-4 lg:items-center relative pt-5 lg:pt-0">
            {/* Agreement Checkbox: absolute on mobile, static on desktop */}
            <div className="absolute top-0 left-0 right-0 lg:static flex items-center justify-between gap-1.5 text-[10.5px] lg:text-[11px] text-zinc-500 cursor-pointer select-none">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  {...register('privacy', { required: true })} 
                  type="checkbox" 
                  className="rounded text-[#002C5F] focus:ring-[#002C5F] w-3.5 h-3.5 lg:text-primary lg:focus:ring-primary" 
                />
                <span className="font-medium">개인정보 수집 및 동의 [필수]</span>
              </label>
              <a 
                href="tel:01033708602"
                className="text-xs text-primary font-black tracking-tighter lg:hidden flex items-center gap-1 shrink-0 hover:opacity-85 transition-opacity"
              >
                <div className="w-5 h-5 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                  <Phone className="w-2.5 h-2.5 shrink-0" />
                </div>
                <span>010-3370-8602</span>
              </a>
            </div>

            {/* Row 1: Name & Phone (50:50 grid on mobile, flex on desktop) */}
            <div className="grid grid-cols-2 gap-2 w-full lg:flex lg:flex-1 lg:gap-4">
              <input 
                {...register('name', { required: true })}
                type="text" 
                placeholder="성함 입력" 
                className="w-full lg:flex-1 h-10 lg:h-12 px-3 lg:px-4 bg-stone-50 lg:bg-white border border-slate-200 rounded text-slate-900 text-sm focus:outline-none focus:border-[#002C5F] lg:focus:border-primary"
              />
              <input 
                {...register('phone', { required: true })}
                type="text" 
                placeholder="연락처 입력" 
                className="w-full lg:flex-1 h-10 lg:h-12 px-3 lg:px-4 bg-stone-50 lg:bg-white border border-slate-200 rounded text-slate-900 text-sm focus:outline-none focus:border-[#002C5F] lg:focus:border-primary"
              />
            </div>

            {/* Row 2 on mobile: Select (60%) & Button (40%) */}
            <div className="flex gap-2 w-full lg:contents">
              <select 
                {...register('interest', { required: true })}
                className="w-[60%] shrink-0 lg:w-auto lg:flex-1 h-10 lg:h-12 px-2.5 lg:px-4 bg-stone-50 lg:bg-white border border-slate-200 rounded text-slate-700 text-sm focus:outline-none focus:border-[#002C5F] lg:focus:border-primary"
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

              <button 
                disabled={isSubmitting}
                type="submit"
                className="w-[40%] flex-1 lg:w-auto lg:px-8 h-10 lg:h-12 bg-[#002C5F] lg:bg-accent hover:bg-[#001D3F] lg:hover:bg-[#e66400] text-white rounded font-black lg:font-bold text-sm lg:text-base transition-colors whitespace-nowrap shadow-md lg:shadow-lg shadow-[#002C5F]/15 lg:shadow-orange-500/20 flex items-center justify-center gap-1.5 shrink-0"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span className="lg:hidden">상담 예약</span>
                <span className="hidden lg:inline">상담 예약하기</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
