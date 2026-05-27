import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { useState } from 'react';
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

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();

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
            _subject: `[${PROJECT_INFO.name}] 상담 신청 - ${data.name}`,
          }),
        });
      } catch (err) {
        console.warn('Formspree webhook fallback failed:', err);
      }

      setIsSuccess(true);
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
    <section id="contact" className="relative py-28 text-gray-905 px-6 bg-gradient-to-b from-white to-slate-50/70 overflow-hidden">
      {/* Decorative Blur BG Orb */}
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <span className="text-accent font-bold tracking-[0.2em] text-[11px] uppercase">Consultation</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-4 tracking-tight leading-tight break-keep">상담 신청 및 예약</h2>
          <p className="mt-5 text-gray-500 font-semibold break-keep text-base max-w-lg mx-auto">{"정보를 입력해주시면 전문 상담원이 빠르고 정확하게 안내해 드리겠습니다."}</p>
          <div className="w-16 h-1.5 bg-accent mx-auto mt-8 rounded-full" />
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
            className="bg-white text-gray-900 overflow-hidden rounded-3xl flex flex-col md:flex-row shadow-[0_45px_100px_-20px_rgba(15,29,45,0.08)] border border-gray-100/90 relative z-10"
          >
            {/* Elegant Warm Beige Info Panel */}
            <div className="md:w-1/3 bg-[#EBEBE4] p-10 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-gray-200/60">
              <div className="mb-2 relative z-10">
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] text-gray-500 font-black tracking-widest uppercase mb-1.5 block">대표번호</label>
                    <p className="text-lg sm:text-xl font-extrabold text-[#111111] tracking-tight">{PROJECT_INFO.representativeNumber}</p>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-black tracking-widest uppercase mb-1.5 block">운영시간</label>
                    <p className="text-base sm:text-lg font-bold text-stone-700 tracking-tight">{PROJECT_INFO.businessHours}</p>
                  </div>
                </div>
              </div>
              <div className="mt-14 pt-10 border-t border-gray-300 relative z-10">
                <p className="text-[11px] text-gray-500 leading-relaxed font-semibold italic">
                  * 정밀한 상담을 위해 담당자 지정제로 운영되고 있습니다. 방문 전 미리 예약해주시면 더욱 편리합니다.
                </p>
              </div>
            </div>
 
            {/* Form Panel */}
            <form onSubmit={handleSubmit(onSubmit)} className="md:w-2/3 p-10 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">성함</label>
                  <input
                    {...register('name', { required: '성함을 입력해주세요.' })}
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
                      pattern: { value: /^[0-9-]+$/, message: '숫자와 하이픈만 입력 가능합니다.' }
                    })}
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
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">관심호실/품목</label>
                <div className="relative">
                  <select
                    {...register('interest', { required: '항목을 선택해주세요.' })}
                    className={cn(
                      "w-full px-4 py-3 bg-slate-50/50 border rounded-xl text-gray-900 focus:outline-none focus:border-accent focus:bg-white transition-all appearance-none font-semibold",
                      errors.interest ? 'border-red-500' : 'border-gray-200'
                    )}
                  >
                    <option value="">항목을 선택하세요</option>
                    <optgroup label="상업시설 (1F)">
                      <option value="상업시설-117호">117호 (라멘집 / 개인 필라테스)</option>
                      <option value="상업시설-118호">118호 (브런치카페 / 베이커리카페)</option>
                      <option value="상업시설-119호">119호 (문전약국)</option>
                      <option value="상업시설-126호">126호 (한식집 / 샤브샤브전문점)</option>
                      <option value="상업시설-127호">127호 (한식집 / 샤브샤브전문점)</option>
                      <option value="상업시설-128호">128호 (국밥집 / 육개장)</option>
                      <option value="상업시설-129호">129호 (프랜차이즈 맥주전문점)</option>
                      <option value="상업시설-기타">기타 상업시설 문의</option>
                    </optgroup>
                    <optgroup label="주거용 오피스텔">
                      <option value="오피스텔-3룸">3룸 혁신평면</option>
                      <option value="오피스텔-기타">일반 오피스텔 문의</option>
                    </optgroup>
                    <option value="기타">기타 문의</option>
                  </select>
                </div>
                {errors.interest && <p className="mt-1 text-xs text-red-500">{errors.interest.message}</p>}
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
  );
}
