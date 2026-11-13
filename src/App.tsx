/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './sections/Hero';
import Overview from './sections/Overview';
import LocationAnalysis from './sections/LocationAnalysis';
import MDConfig from './sections/MDConfig';
import ContactForm from './sections/ContactForm';
import QuickMenu from './components/ui/QuickMenu';
import AdminDashboard from './components/ui/AdminDashboard';
import StickyBottomForm from './components/ui/StickyBottomForm';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans text-gray-900 overflow-x-clip pb-36 lg:pb-0">
      <Navbar />
      
      <main className="bg-[#F5F5F0]">
        <Hero />
        <div className="h-2.5 md:h-px bg-[#ECEFF1] md:bg-gray-200 border-t border-b border-gray-200/50 md:border-b-0 w-full" />
        <Overview />
        <div className="h-2.5 md:h-px bg-[#ECEFF1] md:bg-gray-200 border-t border-b border-gray-200/50 md:border-b-0 w-full" />
        <LocationAnalysis />
        <div className="h-2.5 md:h-px bg-[#ECEFF1] md:bg-gray-200 border-t border-b border-gray-200/50 md:border-b-0 w-full" />
        <MDConfig />
        <div className="h-2.5 md:h-px bg-[#ECEFF1] md:bg-gray-200 border-t border-b border-gray-200/50 md:border-b-0 w-full" />
        <ContactForm />
      </main>

      <Footer onAdminOpen={() => {
        if (window.innerWidth >= 1024) {
          setIsAdminOpen(true);
        }
      }} />
      <QuickMenu />
      <StickyBottomForm />

      <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}
