import { PROJECT_INFO } from '../../constants';
import { Link } from '../../lib/router';

export default function Footer({ onAdminOpen }: { onAdminOpen: () => void }) {
  return (
    <footer className="bg-[#F8F9FA] text-gray-500 pt-12 md:pt-14 pb-24 md:pb-24 lg:pb-32 pl-6 pr-6 lg:pr-28 border-t border-gray-100">
      <div className="max-w-7xl mx-auto text-left">
        {/* 1. 맨 위 얇은 링크 줄 */}
        <div className="pb-4 mb-7 border-b border-gray-200/80 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px]">
          <Link
            to="/privacy"
            className="font-bold text-accent hover:opacity-80 transition-opacity"
          >
            개인정보처리방침
          </Link>
          <span className="h-3 w-px bg-gray-300" aria-hidden="true" />
          <a
            href="https://blog.naver.com/placebusiness"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 font-semibold hover:text-accent transition-colors inline-flex items-center gap-1"
          >
            상가고민해결사 블로그
            <span className="text-xs">↗</span>
          </a>
        </div>

        {/* 2. 회사 정보 영역 */}
        <div className="mb-8">
          <h2 className="font-sans text-primary text-xl font-black tracking-tighter mb-2">
            e편한세상<span className="text-accent font-medium ml-1">CITY</span> 고색
          </h2>
          <p className="text-[14px] text-gray-500 mb-5 leading-relaxed">
            수원덕산병원 정문 앞 1층 근린생활시설 · 84타입 3룸 오피스텔 분양·임대 상담
          </p>

          <div className="text-[14px] leading-relaxed text-gray-500 space-y-1.5">
            <p>
              <span className="font-bold text-gray-700">시공 :</span> {PROJECT_INFO.builder}
              <span className="mx-2 text-gray-300">|</span>
              <span className="font-bold text-gray-700">분양·임대 대행 :</span> {PROJECT_INFO.agency}
            </p>
            <p>
              <span className="font-bold text-gray-700">홍보관 :</span> {PROJECT_INFO.showroomAddress}
            </p>
            <p>
              <span className="font-bold text-gray-700">분양·임대 문의 :</span>{' '}
              <a
                href="tel:031-293-1073"
                className="hover:text-accent hover:underline transition-colors"
              >
                {PROJECT_INFO.representativeNumber}
              </a>
              <span className="mx-2 text-gray-300">|</span>
              <span className="font-bold text-gray-700">전화 상담 :</span> 연중무휴 10:00–18:00
              <span className="mx-2 text-gray-300">|</span>
              <span className="font-bold text-gray-700">홍보관 방문 :</span> 100% 사전 예약제
            </p>
          </div>
        </div>

        {/* 3. 맨 아래 저작권 및 안내 문구 */}
        <div className="pt-6 border-t border-gray-200 space-y-2">
          <p
            onClick={() => {
              if (window.innerWidth >= 1024) {
                onAdminOpen();
              }
            }}
            className="text-xs text-gray-400 lg:cursor-pointer lg:hover:text-primary transition-colors select-none"
          >
            © 2026 e편한세상시티 고색 홍보센터. All rights reserved.
          </p>
          <p className="text-[12px] text-gray-400 leading-relaxed">
            이 사이트의 이미지는 이해를 돕기 위한 것으로 실제와 다를 수 있습니다. 인물이 나온 사진은 비식별 처리했습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
