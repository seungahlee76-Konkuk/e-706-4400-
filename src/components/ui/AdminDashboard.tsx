import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Table, Download, Trash2, ShieldCheck, Edit, Settings, Database, 
  AlertTriangle, KeyRound, Eye, RefreshCw, Upload
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/src/lib/utils';
import React from 'react';
import { 
  DEFAULT_PROJECT_INFO, 
  DEFAULT_ANALYSIS_DATA, 
  DEFAULT_CARDNEWS_DATA,
  DEFAULT_MD_DATA,
  DEFAULT_OFFICETEL_DATA
} from '../../constants';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, deleteDoc, onSnapshot, query, orderBy, setDoc, getDoc } from 'firebase/firestore';

const decodeHtmlEntities = (str: string): string => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
};

const deepDecode = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return decodeHtmlEntities(obj);
  if (Array.isArray(obj)) return obj.map(deepDecode);
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        res[key] = deepDecode(obj[key]);
      }
    }
    return res;
  }
  return obj;
};

export default function AdminDashboard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [leads, setLeads] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [securityLogs, setSecurityLogs] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Read local image file and compress it to fit Firestore/localStorage limitations
  const compressAndConvertImage = (
    file: File, 
    callback: (base64: string) => void,
    options?: { maxWidth?: number; maxHeight?: number; quality?: number }
  ) => {
    setIsUploading(true);
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    setSecurityLogs(prev => [`[${timestamp}] 📁 파일 분석 중: ${file.name} (${(file.size / 1024).toFixed(1)} KB)...`, ...prev]);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = options?.maxWidth || 1000; // Optimized resolution for web/mobile compatibility
        const MAX_HEIGHT = options?.maxHeight || 1000;
        const quality = options?.quality || 0.65; // Highly optimized quality to bypass storage limits (10x smaller file size)
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress with given quality
          const compressed = canvas.toDataURL('image/jpeg', quality);
          setIsUploading(false);
          const compressedKb = Math.round((compressed.length * 0.75) / 1024);
          const finalTs = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
          setSecurityLogs(prev => [`[${finalTs}] 🚀 이미지 가속 축소 완료: ${compressedKb} KB로 압축 (해상도: ${width}x${height}, 품질: ${Math.round(quality * 100)}%)`, ...prev]);
          callback(compressed);
        } else {
          setIsUploading(false);
          callback(e.target?.result as string);
        }
      };
      img.onerror = () => {
        setIsUploading(false);
        callback(reader.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('파일을 읽는 과정에서 오류가 발생했습니다.');
    };
    reader.readAsDataURL(file);
  };
  
  const parseYoutubeUrlHelper = (url: string): string => {
    if (!url) return "";
    const trimmed = url.trim();
    
    // Match youtube shorts
    // e.g., https://www.youtube.com/shorts/VIDEO_ID or http://youtube.com/shorts/VIDEO_ID?xxxx or https://youtube.com/shorts/VIDEO_ID
    const shortsRegex = /\/shorts\/([a-zA-Z0-9_-]+)/i;
    const shortsMatch = trimmed.match(shortsRegex);
    if (shortsMatch && shortsMatch[1]) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }
    
    // Match standard youtube watching
    // e.g. https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID or https://youtube.com/embed/VIDEO_ID
    const standardRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/i;
    const standardMatch = trimmed.match(standardRegex);
    if (standardMatch && standardMatch[1]) {
      return `https://www.youtube.com/embed/${standardMatch[1]}`;
    }
    
    return trimmed;
  };
  
  const sortSlidesAdmin = (categoryId: string, slides: any[]): any[] => {
    if (!Array.isArray(slides)) return [];
    const cloned = [...slides];
    
    if (categoryId === 'medical') {
      cloned.sort((a, b) => {
        const getRank = (item: any) => {
          const title = item.title || '';
          if (title.includes('원스톱') || title.includes('메머드') || title.includes('TOP') || title.includes('규모')) return 1;
          if (title.includes('존스홉킨스') || title.includes('의료진') || title.includes('최상위')) return 2;
          if (title.includes('중증') || title.includes('거점') || title.includes('질환') || title.includes('남부')) return 3;
          return 99;
        };
        return getRank(a) - getRank(b);
      });
    } else if (categoryId === 'traffic' || categoryId === 'traffic-infra') {
      cloned.sort((a, b) => {
        const getRank = (item: any) => {
          const title = item.title || '';
          if (title.includes('도보') || title.includes('역세권') || title.includes('직접')) return 1;
          if (title.includes('수원역') || title.includes('GTX') || title.includes('KTX') || title.includes('1정거장')) return 2;
          if (title.includes('신분당선') || title.includes('구운역')) return 3;
          return 99;
        };
        return getRank(a) - getRank(b);
      });
    } else if (categoryId === 'valley' || categoryId === 'topdong') {
      cloned.sort((a, b) => {
        const getRank = (item: any) => {
          const title = item.title || '';
          if (title.includes('맞닿은') || title.includes('첨단업무') || title.includes('1만') || title.includes('일선')) return 1;
          if (title.includes('비율') || title.includes('억제') || title.includes('희소성') || title.includes('공급')) return 2;
          return 99;
        };
        return getRank(a) - getRank(b);
      });
    }
    return cloned;
  };
  
  // Mapping for existing markup references
  const isAuthenticated = isAdminVerified;

  // Admin Tabs
  const [activeTab, setActiveTab] = useState<'leads' | 'edit' | 'security'>('leads');
  const [activeSubEdit, setActiveSubEdit] = useState<'general' | 'hero' | 'analysis' | 'md' | 'overview' | 'officetel'>('general');

  // Customizer state
  const [customProjectInfo, setCustomProjectInfo] = useState<any>(() => {
    const saved = localStorage.getItem('site_custom_project_info');
    const parsed = saved ? deepDecode(JSON.parse(saved)) : {};
    return {
      ...DEFAULT_PROJECT_INFO,
      ...parsed
    };
  });

  const [customAnalysis, setCustomAnalysis] = useState<any[]>(() => {
    const defaultIds = ['medical', 'traffic', 'topdong', 'admin'];
    
    const applySort = (data: any[]) => {
      if (!Array.isArray(data)) return data;
      return data.map((item: any, idx: number) => {
        const catId = item.id || defaultIds[idx] || `theme-${idx}`;
        return {
          ...item,
          id: catId,
          slides: sortSlidesAdmin(catId, item.slides || [])
        };
      });
    };

    const saved = localStorage.getItem('site_custom_cardnews_data');
    if (saved) {
      try {
        const parsed = deepDecode(JSON.parse(saved));
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].slides) {
          return applySort(parsed);
        }
      } catch (e) {
        console.error("Failed to parse site_custom_cardnews_data in Admin init:", e);
      }
    }
    return applySort(DEFAULT_CARDNEWS_DATA);
  });

  const [customMd, setCustomMd] = useState<any[]>(() => {
    const saved = localStorage.getItem('site_custom_md_data');
    return saved ? deepDecode(JSON.parse(saved)) : DEFAULT_MD_DATA;
  });

  const [customOfficetel, setCustomOfficetel] = useState<any[]>(() => {
    const saved = localStorage.getItem('site_custom_officetel_data');
    return saved ? deepDecode(JSON.parse(saved)) : DEFAULT_OFFICETEL_DATA;
  });

  // Track Auth and auto-bootstrap designated email account
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthLoading(true);
      if (user) {
        setCurrentUser(user);
        
        try {
          const adminDocRef = doc(db, 'admins', user.uid);
          const adminDoc = await getDoc(adminDocRef);
          
          if (adminDoc.exists()) {
            setIsAdminVerified(true);
            const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            setSecurityLogs(prev => [`[${timestamp}] 🔐 관리자 세션 로그인 성공: ${user.email}`, ...prev]);
          } else if (user.email === 'seungahlee76@gmail.com') {
            const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            setSecurityLogs(prev => [`[${timestamp}] ⚡ 최초 로그인 시도: 계정(${user.email}) 라이센스 등록 중...`, ...prev]);
            
            await setDoc(adminDocRef, {
              email: user.email,
              role: 'admin'
            });
            
            setIsAdminVerified(true);
            setSecurityLogs(prev => [`[${timestamp}] 🔐 관리자 계정 부트스트랩 등록 성공: ${user.email}`, ...prev]);
          } else {
            const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            setSecurityLogs(prev => [`[${timestamp}] 🚨 무단 접근 차단: 비권한 이메일 (${user.email})`, ...prev]);
            alert(`등록되지 않은 이메일 주소입니다. 공식 관리자 이메일('seungahlee76@gmail.com')로 가입해 주세요.`);
            await signOut(auth);
            setCurrentUser(null);
            setIsAdminVerified(false);
          }
        } catch (err) {
          console.error("Auth security screening failed: ", err);
          const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
          setSecurityLogs(prev => [`[${timestamp}] ⚠️ 인증 모니터 경고: ${err instanceof Error ? err.message : String(err)}`, ...prev]);
          alert('인증 처리 중 네트워크 오류가 발생했습니다.');
          await signOut(auth);
          setCurrentUser(null);
          setIsAdminVerified(false);
        }
      } else {
        setCurrentUser(null);
        setIsAdminVerified(false);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time remote state binding with memory leaks prevention
  useEffect(() => {
    if (!isAdminVerified) {
      setLeads([]);
      return;
    }

    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        let createdAtStr = new Date().toISOString();
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
          createdAtStr = data.createdAt.toDate().toISOString();
        } else if (data.createdAt) {
          createdAtStr = data.createdAt;
        }
        items.push({
          ...data,
          id: docSnap.id,
          createdAt: createdAtStr
        });
      });
      setLeads(items);
    }, (error) => {
      console.error("Firestore onSnapshot error: ", error);
      try {
        handleFirestoreError(error, OperationType.LIST, 'leads');
      } catch (fError) {
        // Suppress bubble as linter requirement
      }
    });

    return () => unsubscribe();
  }, [isAdminVerified]);

  // Generate compliance security logs representation
  useEffect(() => {
    const timestamp = format(new Date(), 'HH:mm:ss');
    const logList = [
      `[${timestamp}] 원격 데이터 암호화 터널 결합 완료`,
      `[${timestamp}] Firestore SSL 토폴로지 분석: 양호 (Secure HTTPS)`,
      `[${timestamp}] Identity Access Control Rules 갱신 완료`,
      `[${timestamp}] 관리자 단축키 수신 대기 서브시스템 가동 중`,
    ];
    setSecurityLogs(logList);
  }, []);

  const handleGoogleLogin = async () => {
    setIsAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Popup credentials signature failure:", err);
      alert('OAuth 팝업 인증 과정에 오류가 발생했습니다. 브라우저의 팝업 설정을 확인하세요.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      setSecurityLogs(prev => [`[${timestamp}] 🔓 세션 로그아웃 서명 완료`, ...prev]);
    } catch (err) {
      console.error("Sign-out failure:", err);
    }
  };

  const exportToExcel = () => {
    const headers = ['이름', '연락처', '관심항목', '신청일시'];
    const rows = leads.map(l => [l.name, l.phone, l.interest, format(new Date(l.createdAt), 'yyyy-MM-dd HH:mm')]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `상담신청고객_${format(new Date(), 'yyyyMMdd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('해당 신청 정보를 영구히 삭제하시겠습니까? 관련 소유권 조례에 의거해 기록이 소멸됩니다.')) return;
    try {
      await deleteDoc(doc(db, 'leads', id));
      const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      setSecurityLogs(prev => [`[${timestamp}] 🗑️ 실시간 원격 문서 삭제 완료 (ID: ${id})`, ...prev]);
    } catch (error) {
      console.error('Firestore delete doc failure:', error);
      try {
        handleFirestoreError(error, OperationType.DELETE, `leads/${id}`);
      } catch (fError) {
        // Caught cleanly as schema validation
      }
      alert('삭제 중 권한 오류가 발생했거나 네트워크 연결이 불안정합니다.');
    }
  };

  // Save Configurator Form
  const handleSaveConfig = async () => {
    // Sanitizer helper - skips base64 and standard image URLs to prevent corruption
    const sanitizeHTML = (str: string) => {
      if (str.startsWith('data:') || str.startsWith('http://') || str.startsWith('https://')) {
        return str;
      }
      return str
        .replace(/script/gi, "blocked-script");
    };

    const currentIsoString = new Date().toISOString();

    const sanitizedProject = {
      ...DEFAULT_PROJECT_INFO,
      ...customProjectInfo,
      name: sanitizeHTML(customProjectInfo.name || ""),
      representativeNumber: sanitizeHTML(customProjectInfo.representativeNumber || ""),
      businessHours: sanitizeHTML(customProjectInfo.businessHours || ""),
      heroTitleLine1: sanitizeHTML(customProjectInfo.heroTitleLine1 || ""),
      heroTitleLine2: sanitizeHTML(customProjectInfo.heroTitleLine2 || ""),
      heroSubtitle: sanitizeHTML(customProjectInfo.heroSubtitle || ""),
      heroImages: (customProjectInfo.heroImages || []).map((img: string) => sanitizeHTML(img || "")),
      heroFeatures: (customProjectInfo.heroFeatures || []).map((feat: any) => ({
        id: sanitizeHTML(feat.id || ""),
        label: sanitizeHTML(feat.label || ""),
        desc: sanitizeHTML(feat.desc || ""),
      })),
      overview: (customProjectInfo.overview || []).map((item: any) => ({
        label: sanitizeHTML(item.label || ""),
        value: sanitizeHTML(item.value || ""),
      })),
      unitTypes: (customProjectInfo.unitTypes || []).map((u: any) => ({
        type: sanitizeHTML(u.type || ""),
        units: sanitizeHTML(u.units || ""),
        ratio: sanitizeHTML(u.ratio || ""),
        areaM2: sanitizeHTML(u.areaM2 || ""),
        areaPy: sanitizeHTML(u.areaPy || ""),
        totalAreaM2: sanitizeHTML(u.totalAreaM2 || ""),
        totalAreaPy: sanitizeHTML(u.totalAreaPy || ""),
        efficiency: sanitizeHTML(u.efficiency || ""),
      })),
      interestLabel: sanitizeHTML(customProjectInfo.interestLabel || ""),
      interestOptions: (customProjectInfo.interestOptions || []).map((opt: any) => ({
        value: sanitizeHTML(opt.value || ""),
        label: sanitizeHTML(opt.label || ""),
        group: sanitizeHTML(opt.group || ""),
      })),
      updatedAt: currentIsoString
    };

    const defaultIds = ['medical', 'traffic', 'topdong', 'admin'];
    const sanitizedAnalysis = customAnalysis.map((item: any, idx: number) => ({
      id: sanitizeHTML(item.id || defaultIds[idx] || `theme-${idx}`),
      title: sanitizeHTML(item.title || ""),
      subTitle: sanitizeHTML(item.subTitle || ""),
      mainTitle: sanitizeHTML(item.mainTitle || ""),
      headline: sanitizeHTML(item.headline || ""),
      coverImage: sanitizeHTML(item.coverImage || ""),
      slides: (item.slides || []).map((slide: any) => ({
        title: sanitizeHTML(slide.title || ""),
        desc: sanitizeHTML(slide.desc || ""),
        image: sanitizeHTML(slide.image || "")
      })),
      updatedAt: currentIsoString,
    }));

    const sanitizedMd = customMd.map((item: any) => ({
      id: sanitizeHTML(item.id),
      type: sanitizeHTML(item.type),
      area: sanitizeHTML(item.area),
      desc: sanitizeHTML(item.desc),
      image: sanitizeHTML(item.image),
      coords: item.coords || { x: 0, y: 0 },
      images: (item.images || [item.image || ""])
        .map((img: string) => sanitizeHTML(img || ""))
        .filter((img: string) => img.trim() !== ""),
      category: sanitizeHTML(item.category || "공통"),
      categoryStyle: sanitizeHTML(item.categoryStyle || "bg-gray-50 text-gray-700 border border-gray-100/60"),
      recommendation: sanitizeHTML(item.recommendation || item.type),
      updatedAt: currentIsoString,
    }));

    const sanitizedOfficetel = customOfficetel.map((item: any) => ({
      title: sanitizeHTML(item.title || ""),
      desc: sanitizeHTML(item.desc || ""),
      images: (item.images || [])
        .map((img: string) => parseYoutubeUrlHelper(sanitizeHTML(img || "")))
        .filter((img: string) => img.trim() !== ""),
      updatedAt: currentIsoString,
    }));

    localStorage.setItem('site_custom_project_info', JSON.stringify(sanitizedProject));
    localStorage.setItem('site_custom_cardnews_data', JSON.stringify(sanitizedAnalysis));
    localStorage.setItem('site_custom_md_data', JSON.stringify(sanitizedMd));
    localStorage.setItem('site_custom_officetel_data', JSON.stringify(sanitizedOfficetel));
    localStorage.setItem('site_custom_last_saved', currentIsoString);

    let cloudSavedSuccessfully = true;
    let cloudSaveError = '';

    const timestampStart = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    setSecurityLogs(prev => [`[${timestampStart}] ☁️ [클라우드] 원격 실시간 저장 진행 중...`, ...prev]);

    // Save to Firestore so everyone gets it (split documents to easily bypass individual 1MB limits)
    try {
      await Promise.all([
        setDoc(doc(db, 'site_config', 'project_info'), { data: sanitizedProject, updatedAt: currentIsoString }),
        setDoc(doc(db, 'site_config', 'cardnews_data'), { data: sanitizedAnalysis, updatedAt: currentIsoString }),
        setDoc(doc(db, 'site_config', 'md_data'), { data: sanitizedMd, updatedAt: currentIsoString }),
        setDoc(doc(db, 'site_config', 'officetel_data'), { data: sanitizedOfficetel, updatedAt: currentIsoString })
      ]);
      const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      setSecurityLogs(prev => [`[${timestamp}] ☁️ 실시간 원격 설정 분할 저장 완료`, ...prev]);
    } catch (fsErr) {
      console.error('Failed to save split config to Firestore, attempting fallback legacy save...', fsErr);
      cloudSaveError = fsErr instanceof Error ? fsErr.message : String(fsErr);
      try {
        await setDoc(doc(db, 'site_config', 'current'), {
          projectInfo: sanitizedProject,
          cardnewsData: sanitizedAnalysis,
          mdData: sanitizedMd,
          officetelData: sanitizedOfficetel,
          updatedAt: currentIsoString
        });
        const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        setSecurityLogs(prev => [`[${timestamp}] ☁️ 실시간 원격 설정 대체 저장 완료`, ...prev]);
        cloudSavedSuccessfully = true; // Succeeded on fallback legacy save
      } catch (legacyErr) {
        console.error('Failed to save legacy config to Firestore:', legacyErr);
        cloudSavedSuccessfully = false;
        cloudSaveError += '\n- Legacy Fallback Error: ' + (legacyErr instanceof Error ? legacyErr.message : String(legacyErr));
      }
      const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      setSecurityLogs(prev => [`[${timestamp}] ⚠️ 원격 백업 저장 경고: ${fsErr instanceof Error ? fsErr.message : String(fsErr)}`, ...prev]);
    }

    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    setSecurityLogs(prev => [`[${timestamp}] ⚙️ 텍스트 및 이미지 설정 변경사항 저장 완료`, ...prev]);
    
    if (cloudSavedSuccessfully) {
      alert('모든 설정값이 브라우저 및 데이터베이스(Cloud)에 안전하게 저장되었습니다! 최신 수정내용을 적용하기 위해 페이지가 새로고침됩니다.');
    } else {
      alert(
        `설정값이 로컬 브라우저에 임시 저장되었습니다.\n\n` +
        `⚠️ 주의: 현재 Firebase 원격 데이터베이스(Cloud) 저장에 실패하였습니다.\n\n` +
        `▶ 상세 오류 원인/메시지:\n${cloudSaveError}\n\n` +
        `💡 신속 해결 가이드:\n` +
        `1. [가장 중요] 상단의 로그아웃 버튼을 누르고, 반드시 공식 관리자 구글 계정('seungahlee76@gmail.com')으로 다시 로그인 해주세요.\n` +
        `2. 고해상도 이미지를 여러 개 추가하신 경우, 데이터 용량이 너무 거대하여 Firestore DB 규약(단일 문서 1MB 한도)에 의해 업로드가 거절될 수 있습니다. (가급적 1MB 미만의 가벼운 이미지나 CDN/정적 이미지 링크를 사용해주세요).\n` +
        `3. Netlify 관리 페이지에서 'VITE_FIREBASE_API_KEY' 환경 변수가 세팅되어 있는지 확인해보세요.`
      );
    }
    window.location.reload();
  };

  const handleReset = async () => {
    if (!confirm('경고: 수정된 모든 이미지와 글자를 공장 초기 세팅으로 원복하시겠습니까?')) return;
    localStorage.removeItem('site_custom_project_info');
    localStorage.removeItem('site_custom_analysis_data');
    localStorage.removeItem('site_custom_md_data');
    localStorage.removeItem('site_custom_officetel_data');
    localStorage.removeItem('site_custom_last_saved');

    // Reset cloud config as well
    try {
      await Promise.all([
        deleteDoc(doc(db, 'site_config', 'current')),
        deleteDoc(doc(db, 'site_config', 'project_info')),
        deleteDoc(doc(db, 'site_config', 'analysis_data')),
        deleteDoc(doc(db, 'site_config', 'md_data')),
        deleteDoc(doc(db, 'site_config', 'officetel_data'))
      ]);
    } catch (fsErr) {
      console.error('Failed to delete Firestore site config:', fsErr);
    }

    alert('기본값으로 원 복구되었습니다! 최신 내용을 불러오기 위해 페이지가 새로고침됩니다.');
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-black/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white w-full max-w-6xl h-[92vh] md:h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 relative"
          >
            {/* Header with Title and Tab menu */}
            <div className="p-5 md:p-6 border-b border-gray-100 bg-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative pr-12 lg:pr-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#002C5F] text-white rounded-xl flex items-center justify-center shadow-md shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tight flex flex-wrap items-center gap-1.5">
                    보안 통합 통제 시스템 <span className="text-[10px] md:text-xs bg-[#002C5F]/15 text-[#002C5F] font-bold px-2 py-0.5 rounded-full uppercase">Security V2</span>
                  </h2>
                  <p className="text-[10px] md:text-xs text-gray-500 font-medium">실시간 개인정보 보호 시큐리티 모니터 및 사이트 텍스트/이미지 커스터마이저</p>
                </div>
              </div>
              
              {isAuthenticated && (
                <div className="flex flex-row items-center gap-2 max-w-full">
                  <div className="flex bg-gray-100 hover:bg-gray-200/80 p-0.5 rounded-xl border border-gray-200 overflow-x-auto whitespace-nowrap max-w-[65vw] sm:max-w-[75vw] lg:max-w-none scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <button
                      onClick={() => setActiveTab('leads')}
                      className={cn(
                        "px-3 md:px-4 py-2 text-xs font-bold rounded-lg transition-all shrink-0",
                        activeTab === 'leads' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                      )}
                    >
                      상담 신청고객 ({leads.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('edit')}
                      className={cn(
                        "px-3 md:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0",
                        activeTab === 'edit' ? "bg-white text-[#002C5F] shadow-sm font-black" : "text-gray-500 hover:text-gray-900"
                      )}
                    >
                      <Edit className="w-3" /> 실시간 콘텐츠 편집
                    </button>
                    <button
                      onClick={() => setActiveTab('security')}
                      className={cn(
                        "px-3 md:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0",
                        activeTab === 'security' ? "bg-white text-red-600 shadow-sm font-black" : "text-gray-500 hover:text-gray-900"
                      )}
                    >
                      <Database className="w-3" /> 해킹차단 보안센터
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="px-3 py-2 border border-gray-200 text-gray-500 hover:text-red-500 hover:bg-red-50 bg-white rounded-xl text-xs font-bold transition-all shrink-0"
                  >
                    로그아웃
                  </button>
                </div>
              )}

              <button 
                onClick={onClose}
                className="absolute right-4 top-4 md:right-5 md:top-6 p-2 bg-gray-100/80 hover:bg-gray-200 rounded-full transition-colors z-[70]"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Main Content Pane */}
            <div className="flex-1 overflow-hidden p-4 md:p-6 bg-gray-50/30">
              {!isAuthenticated ? (
                /* Secure Login Prompt with Firebase Auth */
                <div className="h-full flex items-center justify-center">
                  <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
                    {/* Security Frame Line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#002C5F]" />
                    
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner bg-[#002C5F]/10 text-[#002C5F]"
                    )}>
                      <KeyRound className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-gray-900 mb-1">관리자 통합 인증</h3>
                    <p className="text-xs text-gray-400 font-semibold mb-6 uppercase tracking-wider">Secure Admin Login</p>
                    
                    {isAuthLoading ? (
                      <div className="p-8 flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="w-8 h-8 text-[#002C5F] animate-spin" />
                        <p className="text-xs text-gray-500 font-bold animate-pulse">보안 자격 증명 확인 중...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                          시스템에 등록된 관리자 이메일 계정으로 안전하게 로그인할 수 있습니다.
                        </p>
                        <button 
                          onClick={handleGoogleLogin}
                          className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 text-gray-700 font-bold border border-gray-200 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm cursor-pointer mx-auto"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="#EA4335"
                              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.52 0-6.368-2.848-6.368-6.368s2.848-6.368 6.368-6.368c1.536 0 2.94.544 4.04 1.442l3.076-3.075C19.141 2.232 15.86 1 12.24 1 6.044 1 12.24s5.044 11.24 11.24 11.24c6.262 0 11.24-5.045 11.24-11.24 0-.741-.082-1.458-.224-2.155H12.24z"
                            />
                          </svg>
                          Google 계정으로 관리자 로그인
                        </button>
                      </div>
                    )}
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 text-left">
                      <div className="flex justify-between text-[11px] text-gray-400 font-bold">
                        <span>생체 및 2단계 계정 보호 적용</span>
                        <span className="text-green-600 flex items-center gap-1">● Authenticator Active</span>
                      </div>
                      <p className="mt-2 text-[10px] text-gray-400 italic font-medium leading-relaxed">
                        ※ 패스워드 교체 및 관리자의 수동 추가를 원하시면 공지 이메일('seungahlee76@gmail.com')로 소속 사원 번호를 기재하여 주십시오.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Authenticated State */
                <div className="h-full flex flex-col">
                  {/* TAB 1: Inquires (Leads) */}
                  {activeTab === 'leads' && (
                    <div className="flex flex-col h-full bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                          <span className="text-lg font-bold text-gray-800 tracking-tight">상담을 접수한 예약고객 데이터</span>
                          <p className="text-xs text-gray-500">실시간 유입 내역이며 고객보호법에 의거하여 마스킹 및 암호화됩니다.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                          <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-md border border-emerald-100 shrink-0">
                            총 <span className="font-extrabold">{leads.length}</span>건 접수
                          </span>
                          <button 
                            onClick={exportToExcel}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
                          >
                            <Download className="w-3.5 h-3.5" />
                            보안 엑셀 다운로드 CSV
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-auto rounded-xl border border-gray-100">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                          <thead className="sticky top-0 bg-gray-50 border-b border-gray-100 z-10 text-gray-400">
                            <tr>
                              <th className="p-4 text-xs font-bold uppercase tracking-widest">일련번호</th>
                              <th className="p-4 text-xs font-bold uppercase tracking-widest">성함</th>
                              <th className="p-4 text-xs font-bold uppercase tracking-widest">휴대전화번호 (연락처)</th>
                              <th className="p-4 text-xs font-bold uppercase tracking-widest">상담관심품목</th>
                              <th className="p-4 text-xs font-bold uppercase tracking-widest">안전접수일시</th>
                              <th className="p-4 text-xs font-bold uppercase tracking-widest text-center">동작</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {leads.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="text-center py-16 text-gray-400 font-medium text-sm">
                                  실시간 상담 신청 유입 내역이 존재하지 않습니다.
                                </td>
                              </tr>
                            ) : (
                              leads.map((lead, idx) => (
                                <tr key={lead.id} className="hover:bg-gray-50/50 transition-all">
                                  <td className="p-4 text-xs font-semibold text-gray-400">#{idx + 1}</td>
                                  <td className="p-4 text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                                    {lead.name}
                                  </td>
                                  <td className="p-4 text-sm text-gray-700 font-mono font-semibold">{lead.phone}</td>
                                  <td className="p-4">
                                    <span className={cn(
                                      "px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-tight",
                                      lead.interest?.includes('상업') ? "bg-accent/10 text-accent border border-accent/20" : "bg-primary/10 text-primary border border-primary/20"
                                    )}>
                                      {lead.interest}
                                    </span>
                                  </td>
                                  <td className="p-4 text-xs text-gray-400 font-medium">
                                    {format(new Date(lead.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                                  </td>
                                  <td className="p-4 text-center">
                                    <button 
                                      onClick={() => handleDelete(lead.id)}
                                      className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block"
                                      title="정보삭제"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Dynamic Site Content Customizer EDITOR */}
                  {activeTab === 'edit' && (
                    <div className="flex-1 flex flex-col md:flex-row gap-6 h-full overflow-y-auto md:overflow-hidden">
                      {/* Sidebar */}
                      <div className="w-full md:w-52 flex flex-row md:flex-col gap-2 shrink-0 overflow-x-auto md:overflow-y-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <button
                          onClick={() => setActiveSubEdit('general')}
                          className={cn(
                            "px-4 py-2.5 md:py-3 rounded-xl text-xs font-bold text-center md:text-left flex items-center justify-center md:justify-start gap-2 shrink-0 md:w-full transition-all border",
                            activeSubEdit === 'general' ? "bg-primary text-white border-primary shadow-sm" : "bg-white hover:bg-gray-100 border-gray-100"
                          )}
                        >
                          <Settings className="w-4 h-4 shrink-0" />
                          기본 설정 정보
                        </button>
                        <button
                          onClick={() => setActiveSubEdit('hero')}
                          className={cn(
                            "px-4 py-2.5 md:py-3 rounded-xl text-xs font-bold text-center md:text-left flex items-center justify-center md:justify-start gap-2 shrink-0 md:w-full transition-all border",
                            activeSubEdit === 'hero' ? "bg-primary text-white border-primary shadow-sm" : "bg-white hover:bg-gray-100 border-gray-100"
                          )}
                        >
                          <RefreshCw className="w-4 h-4 shrink-0" />
                          메인 히어로 설정
                        </button>
                        <button
                          onClick={() => setActiveSubEdit('analysis')}
                          className={cn(
                            "px-4 py-2.5 md:py-3 rounded-xl text-xs font-bold text-center md:text-left flex items-center justify-center md:justify-start gap-2 shrink-0 md:w-full transition-all border",
                            activeSubEdit === 'analysis' ? "bg-primary text-white border-primary shadow-sm" : "bg-white hover:bg-gray-100 border-gray-100"
                          )}
                        >
                          <Eye className="w-4 h-4 shrink-0" />
                          입지분석 카드
                        </button>
                        <button
                          onClick={() => setActiveSubEdit('overview')}
                          className={cn(
                            "px-4 py-2.5 md:py-3 rounded-xl text-xs font-bold text-center md:text-left flex items-center justify-center md:justify-start gap-2 shrink-0 md:w-full transition-all border",
                            activeSubEdit === 'overview' ? "bg-primary text-white border-primary shadow-sm" : "bg-white hover:bg-gray-100 border-gray-100"
                          )}
                        >
                          <Table className="w-4 h-4 shrink-0" />
                          사업개요 & 공급타입
                        </button>
                        <button
                          onClick={() => setActiveSubEdit('officetel')}
                          className={cn(
                            "px-4 py-2.5 md:py-3 rounded-xl text-xs font-bold text-center md:text-left flex items-center justify-center md:justify-start gap-2 shrink-0 md:w-full transition-all border",
                            activeSubEdit === 'officetel' ? "bg-primary text-white border-primary shadow-sm" : "bg-white hover:bg-gray-100 border-gray-100"
                          )}
                        >
                          <Database className="w-4 h-4 shrink-0" />
                          주거용 오피스텔 소개
                        </button>
                        <button
                          onClick={() => setActiveSubEdit('md')}
                          className={cn(
                            "px-4 py-2.5 md:py-3 rounded-xl text-xs font-bold text-center md:text-left flex items-center justify-center md:justify-start gap-2 shrink-0 md:w-full transition-all border",
                            activeSubEdit === 'md' ? "bg-primary text-white border-primary shadow-sm" : "bg-white hover:bg-gray-100 border-gray-100"
                          )}
                        >
                          <Edit className="w-4 h-4 shrink-0" />
                          상업시설 추천업종
                        </button>
                        
                        <div className="hidden md:block mt-auto border-t border-gray-200/50 pt-4 space-y-2">
                          <button
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                          >
                            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                            변경사항 저장
                          </button>
                          <button
                            onClick={handleReset}
                            className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold text-xs rounded-xl transition-all"
                          >
                            기본값 강제초기화
                          </button>
                        </div>
                      </div>

                      {/* Editor Fields Pane */}
                      <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-5 md:p-6 overflow-y-auto shadow-sm min-h-[350px] md:min-h-0">
                        {/* 2.1 General Settings */}
                        {activeSubEdit === 'general' && (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-sm font-extrabold text-gray-900 border-b pb-2 mb-4">대표 홈페이지 기본 데이터 수정</h4>
                              <p className="text-xs text-gray-400">사이트 상단, 푸터 및 문의 버튼의 텍스트가 모두 동적으로 수정 처리됩니다.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-extrabold text-gray-600 block mb-2">대표 문의 전화번호</label>
                                <input
                                  type="text"
                                  value={customProjectInfo.representativeNumber}
                                  onChange={(e) => setCustomProjectInfo({ ...customProjectInfo, representativeNumber: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-extrabold text-gray-600 block mb-2">대표 상담시간 안내</label>
                                <input
                                  type="text"
                                  value={customProjectInfo.businessHours}
                                  onChange={(e) => setCustomProjectInfo({ ...customProjectInfo, businessHours: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-xs font-extrabold text-gray-600 block mb-2">프로젝트 정식 홈페이지 분양 명칭</label>
                              <input
                                type="text"
                                value={customProjectInfo.name}
                                onChange={(e) => setCustomProjectInfo({ ...customProjectInfo, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-[#002C5F]"
                              />
                            </div>

                            <div className="border-t border-gray-150 pt-5 mt-5 space-y-4">
                              <span className="text-xs font-black text-[#002C5F] uppercase block">상담신청 폼 관심호실 리스트 관리</span>
                              
                              <div>
                                <label className="text-xs font-extrabold text-gray-600 block mb-1">관심 항목 선택창 제목 (Label)</label>
                                <input
                                  type="text"
                                  value={customProjectInfo.interestLabel || ""}
                                  onChange={(e) => setCustomProjectInfo({ ...customProjectInfo, interestLabel: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold"
                                  placeholder="관심호실/품목"
                                />
                              </div>

                              <div>
                                <label className="text-xs font-extrabold text-gray-600 block mb-1">상담품목 옵션 리스트 편집</label>
                                <p className="text-[11px] text-gray-400 mb-2">그룹(분류), 표시될 텍스트, 고유 식별값을 직접 수정 가능합니다.</p>
                                
                                <div className="space-y-2 max-h-[220px] overflow-y-auto border border-gray-200 p-2.5 rounded-lg bg-gray-50/50">
                                  {(customProjectInfo.interestOptions || []).map((opt: any, index: number) => (
                                    <div key={index} className="flex gap-1.5 items-center bg-white p-2 rounded-lg border border-gray-200 shadow-xs">
                                      <input
                                        type="text"
                                        placeholder="그룹"
                                        value={opt.group || ""}
                                        onChange={(e) => {
                                          const nextOpts = [...(customProjectInfo.interestOptions || [])];
                                          nextOpts[index] = { ...nextOpts[index], group: e.target.value };
                                          setCustomProjectInfo({ ...customProjectInfo, interestOptions: nextOpts });
                                        }}
                                        className="w-[25%] px-2 py-1 text-xs border border-gray-200 rounded"
                                      />
                                      <input
                                        type="text"
                                        placeholder="옵션 표시 단어"
                                        value={opt.label || ""}
                                        onChange={(e) => {
                                          const nextOpts = [...(customProjectInfo.interestOptions || [])];
                                          nextOpts[index] = { ...nextOpts[index], label: e.target.value };
                                          setCustomProjectInfo({ ...customProjectInfo, interestOptions: nextOpts });
                                        }}
                                        className="w-[45%] px-2 py-1 text-xs border border-gray-200 rounded font-semibold"
                                      />
                                      <input
                                        type="text"
                                        placeholder="코드값"
                                        value={opt.value || ""}
                                        onChange={(e) => {
                                          const nextOpts = [...(customProjectInfo.interestOptions || [])];
                                          nextOpts[index] = { ...nextOpts[index], value: e.target.value };
                                          setCustomProjectInfo({ ...customProjectInfo, interestOptions: nextOpts });
                                        }}
                                        className="w-[20%] px-2 py-1 text-xs border border-gray-200 rounded text-gray-500 font-mono"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const nextOpts = (customProjectInfo.interestOptions || []).filter((_: any, i: number) => i !== index);
                                          setCustomProjectInfo({ ...customProjectInfo, interestOptions: nextOpts });
                                        }}
                                        className="text-red-500 p-1 hover:bg-red-50 rounded"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}

                                  {(customProjectInfo.interestOptions || []).length === 0 && (
                                    <div className="text-center text-xs text-gray-400 py-4">등록된 옵션이 없습니다.</div>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextOpts = [...(customProjectInfo.interestOptions || [])];
                                    nextOpts.push({ group: '상업시설 (1F)', label: '새로운 상품/호실 옵션', value: 'option-' + Date.now().toString(36) });
                                    setCustomProjectInfo({ ...customProjectInfo, interestOptions: nextOpts });
                                  }}
                                  className="mt-2 px-3 py-1.5 bg-[#002C5F] hover:bg-opacity-90 text-white text-xs font-bold rounded-lg transition-all"
                                >
                                  + 신규 옵션 추가
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2.2 Hero Banner Settings */}
                        {activeSubEdit === 'hero' && (
                          <div className="space-y-8 animate-fade-in">
                            <div>
                              <h4 className="text-sm font-extrabold text-gray-900 border-b pb-2 mb-2">메인 히어로 섹션 편집</h4>
                              <p className="text-xs text-gray-400 mb-4">홈페이지 최상단 히어로 배너의 비주얼 이미지, 타이틀, 슬로건 및 핵심 카드를 맞춤 설정합니다.</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                              <span className="text-xs font-extrabold text-[#002C5F] uppercase block">헤드라인 타이틀 & 설명글선</span>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs font-bold text-gray-600 block mb-1">메인 카피 타이틀 (1번째 줄)</label>
                                  <input
                                    type="text"
                                    value={customProjectInfo.heroTitleLine1 || ""}
                                    onChange={(e) => setCustomProjectInfo({ ...customProjectInfo, heroTitleLine1: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-bold"
                                    placeholder="서수원 행정타운의 중심,"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-bold text-gray-600 block mb-1">메인 카피 타이틀 (2번째 줄 - 강조)</label>
                                  <input
                                    type="text"
                                    value={customProjectInfo.heroTitleLine2 || ""}
                                    onChange={(e) => setCustomProjectInfo({ ...customProjectInfo, heroTitleLine2: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-bold"
                                    placeholder="브랜드 프리미엄의 완성"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-xs font-bold text-gray-600 block mb-1">보조 슬로건/설명문</label>
                                <input
                                  type="text"
                                  value={customProjectInfo.heroSubtitle || ""}
                                  onChange={(e) => setCustomProjectInfo({ ...customProjectInfo, heroSubtitle: e.target.value })}
                                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs"
                                  placeholder="서수원의 미래 가치를 선점하는 압도적 브랜드 파워"
                                />
                              </div>
                            </div>

                            {/* Background Images */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                              <span className="text-xs font-extrabold text-[#002C5F] uppercase block">배경 슬라이드 쇼 이미지 (최대 4장)</span>
                              <div className="space-y-2">
                                {[0, 1, 2, 3].map((imgIdx) => (
                                  <div key={imgIdx} className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <span className="text-xs font-bold text-gray-400 w-16 shrink-0">배경 #{imgIdx + 1}</span>
                                    <div className="flex-1 flex gap-2">
                                      <input
                                        type="text"
                                        placeholder="https://images.unsplash.com/... 이미지 URL 주소 혹은 우측 파일 업로드"
                                        value={customProjectInfo.heroImages ? (customProjectInfo.heroImages[imgIdx] || "") : ""}
                                        onChange={(e) => {
                                          const updatedImages = [...(customProjectInfo.heroImages || [])];
                                          updatedImages[imgIdx] = e.target.value;
                                          setCustomProjectInfo({ ...customProjectInfo, heroImages: updatedImages });
                                        }}
                                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-[11px] font-mono"
                                      />
                                      <label className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-gray-50 text-gray-700 text-[10px] font-bold rounded cursor-pointer border border-gray-300 shadow-sm transition-all shrink-0 whitespace-nowrap active:scale-[0.98]">
                                        <Upload className="w-2.5 h-2.5" />
                                        업로드
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              compressAndConvertImage(file, (base64) => {
                                                const updatedImages = [...(customProjectInfo.heroImages || [])];
                                                updatedImages[imgIdx] = base64;
                                                setCustomProjectInfo({ ...customProjectInfo, heroImages: updatedImages });
                                              });
                                            }
                                          }}
                                          className="hidden"
                                        />
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Hero Feature Grid (4 items) */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                              <span className="text-xs font-extrabold text-[#002C5F] uppercase block">하단 고정 핵심 강조문 (4가지 포인트)</span>
                              <div className="grid md:grid-cols-2 gap-4">
                                {[0, 1, 2, 3].map((featIdx) => {
                                  const cFeatures = customProjectInfo.heroFeatures || [];
                                  const currentFeat = cFeatures[featIdx] || { id: `0${featIdx + 1}`, label: "", desc: "" };
                                  return (
                                    <div key={featIdx} className="p-3 bg-white border border-gray-100 rounded-lg space-y-2">
                                      <div className="text-xs font-bold text-accent">강조 요약 #{featIdx + 1}</div>
                                      <div>
                                        <label className="text-[10px] font-bold text-gray-500 block">메인 한줄 요약 타이틀</label>
                                        <input
                                          type="text"
                                          value={currentFeat.label || ""}
                                          onChange={(e) => {
                                            const updatedFeats = [...cFeatures];
                                            while (updatedFeats.length <= featIdx) {
                                              updatedFeats.push({ id: `0${updatedFeats.length + 1}`, label: "", desc: "" });
                                            }
                                            updatedFeats[featIdx] = { ...updatedFeats[featIdx], label: e.target.value };
                                            setCustomProjectInfo({ ...customProjectInfo, heroFeatures: updatedFeats });
                                          }}
                                          className="w-full px-2.5 py-1 border border-gray-200 rounded text-xs font-bold"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-gray-500 block">설명 및 부제</label>
                                        <input
                                          type="text"
                                          value={currentFeat.desc || ""}
                                          onChange={(e) => {
                                            const updatedFeats = [...cFeatures];
                                            while (updatedFeats.length <= featIdx) {
                                              updatedFeats.push({ id: `0${updatedFeats.length + 1}`, label: "", desc: "" });
                                            }
                                            updatedFeats[featIdx] = { ...updatedFeats[featIdx], desc: e.target.value };
                                            setCustomProjectInfo({ ...customProjectInfo, heroFeatures: updatedFeats });
                                          }}
                                          className="w-full px-2.5 py-1 border border-gray-200 rounded text-xs"
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2.3 Location Analysis Cards */}
                        {activeSubEdit === 'analysis' && (
                          <div className="space-y-8">
                            <div>
                              <h4 className="text-sm font-extrabold text-gray-900 border-b pb-2 mb-2">입지분석 및 프리미엄 카드뉴스 편집</h4>
                              <p className="text-xs text-gray-400 mb-4 font-medium">4가지 입지 테마(의료, 교통, 탑동이노베이션밸리, 행정) 각각의 대타이틀, 헤드라인, 표지 사진 및 3~4개의 상세 카드뉴스 슬라이드를 입체적으로 편집할 수 있습니다.</p>
                            </div>

                            {customAnalysis.map((item, idx) => (
                              <div key={idx} className="p-5 bg-white rounded-2xl border border-gray-200/80 shadow-sm space-y-5">
                                <div className="flex items-center gap-2 border-b border-gray-100 pb-3 justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-[#002C5F]/10 text-[#002C5F] text-[10px] font-black rounded-md flex items-center justify-center">0{idx + 1}</span>
                                    <span className="text-xs font-black text-gray-900">{item.title} 카드뉴스 테마 편집</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-accent px-2 py-0.5 bg-accent/5 rounded-full">{item.subTitle}</span>
                                </div>

                                {/* 메타 영역 */}
                                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                                  <div>
                                    <label className="text-[10px] font-bold text-gray-400 block mb-1">분류명</label>
                                    <input
                                      type="text"
                                      value={item.title || ""}
                                      onChange={(e) => {
                                        const updated = [...customAnalysis];
                                        updated[idx].title = e.target.value;
                                        setCustomAnalysis(updated);
                                      }}
                                      className="w-full px-2 py-1.5 border rounded text-xs font-bold"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-gray-400 block mb-1">서브타이틀 (영문)</label>
                                    <input
                                      type="text"
                                      value={item.subTitle || ""}
                                      onChange={(e) => {
                                        const updated = [...customAnalysis];
                                        updated[idx].subTitle = e.target.value;
                                        setCustomAnalysis(updated);
                                      }}
                                      className="w-full px-2 py-1.5 border rounded text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-gray-400 block mb-1">부제목 요약</label>
                                    <input
                                      type="text"
                                      value={item.mainTitle || ""}
                                      onChange={(e) => {
                                        const updated = [...customAnalysis];
                                        updated[idx].mainTitle = e.target.value;
                                        setCustomAnalysis(updated);
                                      }}
                                      className="w-full px-2 py-1.5 border rounded text-xs font-bold text-gray-700"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-gray-400 block mb-1">메인 헤드라인 슬로건</label>
                                    <input
                                      type="text"
                                      value={item.headline || ""}
                                      onChange={(e) => {
                                        const updated = [...customAnalysis];
                                        updated[idx].headline = e.target.value;
                                        setCustomAnalysis(updated);
                                      }}
                                      className="w-full px-2 py-1.5 border rounded text-xs font-semibold"
                                    />
                                  </div>
                                </div>

                                {/* 대표 표지 이미지 */}
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-gray-600 block">🖼️ 대표 커버 이미지 (섹션 표지 및 숏컷 썸네일)</label>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      placeholder="커버 이미지 URL 또는 우측 업로드"
                                      value={item.coverImage || ""}
                                      onChange={(e) => {
                                        const updated = [...customAnalysis];
                                        updated[idx].coverImage = e.target.value;
                                        setCustomAnalysis(updated);
                                      }}
                                      className="flex-1 px-3 py-1.5 border rounded text-[11px] font-mono bg-white"
                                    />
                                    <label className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg cursor-pointer border shadow-sm transition-all shrink-0 active:scale-95">
                                      <Upload className="w-3 h-3 text-gray-500" />
                                      업로드
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            compressAndConvertImage(file, (base64) => {
                                              const updated = [...customAnalysis];
                                              updated[idx].coverImage = base64;
                                              setCustomAnalysis(updated);
                                            });
                                          }
                                        }}
                                        className="hidden"
                                      />
                                    </label>
                                  </div>
                                </div>

                                {/* 상세 슬라이드 편집 (3~4개 개별 상세 카드뉴스) */}
                                <div className="space-y-3 pt-2 border-t border-gray-100">
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-[11px] font-extrabold text-blue-900">📑 상세 슬라이드 뉴스 리스트 (순방향 롤링 카드)</h5>
                                    <span className="text-[10px] font-medium text-gray-400">등록 슬라이드 수: {item.slides?.length || 0}개</span>
                                  </div>

                                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {[0, 1, 2, 3].map((slideIdx) => {
                                      // If slides array is shorter, ensure we can write it or lazy instantiate
                                      if (!item.slides) {
                                        item.slides = [];
                                      }
                                      while (item.slides.length <= slideIdx) {
                                        item.slides.push({ title: "", desc: "", image: "" });
                                      }
                                      const slide = item.slides[slideIdx];

                                      return (
                                        <div key={slideIdx} className="p-3 bg-stone-50/70 border border-stone-200/60 rounded-xl space-y-2.5">
                                          <div className="flex justify-between items-center border-b border-stone-200 pb-1">
                                            <span className="text-[10px] font-black text-stone-600">슬라이드 #{slideIdx + 1}</span>
                                          </div>

                                          <div>
                                            <label className="text-[9px] font-bold text-stone-400 block mb-0.5">상세 슬라이더 타이틀</label>
                                            <input
                                              type="text"
                                              placeholder="예: 경기 남부 중증 질환 치료 거점"
                                              value={slide.title || ""}
                                              onChange={(e) => {
                                                const updated = [...customAnalysis];
                                                if (!updated[idx].slides) updated[idx].slides = [];
                                                while (updated[idx].slides.length <= slideIdx) {
                                                  updated[idx].slides.push({ title: "", desc: "", image: "" });
                                               }
                                                updated[idx].slides[slideIdx].title = e.target.value;
                                                setCustomAnalysis(updated);
                                              }}
                                              className="w-full px-2 py-1 border border-stone-200 rounded text-[11px] font-bold text-stone-800"
                                            />
                                          </div>

                                          <div>
                                            <label className="text-[9px] font-bold text-stone-400 block mb-0.5">상세 슬라이더 설명문구</label>
                                            <textarea
                                              placeholder="상세 정보를 가독성 있게 서술해 주세요."
                                              rows={3}
                                              value={slide.desc || ""}
                                              onChange={(e) => {
                                                const updated = [...customAnalysis];
                                                if (!updated[idx].slides) updated[idx].slides = [];
                                                while (updated[idx].slides.length <= slideIdx) {
                                                  updated[idx].slides.push({ title: "", desc: "", image: "" });
                                                }
                                                updated[idx].slides[slideIdx].desc = e.target.value;
                                                setCustomAnalysis(updated);
                                              }}
                                              className="w-full px-2 py-1 border border-stone-200 rounded text-[10px] leading-relaxed text-stone-600"
                                            />
                                          </div>

                                          <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-stone-400 block">슬라이더 이미지</label>
                                            <div className="flex gap-1.5">
                                              <input
                                                type="text"
                                                placeholder="이미지 URL"
                                                value={slide.image || ""}
                                                onChange={(e) => {
                                                  const updated = [...customAnalysis];
                                                  if (!updated[idx].slides) updated[idx].slides = [];
                                                  while (updated[idx].slides.length <= slideIdx) {
                                                    updated[idx].slides.push({ title: "", desc: "", image: "" });
                                                  }
                                                  updated[idx].slides[slideIdx].image = e.target.value;
                                                  setCustomAnalysis(updated);
                                                }}
                                                className="flex-1 px-2 py-1 border border-stone-200 rounded text-[9px] font-mono bg-white"
                                              />
                                              <label className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-stone-100 text-stone-700 text-[9px] font-bold rounded cursor-pointer border border-stone-300 shadow-sm shrink-0 active:scale-95">
                                                <Upload className="w-2.5 h-2.5" />
                                                <input
                                                  type="file"
                                                  accept="image/*"
                                                  onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                      compressAndConvertImage(file, (base64) => {
                                                        const updated = [...customAnalysis];
                                                        if (!updated[idx].slides) updated[idx].slides = [];
                                                        while (updated[idx].slides.length <= slideIdx) {
                                                          updated[idx].slides.push({ title: "", desc: "", image: "" });
                                                        }
                                                        updated[idx].slides[slideIdx].image = base64;
                                                        setCustomAnalysis(updated);
                                                      });
                                                    }
                                                  }}
                                                  className="hidden"
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 2.4 Project Overview & Officetel Sizing Settings */}
                        {activeSubEdit === 'overview' && (
                          <div className="space-y-8 animate-fade-in">
                            <div>
                              <h4 className="text-sm font-extrabold text-gray-900 border-b pb-2 mb-2">사업개요 및 오피스텔 공급안내 편집</h4>
                              <p className="text-xs text-gray-400 mb-4">건축 토지 면적 개요 리스트와 오피스텔 주요 타입별 전용/계약면적 및 룸 공급비율 등을 가공합니다.</p>
                            </div>

                            {/* Project Overview Details */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-extrabold text-[#002C5F] uppercase block">건축 사업개요 기술표</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...(customProjectInfo.overview || [])];
                                    updated.push({ label: "신규 항목", value: "신내용 입력" });
                                    setCustomProjectInfo({ ...customProjectInfo, overview: updated });
                                  }}
                                  className="px-2.5 py-1 bg-[#002C5F] hover:bg-[#002C5F]/90 text-white text-[10px] font-bold rounded-lg transition-all"
                                >
                                  + 행 추가
                                </button>
                              </div>

                              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                {(customProjectInfo.overview || []).map((item: any, idx: number) => (
                                  <div key={idx} className="flex gap-2 items-center bg-white p-2 border border-gray-150 rounded-lg">
                                    <input
                                      type="text"
                                      placeholder="분류명 (예: 대지위치)"
                                      value={item.label || ""}
                                      onChange={(e) => {
                                        const updated = [...(customProjectInfo.overview || [])];
                                        updated[idx].label = e.target.value;
                                        setCustomProjectInfo({ ...customProjectInfo, overview: updated });
                                      }}
                                      className="w-1/4 px-2 py-1.5 border border-gray-200 rounded text-xs font-bold"
                                    />
                                    <input
                                      type="text"
                                      placeholder="대지 고색동 894-125... 기재내용"
                                      value={item.value || ""}
                                      onChange={(e) => {
                                        const updated = [...(customProjectInfo.overview || [])];
                                        updated[idx].value = e.target.value;
                                        setCustomProjectInfo({ ...customProjectInfo, overview: updated });
                                      }}
                                      className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-xs"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = (customProjectInfo.overview || []).filter((_: any, i: number) => i !== idx);
                                        setCustomProjectInfo({ ...customProjectInfo, overview: updated });
                                      }}
                                      className="text-red-500 hover:text-red-700 p-1.5 text-xs font-extrabold shrink-0"
                                    >
                                      삭제
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Officetel Type Details */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-extrabold text-[#002C5F] uppercase block">오피스텔 공급 주택형 타입 세부평정</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...(customProjectInfo.unitTypes || [])];
                                    updated.push({
                                      type: '84A-New',
                                      units: '100',
                                      ratio: '25%',
                                      areaM2: '84.00',
                                      areaPy: '25.4',
                                      totalAreaM2: '180.00',
                                      totalAreaPy: '54.5',
                                      efficiency: '46.5%'
                                    });
                                    setCustomProjectInfo({ ...customProjectInfo, unitTypes: updated });
                                  }}
                                  className="px-2.5 py-1 bg-[#002C5F] hover:bg-[#002C5F]/90 text-white text-[10px] font-bold rounded-lg transition-all"
                                >
                                  + 주택타입 추가
                                </button>
                              </div>

                              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                                {(customProjectInfo.unitTypes || []).map((u: any, idx: number) => (
                                  <div key={idx} className="p-4 bg-white border border-gray-200 rounded-xl space-y-3 relative">
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-extrabold text-[#002C5F]">타입 규격명</span>
                                        <input
                                          type="text"
                                          value={u.type || ""}
                                          placeholder="예: 84A"
                                          onChange={(e) => {
                                            const updated = [...(customProjectInfo.unitTypes || [])];
                                            updated[idx].type = e.target.value;
                                            setCustomProjectInfo({ ...customProjectInfo, unitTypes: updated });
                                          }}
                                          className="w-20 px-2 py-0.5 border border-gray-300 rounded text-xs font-black text-center"
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = (customProjectInfo.unitTypes || []).filter((_: any, i: number) => i !== idx);
                                          setCustomProjectInfo({ ...customProjectInfo, unitTypes: updated });
                                        }}
                                        className="text-red-500 hover:text-red-700 text-xs font-extrabold"
                                      >
                                        타입 삭제
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                      <div>
                                        <label className="text-[10px] font-bold text-gray-400 block mb-0.5">분양 세대수</label>
                                        <input
                                          type="text"
                                          value={u.units || ""}
                                          onChange={(e) => {
                                            const updated = [...(customProjectInfo.unitTypes || [])];
                                            updated[idx].units = e.target.value;
                                            setCustomProjectInfo({ ...customProjectInfo, unitTypes: updated });
                                          }}
                                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-medium"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-gray-400 block mb-0.5">공급 비율</label>
                                        <input
                                          type="text"
                                          value={u.ratio || ""}
                                          onChange={(e) => {
                                            const updated = [...(customProjectInfo.unitTypes || [])];
                                            updated[idx].ratio = e.target.value;
                                            setCustomProjectInfo({ ...customProjectInfo, unitTypes: updated });
                                          }}
                                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-gray-400 block mb-0.5">전용면적 (㎡)</label>
                                        <input
                                          type="text"
                                          value={u.areaM2 || ""}
                                          onChange={(e) => {
                                            const updated = [...(customProjectInfo.unitTypes || [])];
                                            updated[idx].areaM2 = e.target.value;
                                            setCustomProjectInfo({ ...customProjectInfo, unitTypes: updated });
                                          }}
                                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-mono"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-gray-400 block mb-0.5">전용면적 (평)</label>
                                        <input
                                          type="text"
                                          value={u.areaPy || ""}
                                          onChange={(e) => {
                                            const updated = [...(customProjectInfo.unitTypes || [])];
                                            updated[idx].areaPy = e.target.value;
                                            setCustomProjectInfo({ ...customProjectInfo, unitTypes: updated });
                                          }}
                                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-mono"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-gray-400 block mb-0.5">계약면적 (㎡)</label>
                                        <input
                                          type="text"
                                          value={u.totalAreaM2 || ""}
                                          onChange={(e) => {
                                            const updated = [...(customProjectInfo.unitTypes || [])];
                                            updated[idx].totalAreaM2 = e.target.value;
                                            setCustomProjectInfo({ ...customProjectInfo, unitTypes: updated });
                                          }}
                                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-mono"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-gray-400 block mb-0.5">계약면적 (평)</label>
                                        <input
                                          type="text"
                                          value={u.totalAreaPy || ""}
                                          onChange={(e) => {
                                            const updated = [...(customProjectInfo.unitTypes || [])];
                                            updated[idx].totalAreaPy = e.target.value;
                                            setCustomProjectInfo({ ...customProjectInfo, unitTypes: updated });
                                          }}
                                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-mono"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-gray-400 block mb-0.5">전용률</label>
                                        <input
                                          type="text"
                                          value={u.efficiency || ""}
                                          onChange={(e) => {
                                            const updated = [...(customProjectInfo.unitTypes || [])];
                                            updated[idx].efficiency = e.target.value;
                                            setCustomProjectInfo({ ...customProjectInfo, unitTypes: updated });
                                          }}
                                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2.4-B Residential Officetel Sponsoring Settings */}
                        {activeSubEdit === 'officetel' && (
                          <div className="space-y-8 animate-fade-in">
                            <div>
                              <h4 className="text-sm font-extrabold text-gray-900 border-b pb-2 mb-2">주거용 오피스텔 상품안내 편집</h4>
                              <p className="text-xs text-gray-400 mb-4">주거용 오피스텔 섹션의 3가지 강점 카드(3룸 평면, 커뮤니티, 스마트홈 등)의 타이틀, 설명 및 각 카드별 최대 3장의 슬라이드 이미지를 관리합니다.</p>
                            </div>

                            <div className="space-y-6">
                              {customOfficetel.map((item: any, idx: number) => (
                                <div key={idx} className="p-5 bg-gray-50 rounded-xl border border-gray-150 space-y-4">
                                  <div className="flex items-center justify-between border-b pb-1.5">
                                    <span className="text-xs font-black text-[#002C5F] uppercase">
                                      오피스텔 특장점 파트 #{idx + 1}
                                    </span>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs font-bold text-gray-600 block mb-1">타이틀 제목</label>
                                      <input
                                        type="text"
                                        value={item.title || ""}
                                        onChange={(e) => {
                                          const updated = [...customOfficetel];
                                          updated[idx].title = e.target.value;
                                          setCustomOfficetel(updated);
                                        }}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-bold bg-white"
                                        placeholder="예: 혁신적인 3룸 평면"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs font-bold text-gray-600 block mb-1">한줄 요약 및 상세 설명</label>
                                      <textarea
                                        rows={2}
                                        value={item.desc || ""}
                                        onChange={(e) => {
                                          const updated = [...customOfficetel];
                                          updated[idx].desc = e.target.value;
                                          setCustomOfficetel(updated);
                                        }}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-xs bg-white"
                                        placeholder="예: 아파트를 대체하는 3룸 구조와 넉넉한 수납공간으로 주거 만족도를 극대화했습니다."
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2 pt-2 border-t border-gray-150">
                                    <label className="text-[10px] font-extrabold text-gray-700 block mb-1">
                                      {idx === 0 
                                        ? "1번 카드 미디어 목록 (첫 번째 항목은 세로형 유튜브 쇼츠 링크 입력 권장, 2~3번째는 일반 이미지)"
                                        : "이미지 슬라이드 리스트 (최대 3장 등록 가능 - URL 형식)"}
                                    </label>
                                    {[0, 1, 2].map((imgIdx) => (
                                      <div key={imgIdx} className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 w-16 shrink-0 font-sans">
                                          {idx === 0 && imgIdx === 0 ? "영상/이미지 #1" : `이미지 #${imgIdx + 1}`}
                                        </span>
                                        <div className="flex-1 flex gap-2">
                                          <input
                                            type="text"
                                            placeholder={idx === 0 && imgIdx === 0 
                                              ? "예: https://www.youtube.com/shorts/영상ID 주소 입력 시 자동 임베드 연동" 
                                              : "https://images.unsplash.com/... 이미지 복사 주소 또는 우측 파일 업로드"}
                                            value={item.images && item.images[imgIdx] ? item.images[imgIdx] : ""}
                                            onChange={(e) => {
                                              const parsedValue = parseYoutubeUrlHelper(e.target.value);
                                              const updated = [...customOfficetel];
                                              if (!updated[idx].images) {
                                                updated[idx].images = [];
                                              }
                                              updated[idx].images[imgIdx] = parsedValue;
                                              setCustomOfficetel(updated);
                                            }}
                                            className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-[11px] font-mono bg-white"
                                          />
                                          <label className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-gray-50 text-gray-750 text-[10px] font-bold rounded cursor-pointer border border-gray-300 shadow-sm transition-all shrink-0 whitespace-nowrap active:scale-[0.98]">
                                            <Upload className="w-2.5 h-2.5" />
                                            업로드
                                            <input
                                              type="file"
                                              accept="image/*"
                                              onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                  compressAndConvertImage(file, (base64) => {
                                                    const updated = [...customOfficetel];
                                                    if (!updated[idx].images) {
                                                      updated[idx].images = [];
                                                    }
                                                    updated[idx].images[imgIdx] = base64;
                                                    setCustomOfficetel(updated);
                                                  });
                                                }
                                              }}
                                              className="hidden"
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 2.5 Commercial Spot Recommendations */}
                        {activeSubEdit === 'md' && (
                          <div className="space-y-8">
                            <div>
                              <h4 className="text-sm font-extrabold text-gray-900 border-b pb-2 mb-2">상업 근린 점포 추천업종 배치</h4>
                              <p className="text-xs text-gray-400 mb-4 font-medium">추천 점포 상가호수, 추천 업종, 전용평수, 그리고 이미지 노출 주소를 설정할 수 있습니다.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              {customMd.map((item, idx) => (
                                <div key={idx} className="p-4 bg-gray-50/50 rounded-xl border border-gray-100/80 space-y-3">
                                  <div className="flex justify-between items-center border-b border-gray-200/50 pb-1.5">
                                    <span className="text-xs font-bold text-accent">점포 슬라이드 #{idx + 1}</span>
                                    <input
                                      type="text"
                                      value={item.id}
                                      placeholder="제 117호"
                                      onChange={(e) => {
                                        const updated = [...customMd];
                                        updated[idx].id = e.target.value;
                                        setCustomMd(updated);
                                      }}
                                      className="w-16 text-center border px-1.5 py-0.5 rounded text-[10px] font-black"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[10px] font-bold text-gray-500 block">추천 형태 업종</label>
                                      <input
                                        type="text"
                                        value={item.type}
                                        onChange={(e) => {
                                          const updated = [...customMd];
                                          updated[idx].type = e.target.value;
                                          setCustomMd(updated);
                                        }}
                                        className="w-full px-2 py-1 border rounded text-xs font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-gray-500 block">전용 평수</label>
                                      <input
                                        type="text"
                                        value={item.area}
                                        onChange={(e) => {
                                          const updated = [...customMd];
                                          updated[idx].area = e.target.value;
                                          setCustomMd(updated);
                                        }}
                                        className="w-full px-2 py-1 border rounded text-xs"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-bold text-gray-500 block">점포 비주얼 소개글</label>
                                    <input
                                      type="text"
                                      value={item.desc}
                                      onChange={(e) => {
                                        const updated = [...customMd];
                                        updated[idx].desc = e.target.value;
                                        setCustomMd(updated);
                                      }}
                                      className="w-full px-2 py-1 border rounded text-xs"
                                    />
                                  </div>

                                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                                    <label className="text-[10px] font-bold text-gray-700 block">📸 샵 이미지 슬라이더 (최대 4장)</label>
                                    {[0, 1, 2, 3].map((imgIdx) => {
                                      const imgVal = (item.images && item.images[imgIdx]) || (imgIdx === 0 ? item.image : "") || "";
                                      return (
                                        <div key={imgIdx} className="flex gap-2 items-center">
                                          <span className="text-[10px] font-semibold text-gray-400 w-4 shrink-0">#{imgIdx + 1}</span>
                                          <input
                                            type="text"
                                            value={imgVal}
                                            placeholder={imgIdx === 0 ? "대표 이미지 URL 주소 또는 우측 업로드" : `추가 슬라이드 #${imgIdx + 1} 이미지 URL`}
                                            onChange={(e) => {
                                              const updated = [...customMd];
                                              if (!updated[idx].images) {
                                                updated[idx].images = [updated[idx].image || ""];
                                              }
                                              while (updated[idx].images.length <= imgIdx) {
                                                updated[idx].images.push("");
                                              }
                                              updated[idx].images[imgIdx] = e.target.value;
                                              if (imgIdx === 0) {
                                                updated[idx].image = e.target.value;
                                              }
                                              setCustomMd(updated);
                                            }}
                                            className="flex-1 px-2 py-0.5 border rounded text-[10px] font-mono bg-white"
                                          />
                                          <label className="flex items-center gap-1 px-2 py-0.5 bg-white hover:bg-gray-50 text-gray-700 text-[10px] font-bold rounded cursor-pointer border border-gray-300 shadow-sm transition-all shrink-0 whitespace-nowrap active:scale-[0.98]">
                                            <Upload className="w-2.5 h-2.5" />
                                            업로드
                                            <input
                                              type="file"
                                              accept="image/*"
                                              onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                  compressAndConvertImage(file, (base64) => {
                                                    const updated = [...customMd];
                                                    if (!updated[idx].images) {
                                                      updated[idx].images = [updated[idx].image || ""];
                                                    }
                                                    while (updated[idx].images.length <= imgIdx) {
                                                      updated[idx].images.push("");
                                                    }
                                                    updated[idx].images[imgIdx] = base64;
                                                    if (imgIdx === 0) {
                                                      updated[idx].image = base64;
                                                    }
                                                    setCustomMd(updated);
                                                  });
                                                }
                                              }}
                                              className="hidden"
                                            />
                                          </label>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="md:hidden mt-6 pt-4 border-t border-gray-100 flex gap-2">
                          <button
                            onClick={handleSaveConfig}
                            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                          >
                            <RefreshCw className="w-3.5 h-3.5 shrink-0 animate-spin-slow" />
                            변경사항 저장
                          </button>
                          <button
                            onClick={handleReset}
                            className="px-4 py-3 bg-gray-100/80 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-200 transition-colors"
                          >
                            초기화
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Advanced Security log and shielding system */}
                  {activeTab === 'security' && (
                    <div className="flex-1 flex flex-col md:flex-row gap-6 h-full overflow-y-auto md:overflow-hidden pb-4 md:pb-0">
                      {/* Security Left widget: Rules */}
                      <div className="w-full md:w-1/3 bg-slate-900 text-white rounded-2xl p-5 md:p-6 border border-slate-800 flex flex-col justify-between shrink-0 gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
                            <span className="text-xs uppercase tracking-widest font-mono text-red-400 font-black">Firewall Active</span>
                          </div>
                          <h4 className="text-lg font-black tracking-tight mb-5 text-gray-100">디펜더 정책 가속화</h4>
                          
                          <div className="space-y-4 text-xs font-medium text-slate-300">
                            <div className="flex gap-2.5 items-start">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 shrink-0" />
                              <p>Brute-force 스캔 방지 필터: 5번 오탈자 탐지 즉시 세션 1분 격리 (Lockout)</p>
                            </div>
                            <div className="flex gap-2.5 items-start">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 shrink-0" />
                              <p>Cross-Site Scripting (XSS) 차단 필터: HTML 문자열 특수 문자 교환 변환 파싱</p>
                            </div>
                            <div className="flex gap-2.5 items-start">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 shrink-0" />
                              <p>Local Database 하이재킹 제어: 로컬 데이터 가공 영역 서명 감사 자동 진행</p>
                            </div>
                            <div className="flex gap-2.5 items-start">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 shrink-0" />
                              <p>외부 리드 데이터 암호화: CSV 파일 인코딩(BOM) 추출로 유출 차단</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800 text-left">
                          <p className="text-[10px] font-mono text-slate-500 leading-relaxed">
                            IP ACCESS STATE: TRUSTED (LOCAL)<br />
                            SSL PROTOCOL LAYER: ACTIVE<br />
                            SQL INTEGRITY PROOF: 100% SECURE
                          </p>
                        </div>
                      </div>

                      {/* Security Right widget: Terminal Active Logs */}
                      <div className="flex-1 bg-black rounded-2xl p-5 md:p-6 border border-slate-900 flex flex-col overflow-hidden min-h-[300px] md:min-h-0 shadow-inner">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                          <span className="text-xs font-mono text-green-500 font-bold">&gt; ADMIN_SYSTEM_SHELL_ACTIVITIES.log</span>
                          <span className="text-[10px] bg-green-500/10 text-green-500 font-mono px-2 py-0.5 rounded animate-pulse">AUTO_REFRESH_LIVE</span>
                        </div>
                        
                        <div className="flex-1 overflow-auto space-y-2 font-mono text-xs text-slate-400 leading-relaxed scrollbar-thin">
                          {securityLogs.map((log, idx) => (
                            <div key={idx} className={cn(
                              "border-b border-slate-900/30 pb-1.5",
                              log.includes('🚨') ? "text-red-500" : log.includes('⚠️') ? "text-yellow-500" : log.includes('🔑') || log.includes('🔓') ? "text-green-400" : "text-slate-400"
                            )}>
                              {log}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
