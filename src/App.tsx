import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { VesselExplorer } from './components/VesselExplorer';
import { Services } from './components/Services';
import { Parts } from './components/Parts';
import { Boats } from './components/Boats';
import { Yard } from './components/Yard';
import { Surveys } from './components/Surveys';
import { About } from './components/About';
import { EnquirySection, EnquiryTabType } from './components/EnquirySection';
import { Footer } from './components/Footer';
import { ContactInfo } from './components/ContactInfo';
import { WhatsAppButton } from './components/WhatsAppButton';
import { BackToTop } from './components/BackToTop';
import { BackgroundMusic } from './components/BackgroundMusic';

export function App() {
  const [enquiryTab, setEnquiryTab] = useState<EnquiryTabType>('spare-parts');
  const [prefillSubject, setPrefillSubject] = useState('');

  const triggerEnquiry = (tab: EnquiryTabType, subject = '') => {
    setEnquiryTab(tab);
    setPrefillSubject(subject);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-white text-ink">
      <Header onEnquire={() => triggerEnquiry('spare-parts')} />
      <main className="flex-1">
        <Hero onEnquire={triggerEnquiry} />
        <VesselExplorer onEnquire={triggerEnquiry} />
        <Services onEnquire={triggerEnquiry} />
        <Parts onEnquire={triggerEnquiry} />
        <Boats onEnquire={triggerEnquiry} />
        <Yard />
        <Surveys onEnquire={triggerEnquiry} />
        <About />
        <EnquirySection
          activeTab={enquiryTab}
          setActiveTab={setEnquiryTab}
          prefillSubject={prefillSubject}
        />
        <ContactInfo />
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <BackgroundMusic />
    </div>
  );
}

export default App;
