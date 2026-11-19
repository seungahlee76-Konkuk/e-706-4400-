import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Loader2, Phone } from 'lucide-react';
import { PROJECT_INFO } from '../../constants';
import { navigate, useIsChooserView, usePath } from '../../lib/router';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface ContactFormData {
  name: string;
  phone: string;
  interest: string;
  privacy: boolean;
}

function findInterestValueForRoom(room: string): string | undefined {
  const clean = room.trim().replace(/호$/, '');
  if (!clean) return undefined;
  const options = PROJECT_INFO.interestOptions || [];
  const exact = options.find((opt) => opt.value === `상업시설-${clean}호` || opt.value === room);
  if (exact) return exact.value;
  const byMatch = options.find((opt) => opt.value.includes(`${clean}호`) || opt.label.startsWith(`${clean}호`));
  return byMatch?.value;
}

export default function StickyBottomForm() {
  const path = usePath();
  const isChooserView = useIsChooserView();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false));
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncedInterest, setSyncedInterest] = useState('');
  const { register, handleSubmit, reset, setValue } = useForm<ContactFormData>();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    setIsFormVisible(false);
    const target = document.getElementById('contact');
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsFormVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [path, isChooserView]);

  useEffect(() => {
    try {
      const savedRoom = sessionStorage.getItem('storeAskRoom');
      if (savedRoom) {
        const matched = findInterestValueForRoom(savedRoom);
        if (matched) {
          setSyncedInterest(matched);
          setValue('interest', matched, { shouldValidate: true, shouldDirty: true });
        }
      }
    } catch {
      /* 무시 */
    }

    const handleStoreAsk = (e: Event) => {
      const room = (e as CustomEvent<{ room?: string }>).detail?.room;
      if (!room) return;
      const matched = findInterestValueForRoom(room);
      if (matched) {
        setSyncedInterest(matched);
        setValue('interest', matched, { shouldValidate: true, shouldDirty: true });
      }
    };

    window.addEventListener('store-ask', handleStoreAsk);
    return () => window.removeEventListener('store-ask', handleStoreAsk);
  }, [setValue]);

  useEffect(() => {
    if (isVisible && syncedInterest) {
      setValue('interest', syncedInterest, { shouldValidate: true, shouldDirty: true });
    }
  }, [isVisible, syncedInterest, setValue]);

  const scrollToConsultForm = () => {
    const target = document.getElementById('consult-form') || document.getElementById('contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/store#consult-form');
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    const cleanName = data.name.trim().slice(0, 64);
    const cleanPhone = data.phone.trim().slice(0, 24);
    const cleanInterest = data.interest.trim().slice(0, 64);
    if (!cleanName || !cleanPhone || !cleanInterest) {
      alert('성함, 연락처, 관심 호실을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    const leadId = 'lead-' + Math.random().toString(36).substring(2, 11);
    try {
      // 1. Submit to Firestore database
      await setDoc(doc(db, 'leads', leadId), {
        id: leadId,
        name: cleanName,
        phone: cleanPhone,
        interest: cleanInterest,
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
      setSyncedInterest('');
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

  const shouldShowBar = isVisible && !(isMobile && isFormVisible);

  return (
    <AnimatePresence>
      {shouldShowBar && (
        <motion.div
          initial={{ y: 150 }}
          animate={{ y: 0 }}
          exit={{ y: 150 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/80 z-[50] shadow-[0_-5px_15px_-1px_rgba(0,0,0,0.08)] lg:shadow-[0_-10px_40px_rgba(0,0,0,0.1)] px-4 py-[6px] lg:py-0 lg:h-24 flex flex-row items-center lg:px-8 lg:gap-6"
        >
          {/* Mobile Bar (< 1024px): 1 row, ~60px height, 4:6 buttons */}
          <div className="grid grid-cols-[4fr_6fr] gap-2 w-full lg:hidden">
            <a
              href="tel:031-293-1073"
              className="h-12 rounded-[6px] bg-white border border-[#0F1C3A] text-[#0F1C3A] font-extrabold text-[14px] flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.99] transition-transform"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>전화 상담</span>
            </a>
            <button
              type="button"
              onClick={scrollToConsultForm}
              className="h-12 rounded-[6px] bg-[#FF6F00] text-white font-extrabold text-[15px] flex items-center justify-center whitespace-nowrap cursor-pointer border-0 active:scale-[0.99] transition-transform"
            >
              상담 신청
            </button>
          </div>

          <div className="text-primary whitespace-nowrap hidden xl:flex items-center gap-4 shrink-0">
            <div>
              <span className="text-[10px] block text-slate-500 font-normal uppercase tracking-widest">Special Consultation</span>
              <span className="font-bold">분양·임대 상담 예약</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <a href={`tel:${PROJECT_INFO.representativeNumber.replace(/[^0-9]/g, '')}`} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-primary tracking-tighter">{PROJECT_INFO.representativeNumber}</span>
            </a>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="hidden lg:flex w-full flex-1 flex-row gap-3 items-center relative min-w-0">
            {/* Agreement Checkbox */}
            <div className="flex items-center order-3 shrink-0 text-[11px] text-zinc-500 cursor-pointer select-none">
              <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input 
                  {...register('privacy', { required: true })} 
                  type="checkbox" 
                  className="rounded text-primary focus:ring-primary w-3.5 h-3.5 shrink-0" 
                />
                <span className="font-medium truncate">개인정보 수집 및 동의 [필수]</span>
              </label>
            </div>

            {/* Name & Phone */}
            <div className="flex flex-[28_1_292px] min-w-[292px] gap-3 order-1">
              <input 
                {...register('name', { required: true, maxLength: 64 })}
                type="text" 
                maxLength={64}
                placeholder="성함 입력" 
                className="w-full flex-[12_1_120px] min-w-[120px] h-12 px-4 bg-white border border-slate-200 rounded text-slate-900 text-sm focus:outline-none focus:border-primary"
              />
              <input 
                {...register('phone', { required: true, maxLength: 24 })}
                type="text" 
                maxLength={24}
                placeholder="연락처 입력" 
                className="w-full flex-[16_1_160px] min-w-[160px] h-12 px-4 bg-white border border-slate-200 rounded text-slate-900 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {/* Select & Button */}
            <select 
              {...register('interest', {
                required: true,
                onChange: (e) => setSyncedInterest(e.target.value),
              })}
              className="w-auto flex-[20_1_200px] min-w-[200px] order-2 h-12 px-4 bg-white border border-slate-200 rounded text-slate-700 text-sm focus:outline-none focus:border-primary"
            >
              <option value="">관심호실 선택</option>
              {(() => {
                const groupsMap: Record<string, typeof PROJECT_INFO.interestOptions> = {};
                PROJECT_INFO.interestOptions.forEach((opt) => {
                  const gName = opt.group || '일반';
                  if (!groupsMap[gName]) {
                    groupsMap[gName] = [];
                  }
                  groupsMap[gName].push(opt);
                });

                return Object.keys(groupsMap).map((gName) => (
                  <optgroup key={gName} label={gName}>
                    {groupsMap[gName].map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                ));
              })()}
            </select>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-[150px] px-0 order-4 h-12 bg-accent hover:bg-[#e66400] disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded font-extrabold text-[15px] relative group overflow-hidden transition-all duration-300 shadow-lg shadow-orange-500/20 flex items-center justify-center shrink-0 select-none cursor-pointer border border-transparent"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-white shrink-0" />
                    <span className="whitespace-nowrap">신청 등록 중...</span>
                  </div>
                ) : (
                  <>
                    {/* Default State: sliding text container */}
                    <div className="flex items-center justify-center gap-1.5 transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:-translate-y-10">
                      <Phone className="w-3.5 h-3.5 fill-current shrink-0 animate-pulse" />
                      <span className="whitespace-nowrap">상담 신청</span>
                    </div>
                    
                    {/* Hover State: sliding in from bottom */}
                    <div className="absolute inset-0 flex items-center justify-center gap-1.5 transition-all duration-500 ease-in-out translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 text-white font-black text-[15px] whitespace-nowrap">
                      <span>GO GO 고색! ➔</span>
                    </div>
                  </>
                )}
              </div>
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
