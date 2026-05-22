import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Table, Download, Trash2, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/src/lib/utils';
import React from 'react';

// Mock leads data for demonstration
const mockLeads = [
  { id: '1', name: '홍길동', phone: '010-1234-5678', interest: '상업시설', createdAt: new Date().toISOString() },
  { id: '2', name: '김철수', phone: '010-9876-5432', interest: '오피스텔', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', name: '이영희', phone: '010-5555-4444', interest: '상업시설', createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export default function AdminDashboard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [leads, setLeads] = useState<any[]>(mockLeads);
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadLeads = () => {
      const stored = localStorage.getItem('property_leads');
      if (stored) {
        setLeads(JSON.parse(stored));
      } else {
        setLeads(mockLeads);
      }
    };

    loadLeads();
    
    // Simple polling to simulate real-time for the demo
    const interval = setInterval(loadLeads, 2000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '8602') { // Simple passcode based on last digits of phone
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const exportToExcel = () => {
    // Simple CSV export
    const headers = ['이름', '연락처', '관심항목', '신청일시'];
    const rows = leads.map(l => [l.name, l.phone, l.interest, format(new Date(l.createdAt), 'yyyy-MM-dd HH:mm')]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `상담신청내역_${format(new Date(), 'yyyyMMdd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    localStorage.setItem('property_leads', JSON.stringify(updated));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white w-full max-w-5xl h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center">
                  <Table className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">상담 신청 내역 관리</h2>
                  <p className="text-xs text-gray-500">실시간으로 접수된 고객 정보를 확인하고 관리합니다.</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden p-6">
              {!isAuthenticated ? (
                <div className="h-full flex items-center justify-center">
                  <form onSubmit={handleLogin} className="w-80 text-center">
                    <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">관리자 인증</h3>
                    <p className="text-sm text-gray-500 mb-6">보안을 위해 비밀번호를 입력해주세요.</p>
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="비밀번호 입력"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-primary/10 outline-none"
                      autoFocus
                    />
                    <button className="w-full py-3 bg-primary text-white font-bold rounded-xl active:scale-95 transition-transform">
                      로그인
                    </button>
                    <p className="mt-4 text-[10px] text-gray-400 italic font-medium tracking-tight">※ 문의: 010-3370-8602</p>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-medium text-gray-500">총 <span className="text-primary font-bold">{leads.length}</span>건의 신청</span>
                    <button 
                      onClick={exportToExcel}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      엑셀 다운로드
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-auto rounded-xl border border-gray-100 shadow-sm">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead className="sticky top-0 bg-gray-50 z-10">
                        <tr className="border-b border-gray-100">
                          <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">이름</th>
                          <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">연락처</th>
                          <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">관심품목</th>
                          <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">신청일시</th>
                          <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">관리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead) => (
                          <tr key={lead.id} className="border-b last:border-0 border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="p-4 text-sm font-bold text-gray-900">{lead.name}</td>
                            <td className="p-4 text-sm text-gray-600">{lead.phone}</td>
                            <td className="p-4">
                              <span className={cn(
                                "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight",
                                lead.interest === '상업시설' ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                              )}>
                                {lead.interest}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-gray-400">
                              {format(new Date(lead.createdAt), 'MM월 dd일 HH:mm')}
                            </td>
                            <td className="p-4">
                              <button 
                                onClick={() => handleDelete(lead.id)}
                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
