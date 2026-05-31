import { PROJECT_INFO } from '../../constants';

export default function Footer({ onAdminOpen }: { onAdminOpen: () => void }) {
  return (
    <footer className="bg-[#F8F9FA] text-gray-500 py-16 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
          <div>
            <h2 className="text-primary text-xl font-black tracking-tighter mb-4">
              e편한세상<span className="text-accent font-medium ml-1">CITY</span> 고색
            </h2>
            <p className="text-sm max-w-sm leading-relaxed text-gray-400">
              서수원 행정타운의 중심에서 선보이는 브랜드 프리미엄 라이프.
              고품격 주거 공간과 안정적인 수익형 상업시설의 가치를 직접 확인하세요.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-16">
            <div>
              <h4 className="text-primary text-xs font-bold uppercase tracking-widest mb-6">Explore</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#overview" className="hover:text-accent transition-colors">사업개요</a></li>
                <li><a href="#location" className="hover:text-accent transition-colors">입지분석</a></li>
                <li><a href="#md" className="hover:text-accent transition-colors">입점추천</a></li>
                <li><a href="#contact" className="hover:text-accent transition-colors">상담신청</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-primary text-xs font-bold uppercase tracking-widest mb-6">Support</h4>
              <ul className="space-y-4 text-sm">
                <li><a href={`tel:${PROJECT_INFO.representativeNumber.replace(/[^0-9]/g, '')}`} className="hover:text-accent transition-colors font-bold text-primary">대표문의</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">이용약관</a></li>
                <li><a href="#" className="hover:text-accent transition-colors text-accent">개인정보처리방침</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 text-xs italic">
          <p 
            onClick={() => {
              if (window.innerWidth >= 1024) {
                onAdminOpen();
              }
            }}
            className="text-gray-400 lg:cursor-pointer lg:hover:text-primary transition-colors select-none"
          >
            © 2026 e편한세상시티 고색 홍보센터. All rights reserved.
          </p>
          <p className="max-w-xl text-center md:text-right text-gray-400">
            ※ 본 웹사이트에 사용된 CG, 이미지, 기재 사항 등은 소비자의 이해를 돕기 위한 것으로 실제와 다를 수 있습니다. 반드시 현장 및 분양 홍보관을 통해 상세 내용을 확인하시기 바랍니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
