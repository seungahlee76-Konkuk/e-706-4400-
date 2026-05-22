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
import { db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync customizations from Firestore to LocalStorage
  useEffect(() => {
    const syncDbConfig = async () => {
      try {
        const docRef = doc(db, 'site_config', 'current');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          const currentProject = localStorage.getItem('site_custom_project_info');
          const currentAnalysis = localStorage.getItem('site_custom_analysis_data');
          const currentMd = localStorage.getItem('site_custom_md_data');
          const currentOfficetel = localStorage.getItem('site_custom_officetel_data');

          const serverProjectStr = data.projectInfo ? JSON.stringify(data.projectInfo) : null;
          const serverAnalysisStr = data.analysisData ? JSON.stringify(data.analysisData) : null;
          const serverMdStr = data.mdData ? JSON.stringify(data.mdData) : null;
          const serverOfficetelStr = data.officetelData ? JSON.stringify(data.officetelData) : null;

          const isProjectDifferent = serverProjectStr && currentProject !== serverProjectStr;
          const isAnalysisDifferent = serverAnalysisStr && currentAnalysis !== serverAnalysisStr;
          const isMdDifferent = serverMdStr && currentMd !== serverMdStr;
          const isOfficetelDifferent = serverOfficetelStr && currentOfficetel !== serverOfficetelStr;

          if (isProjectDifferent || isAnalysisDifferent || isMdDifferent || isOfficetelDifferent) {
            if (serverProjectStr) localStorage.setItem('site_custom_project_info', serverProjectStr);
            if (serverAnalysisStr) localStorage.setItem('site_custom_analysis_data', serverAnalysisStr);
            if (serverMdStr) localStorage.setItem('site_custom_md_data', serverMdStr);
            if (serverOfficetelStr) localStorage.setItem('site_custom_officetel_data', serverOfficetelStr);
            
            // Clean soft reload to update components without visual flicker loops
            window.location.reload();
          }
        }
      } catch (err) {
        console.error('Failed to sync remote site config: ', err);
      }
    };

    syncDbConfig();
  }, []);

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
    <div className="min-h-screen bg-[#F5F5F0] font-sans text-gray-900 overflow-x-hidden">
      <Navbar />
      
      <main className="bg-[#F5F5F0]">
        <Hero />
        <hr className="border-t border-gray-200" />
        <Overview />
        <hr className="border-t border-gray-200" />
        <LocationAnalysis />
        <hr className="border-t border-gray-200" />
        <MDConfig />
        <hr className="border-t border-gray-200" />
        <ContactForm />
      </main>

      <Footer onAdminOpen={() => setIsAdminOpen(true)} />
      <QuickMenu />
      <StickyBottomForm />

      <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}
