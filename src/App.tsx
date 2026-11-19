/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Chooser from './sections/Chooser';
import StoreHero from './sections/StoreHero';
import StoreCalendar from './sections/StoreCalendar';
import StoreUnits from './sections/StoreUnits';
import StoreOverview from './sections/StoreOverview';
import StoreLocation from './sections/StoreLocation';
import Officetel from './sections/Officetel';
import PrivacyPolicy from './sections/PrivacyPolicy';
import ContactForm from './sections/ContactForm';
import QuickMenu from './components/ui/QuickMenu';
import SideSwitch from './components/ui/SideSwitch';
import AdminDashboard from './components/ui/AdminDashboard';
import StickyBottomForm from './components/ui/StickyBottomForm';
import { navigate, normalizePath, useIsChooserView, usePath } from './lib/router';

const ROUTE_META: Record<string, { title: string; canonical: string }> = {
  '/': {
    title: 'e편한세상시티고색 | 덕산병원 앞 1층 상가 분양·임대',
    canonical: 'https://elife-gosaek.com/',
  },
  '/store': {
    title: 'e편한세상 시티 고색 근린생활시설 | 덕산병원 앞 1층 상가 분양·임대',
    canonical: 'https://elife-gosaek.com/store',
  },
  '/store/location': {
    title: '입지분석 | e편한세상 시티 고색 1층 상가',
    canonical: 'https://elife-gosaek.com/store/location',
  },
  '/store/overview': {
    title: '사업개요 | e편한세상 시티 고색',
    canonical: 'https://elife-gosaek.com/store/overview',
  },
  '/officetel': {
    title: '84타입 3룸 오피스텔 | e편한세상 시티 고색',
    canonical: 'https://elife-gosaek.com/officetel',
  },
  '/privacy': {
    title: '개인정보처리방침 | e편한세상 시티 고색',
    canonical: 'https://elife-gosaek.com/privacy',
  },
};

const LEGACY_HASH_ROUTES: Record<string, string> = {
  '#md': '/store#units',
  '#location': '/store/location',
  '#overview': '/store/overview',
  '#officetel': '/officetel',
  '#contact': '/store#contact',
};

export default function App() {
  const path = usePath();
  const isChooserView = useIsChooserView();
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Redirect legacy hash URLs on "/" and fallback unknown non-root paths to "/store"
  useEffect(() => {
    const checkLegacyHash = () => {
      if (isChooserView) return false;
      const normalized = normalizePath(window.location.pathname || '/');
      const currentHash = window.location.hash;
      if (normalized === '/' && currentHash && LEGACY_HASH_ROUTES[currentHash]) {
        navigate(LEGACY_HASH_ROUTES[currentHash], { replace: true });
        return true;
      }
      return false;
    };

    if (!checkLegacyHash() && !isChooserView && path !== '/' && !ROUTE_META[path]) {
      navigate('/store', { replace: true });
    }

    window.addEventListener('hashchange', checkLegacyHash);
    return () => {
      window.removeEventListener('hashchange', checkLegacyHash);
    };
  }, [path, isChooserView]);

  // Update document.title and canonical link per route
  useEffect(() => {
    const meta = isChooserView ? ROUTE_META['/'] : (ROUTE_META[path] || ROUTE_META['/store']);
    document.title = meta.title;
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', meta.canonical);
    }
  }, [path, isChooserView]);

  // Scroll to initial hash on direct page load (e.g., /store#md or /officetel#contact)
  useEffect(() => {
    if (isChooserView) return;
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash || LEGACY_HASH_ROUTES[`#${hash}`]) return;
    const timer = window.setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        const navEl = document.querySelector('nav');
        const headerHeight = navEl ? navEl.getBoundingClientRect().height : 76;
        const y = el.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }, 80);
    return () => window.clearTimeout(timer);
  }, [path, isChooserView]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Robust detection for modifier + Shift + (A, K, Q, or Z)
      const keyUpper = e.key.toUpperCase();
      const isTargetKey = 
        keyUpper === 'A' || 
        keyUpper === 'K' || 
        keyUpper === 'Q' || 
        keyUpper === 'Z' || 
        e.key === 'ㅁ' || // Korean IME 'A' mapping
        e.key === 'ㅏ' || // Korean IME 'K' mapping
        e.key === 'ㅂ' || // Korean IME 'Q' mapping
        e.key === 'ㅋ' || // Korean IME 'Z' mapping
        e.keyCode === 65 || // A
        e.keyCode === 75 || // K
        e.keyCode === 81 || // Q
        e.keyCode === 90;   // Z
        
      const hasModifiers = e.ctrlKey || e.altKey || e.metaKey;
      
      if (hasModifiers && e.shiftKey && isTargetKey) {
        // Prevent action on mobile screens
        if (window.innerWidth < 1024) {
          return;
        }
        // Prevent action when user is typing inside an input/textarea
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
          return;
        }
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const renderPage = () => {
    if (isChooserView || path === '/') {
      return (
        <div className="pt-[65px] md:pt-[72px]">
          <Chooser />
        </div>
      );
    }

    if (path === '/store/location') {
      return (
        <div className="pt-[72px] md:pt-[76px]">
          <StoreLocation />
        </div>
      );
    }

    if (path === '/store/overview') {
      return (
        <div className="pt-[72px] md:pt-[76px]">
          <StoreOverview />
        </div>
      );
    }

    if (path === '/officetel') {
      return (
        <div className="pt-[72px] md:pt-[76px]">
          <Officetel />
          <div className="h-2.5 md:h-px bg-[#ECEFF1] md:bg-gray-200 border-t border-b border-gray-200/50 md:border-b-0 w-full" />
          <ContactForm />
        </div>
      );
    }

    if (path === '/privacy') {
      return (
        <div className="pt-[65px] md:pt-[72px]">
          <PrivacyPolicy />
        </div>
      );
    }

    // Default "/store" (and fallback for unknown routes)
    return (
      <div className="pt-[65px] md:pt-[72px]">
        <StoreHero />
        <StoreCalendar />
        <div className="bg-white">
          <StoreUnits />
        </div>
        <div className="h-2.5 md:h-px bg-[#ECEFF1] md:bg-gray-200 border-t border-b border-gray-200/50 md:border-b-0 w-full" />
        <ContactForm />
      </div>
    );
  };

  const isHome = isChooserView || path === '/';
  const isPrivacy = !isHome && path === '/privacy';

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans text-gray-900 overflow-x-clip pb-0">
      <Navbar />
      
      <main className="bg-[#F5F5F0]">
        {renderPage()}
      </main>

      <Footer onAdminOpen={() => {
        if (window.innerWidth >= 1024) {
          setIsAdminOpen(true);
        }
      }} />
      {!isHome && !isPrivacy && (
        path === '/officetel' ? (
          <SideSwitch to="/store" label="상가" side="left" onNavigate={navigate} />
        ) : (
          <SideSwitch to="/officetel" label="오피스텔" side="right" onNavigate={navigate} />
        )
      )}
      {isHome && <QuickMenu />}
      {!isPrivacy && <StickyBottomForm />}

      <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}
