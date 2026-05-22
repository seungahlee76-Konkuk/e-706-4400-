/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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
