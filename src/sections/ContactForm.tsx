import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PROJECT_INFO } from '../constants';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface ContactFormData {
  name: string;
  phone: string;
  interest: string;
  privacy: boolean;
}

const PREFERRED_TIME_OPTIONS = [
  '평일 오전',
  '평일 오후',
  '평일 저녁',
  '주말',
  '언제든 가능',
];

function findInterestValueForRoom(room: string): string | undefined {
  const clean = room.trim().replace(/호$/, '');
  if (!clean) return undefined;
  const options = PROJECT_INFO.interestOptions || [];
  const exact = options.find((opt) => opt.value === `상업시설-${clean}호` || opt.value === room);
  if (exact) return exact.value;
  const byMatch = options.find((opt) => opt.value.includes(`${clean}호`) || opt.label.startsWith(`${clean}호`));
  return byMatch?.value;
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [customTime, setCustomTime] = useState('');
  const [timeError, setTimeError] = useState('');
  const [isRoomAutoHighlighted, setIsRoomAutoHighlighted] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const flashTimerRef = useRef<number | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ContactFormData>();

  const triggerCardFlash = () => {
    if (flashTimerRef.current !== null) {
      window.clearTimeout(flashTimerRef.current);
    }
    setIsFlashing(false);
    window.requestAnimationFrame(() => {
      setIsFlashing(true);
      flashTimerRef.current = window.setTimeout(() => {
        setIsFlashing(false);
        flashTimerRef.current = null;
      }, 950);
    });
  };

  const applyAskedRoom = (room: string) => {
    const matched = findInterestValueForRoom(room);
    if (!matched) return;
    setIsSuccess(false);
    setValue('interest', matched, { shouldValidate: true, shouldDirty: true });
    setIsRoomAutoHighlighted(true);
    triggerCardFlash();
  };

  useEffect(() => {
    try {
      const savedRoom = sessionStorage.getItem('storeAskRoom');
      if (savedRoom) {
        applyAskedRoom(savedRoom);
        window.setTimeout(() => {
          try {
            sessionStorage.removeItem('storeAskRoom');
          } catch {
            /* 무시 */
          }
        }, 0);
      }
    } catch {
      /* 무시 */
    }

    const handleStoreAsk = (e: Event) => {
      const room = (e as CustomEvent<{ room?: string }>).detail?.room;
      if (room) {
        applyAskedRoom(room);
        window.setTimeout(() => {
          try {
            sessionStorage.removeItem('storeAskRoom');
          } catch {
            /* 무시 */
          }
        }, 0);
      }
    };

    window.addEventListener('store-ask', handleStoreAsk);
    return () => {
      window.removeEventListener('store-ask', handleStoreAsk);
      if (flashTimerRef.current !== null) {
        window.clearTimeout(flashTimerRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTimeOption = (option: string) => {
    setSelectedTimes((prev) => {
      const next = prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option];
      if (next.length > 0 || customTime.trim()) {
        setTimeError('');
      }
      return next;
    });
  };

  const buildPreferredTime = () => {
    const parts: string[] = [];
    if (selectedTimes.length > 0) {
      parts.push(selectedTimes.join(', '));
    }
    const trimmedCustom = customTime.trim();
    if (trimmedCustom) {
      parts.push(trimmedCustom);
    }
    return parts.join(' · ').slice(0, 80);
  };

  const onInvalid = () => {
    if (selectedTimes.length === 0 && !customTime.trim()) {
      setTimeError('희망 시간을 선택하거나 적어 주세요.');
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    const preferredTime = buildPreferredTime();
    if (!preferredTime) {
      setTimeError('희망 시간을 선택하거나 적어 주세요.');
      return;
    }

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
        preferredTime,
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
            name: cleanName,
            phone: cleanPhone,
            interest: cleanInterest,
            희망시간: preferredTime,
            _subject: `[${PROJECT_INFO.name}] 상담 신청 - ${cleanName}`,
          }),
        });
      } catch (err) {
        console.warn('Formspree webhook fallback failed:', err);
      }

      setIsSuccess(true);
      setSelectedTimes([]);
      setCustomTime('');
      setTimeError('');
      setIsRoomAutoHighlighted(false);
      reset();
    } catch (error) {
      console.error('Submission failed:', error);
      try {
        handleFirestoreError(error, OperationType.WRITE, `leads/${leadId}`);
      } catch (fError) {
        // Log custom error JSON to developers
      }
      alert('상담 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes cfAskFlash {
          0% { box-shadow: 0 45px 100px -20px rgba(15,29,45,0.08), 0 0 0 0 rgba(255,111,0,0.55); }
          100% { box-shadow: 0 45px 100px -20px rgba(15,29,45,0.08), 0 0 0 18px rgba(255,111,0,0); }
        }
        .cf-flash {
          animation: cfAskFlash 0.9s ease-out 1;
        }
      `}</style>
      <span id="consult-form" aria-hidden="true" className="block h-0 scroll-mt-[72px]" />
      <section 
        id="contact" 
        className="relative scroll-mt-[72px] py-10 md:py-16 text-gray-905 px-6 bg-gradient-to-b from-white to-slate-50/70 overflow-hidden"
        style={{ scrollSnapAlign: 'start' }}
      >
      {/* Decorative Blur BG Orb */}
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-6 md:mb-10"
        >
          <span className="text-accent font-bold tracking-[0.2em] text-[11px] uppercase">Consultation</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-4 tracking-tight leading-tight break-keep">상담 신청 및 예약</h2>
          <p className="mt-4 text-gray-550 font-bold break-keep text-base max-w-lg mx-auto whitespace-pre-line leading-relaxed">
            {"하단에 정보를 남겨 주시면,\n실시간 잔여 호실 현황과 함께\n이 상권을 직접 보고 판단하실 수 있게 안내해 드립니다."}
          </p>
          <div className="w-14 h-1 bg-accent mx-auto mt-4 md:mt-6 rounded-full" />
        </motion.div>
 
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white text-primary p-12 rounded-3xl text-center shadow-[0_35px_90px_rgba(0,0,0,0.06)] border border-gray-100"
          >
            <h3 className="text-2xl font-black mb-4 tracking-tight text-gray-900">상담 신청이 완료되었습니다.</h3>
            <p className="text-gray-550 font-medium mb-8">빠른 시일 내에 전문 상담원이 연락드리겠습니다. 감사합니다.</p>
            <button 
              onClick={() => setIsSuccess(false)}
              className="px-10 py-4 bg-primary text-white font-extrabold rounded-2xl hover:bg-opacity-90 transition-all shadow-lg shadow-primary/15"
            >
              확인
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "bg-white text-gray-900 overflow-hidden rounded-3xl flex flex-col md:flex-row shadow-[0_45px_100px_-20px_rgba(15,29,45,0.08)] border border-gray-100/90 relative z-10",
              isFlashing && "cf-flash"
            )}
          >
            {/* Elegant Warm Beige Info Panel */}
            <div className="md:w-1/3 bg-[#EBEBE4] p-10 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-gray-200/60">
              <div className="mb-2 relative z-10">
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] text-gray-500 font-black tracking-widest uppercase mb-1.5 block">대표번호</label>
                    <p className="text-lg sm:text-xl font-extrabold text-[#111111] tracking-tight">
                      <a href="tel:031-293-1073" className="hover:text-accent hover:underline transition-colors">
                        {PROJECT_INFO.representativeNumber}
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-black tracking-widest uppercase mb-1.5 block">운영시간</label>
                    <p className="text-base sm:text-lg font-bold text-stone-700 tracking-tight leading-snug">
                      전화 상담 연중무휴
                      <span className="block mt-1">10:00 - 18:00</span>
                    </p>
                    <p className="mt-2 text-xs text-gray-500 leading-relaxed font-medium break-keep">
                      홍보관 방문은 100% 사전 예약제예요. 전화나 상담 신청으로 날짜를 먼저 잡아 주세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
 
            {/* Form Panel */}
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="md:w-2/3 p-10 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">성함</label>
                  <input
                    {...register('name', {
                      required: '성함을 입력해주세요.',
                      maxLength: { value: 64, message: '성함은 64자 이내로 입력해주세요.' }
                    })}
                    maxLength={64}
                    className={cn(
                      "w-full px-4 py-3 bg-slate-50/50 border rounded-xl text-gray-900 focus:outline-none focus:border-accent focus:bg-white transition-all font-semibold",
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    )}
                    placeholder="성함을 입력하세요"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">연락처</label>
                  <input
                    {...register('phone', { 
                      required: '연락처를 입력해주세요.',
                      maxLength: { value: 24, message: '연락처는 24자 이내로 입력해주세요.' },
                      pattern: { value: /^[0-9-]+$/, message: '숫자와 하이픈만 입력 가능합니다.' }
                    })}
                    maxLength={24}
                    className={cn(
                      "w-full px-4 py-3 bg-slate-50/50 border rounded-xl text-gray-900 focus:outline-none focus:border-accent focus:bg-white transition-all font-semibold",
                      errors.phone ? 'border-red-300' : 'border-gray-200'
                    )}
                    placeholder="010-0000-0000"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                </div>
              </div>
 
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">
                  {PROJECT_INFO.interestLabel || '관심호실/품목'}
                </label>
                <div className="relative">
                  <select
                    {...register('interest', {
                      required: '항목을 선택해주세요.',
                      onChange: () => setIsRoomAutoHighlighted(false),
                    })}
                    className={cn(
                      "w-full px-4 py-3 bg-slate-50/50 border rounded-xl focus:outline-none focus:bg-white transition-all appearance-none font-semibold",
                      isRoomAutoHighlighted
                        ? "border-[#FF6F00] text-[#D24A0E] focus:border-[#FF6F00]"
                        : errors.interest
                          ? "border-red-500 text-gray-900 focus:border-accent"
                          : "border-gray-200 text-gray-900 focus:border-accent"
                    )}
                  >
                    <option value="">항목을 선택하세요</option>
                    {(() => {
                      const optionsList = PROJECT_INFO.interestOptions || [
                        { value: '상업시설-117호', label: '117호 (라멘집 / 개인 필라테스)', group: '상업시설 (1F)' },
                        { value: '상업시설-118호', label: '118호 (브런치카페 / 베이커리카페)', group: '상업시설 (1F)' },
                        { value: '상업시설-119호', label: '119호 (문전약국)', group: '상업시설 (1F)' },
                        { value: '상업시설-126호', label: '126호 (한식집 / 샤브샤브전문점)', group: '상업시설 (1F)' },
                        { value: '상업시설-127호', label: '127호 (한식집 / 샤브샤브전문점)', group: '상업시설 (1F)' },
                        { value: '상업시설-128호', label: '128호 (국밥집 / 육개장)', group: '상업시설 (1F)' },
                        { value: '상업시설-129호', label: '129호 (프랜차이즈 맥주전문점)', group: '상업시설 (1F)' },
                        { value: '상업시설-기타', label: '기타 상업시설 문의', group: '상업시설 (1F)' },
                        { value: '오피스텔-기타', label: '오피스텔 문의', group: '주거용 오피스텔' },
                        { value: '기타', label: '기타 문의', group: '일반' }
                      ];
                      
                      const groupsMap: Record<string, any[]> = {};
                      optionsList.forEach((opt: any) => {
                        const gName = opt.group || '일반';
                        if (!groupsMap[gName]) {
                          groupsMap[gName] = [];
                        }
                        groupsMap[gName].push(opt);
                      });

                      return Object.keys(groupsMap).map((gName) => (
                        <optgroup key={gName} label={gName}>
                          {groupsMap[gName].map((opt: any) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </optgroup>
                      ));
                    })()}
                  </select>
                </div>
                {errors.interest && <p className="mt-1 text-xs text-red-500">{errors.interest.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">
                  연락·방문 희망 시간
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {PREFERRED_TIME_OPTIONS.map((option) => {
                    const isSelected = selectedTimes.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleTimeOption(option)}
                        className={cn(
                          "h-10 px-4 rounded-full text-xs sm:text-sm font-semibold border transition-colors cursor-pointer",
                          isSelected
                            ? "bg-deepgreen text-white border-deepgreen"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  maxLength={60}
                  value={customTime}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomTime(val);
                    if (selectedTimes.length > 0 || val.trim()) {
                      setTimeError('');
                    }
                  }}
                  className={cn(
                    "w-full px-4 py-3 bg-slate-50/50 border rounded-xl text-gray-900 focus:outline-none focus:border-accent focus:bg-white transition-all font-semibold text-sm",
                    timeError ? 'border-red-500' : 'border-gray-200'
                  )}
                  placeholder="구체적인 날짜·시간이 있으면 적어 주세요 (예: 토요일 11시 홍보관 방문)"
                />
                {timeError && <p className="mt-1 text-xs text-red-500">{timeError}</p>}
              </div>
 
              <div className="pt-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register('privacy', { required: '개인정보 이용약관에 동의해주세요.' })}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent filter accent-accent focus:outline-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500 group-hover:text-gray-750 transition-colors font-semibold">
                    개인정보 수집 및 이용 동의 (필수)
                  </span>
                </label>
                {errors.privacy && <p className="mt-1 text-xs text-red-500">{errors.privacy.message}</p>}
              </div>
 
              <button
                disabled={isSubmitting}
                className={cn(
                  "w-full py-4 bg-[#0d1825] text-white font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2",
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-[#152335] hover:scale-[1.01] active:scale-95 shadow-primary/10"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin w-full text-center" />
                    제출 중...
                  </>
                ) : (
                  '상담 예약하기'
                )}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </section>
    </>
  );
}
