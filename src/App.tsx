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
    const isSameObject = (a: any, b: any): boolean => {
      if (a === b) return true;
      if (!a || !b) return false;
      if (typeof a !== 'object' || typeof b !== 'object') return false;
      
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      
      for (const key of keysA) {
        if (!keysB.includes(key)) return false;
        const valA = a[key];
        const valB = b[key];
        if (typeof valA === 'object' && typeof valB === 'object') {
          if (!isSameObject(valA, valB)) return false;
        } else if (valA !== valB) {
          return false;
        }
      }
      return true;
    };

    const syncDbConfig = async () => {
      try {
        const projectRef = doc(db, 'site_config', 'project_info');
        const analysisRef = doc(db, 'site_config', 'analysis_data');
        const mdRef = doc(db, 'site_config', 'md_data');
        const officetelRef = doc(db, 'site_config', 'officetel_data');

        const [projSnap, analSnap, mdSnap, offSnap] = await Promise.all([
          getDoc(projectRef),
          getDoc(analysisRef),
          getDoc(mdRef),
          getDoc(officetelRef)
        ]);

        let serverProjectRaw = projSnap.exists() ? projSnap.data().data : null;
        let serverProjectTime = projSnap.exists() ? projSnap.data().updatedAt : null;

        let serverAnalysisRaw = analSnap.exists() ? analSnap.data().data : null;
        let serverAnalysisTime = analSnap.exists() ? analSnap.data().updatedAt : null;

        let serverMd = mdSnap.exists() ? mdSnap.data().data : null;
        let serverMdTime = mdSnap.exists() ? mdSnap.data().updatedAt : null;

        let serverOfficetel = offSnap.exists() ? offSnap.data().data : null;
        let serverOfficetelTime = offSnap.exists() ? offSnap.data().updatedAt : null;

        // Fallback to legacy single document
        if (!serverProjectRaw && !serverAnalysisRaw && !serverMd && !serverOfficetel) {
          const legacyRef = doc(db, 'site_config', 'current');
          const legacySnap = await getDoc(legacyRef);
          if (legacySnap.exists()) {
            const legacyData = legacySnap.data();
            serverProjectRaw = legacyData.projectInfo || null;
            serverAnalysisRaw = legacyData.analysisData || null;
            serverMd = legacyData.mdData || null;
            serverOfficetel = legacyData.officetelData || null;
            
            const legacyTime = legacyData.updatedAt || null;
            serverProjectTime = serverProjectTime || legacyTime;
            serverAnalysisTime = serverAnalysisTime || legacyTime;
            serverMdTime = serverMdTime || legacyTime;
            serverOfficetelTime = serverOfficetelTime || legacyTime;
          }
        }

        const serverProject = serverProjectRaw;
        const serverAnalysis = serverAnalysisRaw;
          
        const currentProject = localStorage.getItem('site_custom_project_info');
        const currentAnalysis = localStorage.getItem('site_custom_analysis_data');
        const currentMd = localStorage.getItem('site_custom_md_data');
        const currentOfficetel = localStorage.getItem('site_custom_officetel_data');
        const localLastSaved = localStorage.getItem('site_custom_last_saved');

        let localProject = null;
        let localAnalysis = null;
        let localMd = null;
        let localOfficetel = null;

        try { if (currentProject) localProject = JSON.parse(currentProject); } catch (e) {}
        try { if (currentAnalysis) localAnalysis = JSON.parse(currentAnalysis); } catch (e) {}
        try { if (currentMd) localMd = JSON.parse(currentMd); } catch (e) {}
        try { if (currentOfficetel) localOfficetel = JSON.parse(currentOfficetel); } catch (e) {}

        const isServerNewer = (serverTimeStr: any, localTimeStr: any): boolean => {
          if (!serverTimeStr) return false;
          if (!localTimeStr) return true; // If local timer doesn't exist, we must pull the database config
          try {
            const serverTime = new Date(serverTimeStr).getTime();
            const localTime = new Date(localTimeStr).getTime();
            return serverTime > localTime + 1000; // 1s threshold buffer
          } catch (e) {
            return false;
          }
        };

        const isProjectDifferent = serverProject && isServerNewer(serverProjectTime, localLastSaved) && !isSameObject(localProject, serverProject);
        const isAnalysisDifferent = serverAnalysis && isServerNewer(serverAnalysisTime, localLastSaved) && !isSameObject(localAnalysis, serverAnalysis);
        const isMdDifferent = serverMd && isServerNewer(serverMdTime, localLastSaved) && !isSameObject(localMd, serverMd);
        const isOfficetelDifferent = serverOfficetel && isServerNewer(serverOfficetelTime, localLastSaved) && !isSameObject(localOfficetel, serverOfficetel);

        if (isProjectDifferent || isAnalysisDifferent || isMdDifferent || isOfficetelDifferent) {
          // Check session reload rate-limiting (circuit-breaker) to fully block visual flickering pools
          const now = Date.now();
          const lastReloadStr = sessionStorage.getItem('site_last_automatic_reload');
          const lastReload = lastReloadStr ? parseInt(lastReloadStr, 10) : 0;
          
          if (now - lastReload > 6000) { // minimum 6 seconds cool-down between automatic reloads
            if (serverProject) localStorage.setItem('site_custom_project_info', JSON.stringify(serverProject));
            if (serverAnalysis) localStorage.setItem('site_custom_analysis_data', JSON.stringify(serverAnalysis));
            if (serverMd) localStorage.setItem('site_custom_md_data', JSON.stringify(serverMd));
            if (serverOfficetel) localStorage.setItem('site_custom_officetel_data', JSON.stringify(serverOfficetel));
            
            // Also store the updated newest server timestamp locally to keep them in sync
            const newestServerTime = [serverProjectTime, serverAnalysisTime, serverMdTime, serverOfficetelTime]
              .filter(Boolean)
              .sort()
              .pop() || new Date().toISOString();
            localStorage.setItem('site_custom_last_saved', newestServerTime);

            sessionStorage.setItem('site_last_automatic_reload', String(now));
            window.location.reload();
          } else {
            console.warn('Prevented potentially recursive fast-reload loop.');
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
