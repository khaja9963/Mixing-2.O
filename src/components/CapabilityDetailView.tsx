import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Mail,
  MapPin,
  CheckCircle2,
  Award,
} from 'lucide-react';

export interface CapabilityDetailViewProps {
  capabilityNum: string | null; // '01', '02', ..., '09'
  onClose: () => void;
  onContactClick?: () => void;
}

export const CapabilityDetailView: React.FC<CapabilityDetailViewProps> = ({
  capabilityNum,
  onClose,
  onContactClick,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (!capabilityNum) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [capabilityNum, onClose]);

  const renderSharedCTA = () => (
    <div className="mt-16 pt-10 border-t-2 border-slate-900">
      {/* Shared Address Footer */}
      <div className="text-xs text-slate-600 grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        <div className="space-y-1">
          <span className="font-extrabold text-slate-900 text-sm block">Corporate Head Office</span>
          <p className="flex items-start gap-2 leading-relaxed text-slate-700">
            <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <span>12A01A, 13th Floor, Manjeera Trinity Corporate, JNTU-Hitech City Road, Kukatpally, Hyderabad, Telangana 500072</span>
          </p>
        </div>
        <div className="space-y-1">
          <span className="font-extrabold text-slate-900 text-sm block">Direct Contact</span>
          <p className="flex items-center gap-2 font-semibold text-slate-800">
            <Mail className="w-4 h-4 text-blue-600 shrink-0" />
            <span>contact@clyptus.com</span>
          </p>
        </div>
      </div>
    </div>
  );

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {capabilityNum && (
        <motion.div
          key="capability-detail-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-white w-screen h-screen flex flex-col font-sans text-slate-900 overflow-hidden"
        >
          {/* Simple Back Button Frozen at Top-Left */}
          <div className="fixed top-5 left-5 sm:top-6 sm:left-8 z-50">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs shadow-lg backdrop-blur-md transition-all border border-slate-700 cursor-pointer group hover:scale-105 active:scale-95"
              aria-label="Back to capabilities"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-blue-400 group-hover:text-white" />
              <span>Back</span>
            </button>
          </div>

          {/* Scrollable Document Area */}
          <div className="flex-1 w-full h-full overflow-y-auto overscroll-contain">
            <main className="w-full max-w-4xl mx-auto px-4 sm:px-8 pt-20 sm:pt-24 pb-28">
              <div className="space-y-12">
            
            {/* ================= 01. SAP S/4HANA ================= */}
            {capabilityNum === '01' && (
              <div className="space-y-10">
                {/* Document Title Header */}
                <div className="border-b-2 border-slate-900 pb-6">
                  <span className="px-3 py-1 rounded bg-blue-50 text-blue-700 font-mono text-xs font-black inline-block mb-3">
                    SILVER SAP PARTNER
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                    SAP S/4HANA Implementation, Conversion and Support
                  </h1>
                  <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed max-w-3xl">
                    Clyptus helps businesses plan, move to and run SAP S/4HANA. As a Silver SAP partner, we cover the whole journey: roadmap, implementation, conversion from ECC, development, and support after go-live.
                  </p>
                </div>

                {/* What We Do - Editorial List (NO CARDS) */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider">
                      What We Do
                    </h3>
                    <span className="text-xs font-mono text-slate-500 font-bold">
                      Core S/4HANA Service Catalog
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200">
                    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <div className="sm:w-1/3">
                        <h4 className="font-extrabold text-slate-900 text-base">S/4HANA roadmap & strategy</h4>
                      </div>
                      <div className="sm:w-2/3">
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                          Assess the current landscape, build the business case and sequence the move.
                        </p>
                      </div>
                    </div>

                    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <div className="sm:w-1/3">
                        <h4 className="font-extrabold text-slate-900 text-base">S/4HANA implementation</h4>
                      </div>
                      <div className="sm:w-2/3">
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                          Greenfield implementation across core finance, logistics and supply chain processes.
                        </p>
                      </div>
                    </div>

                    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <div className="sm:w-1/3">
                        <h4 className="font-extrabold text-slate-900 text-base">S/4HANA conversion</h4>
                      </div>
                      <div className="sm:w-2/3">
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                          Brownfield conversion from ECC, including readiness checks and custom-code remediation.
                        </p>
                      </div>
                    </div>

                    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <div className="sm:w-1/3">
                        <h4 className="font-extrabold text-slate-900 text-base">S/4HANA development</h4>
                      </div>
                      <div className="sm:w-2/3">
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                          ABAP and Fiori development, extensions and custom reports on the new stack.
                        </p>
                      </div>
                    </div>

                    <div id="rise" className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <div className="sm:w-1/3">
                        <h4 className="font-extrabold text-blue-900 text-base">RISE with SAP</h4>
                      </div>
                      <div className="sm:w-2/3">
                        <p className="text-sm text-blue-950 font-medium leading-relaxed">
                          Advising on the cloud move that SAP packages as RISE, and delivering the migration behind it.
                        </p>
                      </div>
                    </div>

                    <div id="support" className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <div className="sm:w-1/3">
                        <h4 className="font-extrabold text-orange-900 text-base">Application support</h4>
                      </div>
                      <div className="sm:w-2/3">
                        <p className="text-sm text-orange-950 font-medium leading-relaxed">
                          Post go-live support: incidents, enhancements and release updates, under a response model agreed with you up front.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* How an S/4HANA Programme Runs - Timeline List (NO CARDS) */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider">
                      How an S/4HANA programme runs
                    </h3>
                  </div>

                  <div className="space-y-6 pl-2 border-l-2 border-blue-600 ml-2">
                    {[
                      { num: '01', title: 'Review the current ERP', desc: 'Map siloed or legacy systems.' },
                      { num: '02', title: 'Transformation roadmap', desc: 'Strategy, assessment and plan.' },
                      { num: '03', title: 'Process reengineering', desc: 'Optimize and standardize the processes.' },
                      { num: '04', title: 'Migration and integration', desc: 'Migrate to the new platform and integrate it.' },
                      { num: '05', title: 'Run and improve', desc: 'Support, then scale on the new platform.' },
                    ].map((step) => (
                      <div key={step.num} className="pl-6 relative">
                        <span className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-blue-600 text-white font-mono text-xs font-black flex items-center justify-center ring-4 ring-white">
                          {step.num}
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 mb-1">{step.title}</h4>
                        <p className="text-sm text-slate-600 font-medium">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industries */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-black text-slate-900 uppercase font-mono tracking-wider border-b border-slate-200 pb-2">
                    Target Industries
                  </h3>
                  <ul className="text-sm text-slate-800 font-semibold space-y-2 list-disc list-inside">
                    <li>Manufacturing & building materials</li>
                    <li>Energy and oil & gas services</li>
                  </ul>
                  <p className="text-xs text-slate-400 font-mono italic pt-1">
                    Pharma, retail and automotive stay off until management confirms them.
                  </p>
                </div>

                {/* Proof & Projects */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider">
                      Proof and projects
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-3 text-sm text-slate-700 font-medium border-l-4 border-blue-600 pl-4 py-1">
                      <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-extrabold block">Silver SAP Partner</strong>
                        <p className="text-slate-600 mt-1">
                          First international SAP project delivered in Dubai, followed by major SAP implementations in the UAE and India.
                        </p>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-200 border-y border-slate-200">
                      <div className="py-5 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-extrabold text-blue-700 uppercase">PROJECT 01</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-semibold text-slate-500">SAP Migration in Malaysia</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                          SAP migration for a manufacturer in Malaysia, delivered close to completion in record time, with a joint project-manager and technical-lead team supported by senior consultants.
                        </p>
                        <p className="text-xs text-slate-500 font-mono italic pt-1">
                          Client&apos;s words: use the testimonial already on clyptus.com
                        </p>
                      </div>

                      <div className="py-5 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-extrabold text-blue-700 uppercase">PROJECT 02</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-semibold text-slate-500">Full SAP Implementation</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                          A full SAP implementation delivered successfully. The client singled out the project communication and attention to detail.
                        </p>
                        <p className="text-xs text-slate-500 font-mono italic pt-1">
                          Client&apos;s words: use the testimonial already on clyptus.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider">
                      Frequently Asked Questions (FAQs)
                    </h3>
                  </div>

                  <div className="divide-y divide-slate-200">
                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">What is SAP S/4HANA?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        SAP S/4HANA is SAP&apos;s current ERP suite, built to run on the SAP HANA database. It covers finance, logistics, supply chain and other core business processes in one system.
                      </p>
                    </div>

                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">Can you move us from SAP ECC to S/4HANA?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        Yes. We handle brownfield conversions from ECC as well as greenfield S/4HANA implementations, starting with a readiness assessment and a roadmap so you know the scope before you commit.
                      </p>
                    </div>

                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">What is RISE with SAP, and do you support it?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        RISE with SAP is SAP&apos;s packaged route to running S/4HANA in the cloud. We advise on whether it fits your landscape and deliver the migration and process change that follow.
                      </p>
                    </div>

                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">Do you support the system after go-live?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        Yes. We provide application management and support covering incidents, enhancements and release updates, under a response model agreed with you up front.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ================= 02. SAP CLOUD SERVICES ================= */}
            {capabilityNum === '02' && (
              <div className="space-y-10">
                <div className="border-b-2 border-slate-900 pb-6">
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                    SAP Cloud Services
                  </h1>
                  <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed max-w-3xl">
                    Clyptus helps businesses run SAP in the cloud. We advise on the move, deliver the migration and support the system afterwards.
                  </p>
                </div>

                {/* What We Do - Verbatim Bullet Ledger */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider">
                      What We Do
                    </h3>
                  </div>

                  <div className="divide-y divide-slate-200 border-y border-slate-200">
                    <div className="py-4 flex items-start gap-4">
                      <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">SAP cloud deployment and services</h4>
                      </div>
                    </div>

                    <div className="py-4 flex items-start gap-4">
                      <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                          <span>RISE with SAP</span>
                          <span className="text-xs font-normal text-slate-500 font-mono">(advice on fit and delivery of the migration)</span>
                        </h4>
                        <a
                          href="#rise"
                          onClick={(e) => {
                            e.preventDefault();
                            onClose();
                            const el = document.getElementById('core-capabilities');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="inline-flex items-center text-xs font-bold text-blue-600 hover:underline mt-1"
                        >
                          → Link to the RISE section on the S/4HANA page (#rise)
                        </a>
                      </div>
                    </div>

                    <div className="py-4 flex items-start gap-4">
                      <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">Cloud ERP migration and integration</h4>
                      </div>
                    </div>

                    <div className="py-4 flex items-start gap-4">
                      <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                          <span>Support after go-live</span>
                        </h4>
                        <a
                          href="#support"
                          onClick={(e) => {
                            e.preventDefault();
                            onClose();
                            const el = document.getElementById('core-capabilities');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="inline-flex items-center text-xs font-bold text-blue-600 hover:underline mt-1"
                        >
                          → Link to the support panel (#support)
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ================= 03. SAP BTP AND ADD-ONS ================= */}
            {capabilityNum === '03' && (
              <div className="space-y-10">
                <div className="border-b-2 border-slate-900 pb-6">
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                    SAP BTP and add-on solutions
                  </h1>
                  <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed max-w-3xl">
                    SAP Business Technology Platform (BTP) is SAP&apos;s platform for building extensions and integrations around the core SAP system. Clyptus runs a BTP practice and builds custom SAP add-on solutions.
                  </p>
                </div>

                {/* What We Do */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider">
                      What We Do
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-200 border-y border-slate-200">
                    <div className="py-4 flex items-start gap-4">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">Extensions built on BTP, alongside the core SAP system</h4>
                      </div>
                    </div>
                    <div className="py-4 flex items-start gap-4">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">Custom SAP add-on solutions</h4>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ================= 04. SAP HCM ================= */}
            {capabilityNum === '04' && (
              <div className="space-y-10">
                <div className="border-b-2 border-slate-900 pb-6">
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                    SAP HCM
                  </h1>
                  <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed max-w-3xl">
                    SAP HCM is SAP&apos;s solution for human capital management. It has been part of Clyptus&apos;s SAP practice since the company was founded in 2014.
                  </p>
                </div>

                {/* Related Section */}
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider border-b border-slate-200 pb-2">
                    Related
                  </h3>
                  <div className="border-l-4 border-orange-500 pl-4 py-2 space-y-1 text-sm text-slate-700">
                    <strong className="text-slate-900 font-extrabold block">Need SAP HCM or SuccessFactors specialists?</strong>
                    <p className="text-slate-600 font-medium">
                      Visit our <a href="#contact" onClick={(e) => { e.preventDefault(); onClose(); if (onContactClick) onContactClick(); }} className="text-orange-600 font-bold hover:underline">Talent Acquisition page</a> to explore specialized recruitment and placement models.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* ================= 05. SAP BRIM ================= */}
            {capabilityNum === '05' && (
              <div className="space-y-10">
                {/* Meta Header */}
                <div className="border-b-2 border-slate-900 pb-6">
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                    SAP BRIM Implementation and Consulting
                  </h1>
                  <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed max-w-3xl">
                    SAP BRIM (Billing and Revenue Innovation Management) is SAP&apos;s suite for subscription billing, usage-based charging, invoicing and revenue management. Clyptus covers the whole lifecycle, from subscription order capture to financial settlement and reporting, and connects it to S/4HANA. We work with any company, whether you are starting fresh or moving from an existing system.
                  </p>
                </div>

                {/* What We Do */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider">
                      What We Do
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-200 border-y border-slate-200">
                    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base sm:w-1/3">Greenfield implementation</h4>
                      <p className="text-sm text-slate-600 font-medium sm:w-2/3 leading-relaxed">
                        A new SAP BRIM build for companies starting subscription, usage-based or invoicing operations from scratch.
                      </p>
                    </div>
                    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base sm:w-1/3">Brownfield migration and upgrades</h4>
                      <p className="text-sm text-slate-600 font-medium sm:w-2/3 leading-relaxed">
                        Moving an existing billing or revenue setup onto SAP BRIM, or upgrading a BRIM system you already run.
                      </p>
                    </div>
                    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base sm:w-1/3">Application management and support</h4>
                      <p className="text-sm text-slate-600 font-medium sm:w-2/3 leading-relaxed">
                        We help you after go-live, with L2 and L3 support and enhancements.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modules We Cover */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider">
                      Modules We Cover
                    </h3>
                    <span className="text-xs font-mono text-slate-400 font-bold">WHAT CLYPTUS COVERS</span>
                  </div>
                  <div className="divide-y divide-slate-200 border-y border-slate-200">
                    {[
                      { name: 'Subscription Order Management', desc: 'Master data setup, product catalog design, subscription lifecycle management, order orchestration, contract master configuration.' },
                      { name: 'Convergent Charging', desc: 'Rating engine configuration, pricing strategy, charge calculation logic, aggregation rules, real-time usage monetization.' },
                      { name: 'Convergent Invoicing', desc: 'Invoice document generation, multi-format output, billing run optimization, invoice consolidation, mass processing.' },
                      { name: 'Convergent Mediation', desc: 'Collecting, validating and transforming high-volume usage data, then passing it to Convergent Charging.' },
                      { name: 'FI-CA and RAR', desc: 'Contract accounts receivable, payment processing, clearing and reconciliation, revenue recognition compliance (ASC 606 / IFRS 15), S/4HANA integration.' },
                      { name: 'BRIM Technical', desc: 'ABAP development and enhancements, Convergent Invoicing tuning, integration support (PI/PO, CPI).' },
                    ].map((m) => (
                      <div key={m.name} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="sm:w-1/3">
                          <h4 className="font-extrabold text-slate-900 text-sm">{m.name}</h4>
                        </div>
                        <p className="sm:w-2/3 text-sm text-slate-600 font-medium leading-relaxed">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Industries */}
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider border-b border-slate-200 pb-2">
                    Industries
                  </h3>
                  <ul className="text-sm text-slate-800 font-semibold space-y-2 list-disc list-inside">
                    <li>Telecommunications (usage-based billing for voice, data, IoT)</li>
                    <li>Utilities (meter-to-cash)</li>
                    <li>SaaS & subscription businesses</li>
                    <li>Digital platforms (API monetization)</li>
                    <li>Media & OTT</li>
                    <li>Insurance</li>
                    <li>High-tech</li>
                  </ul>
                </div>

                {/* Projects */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider">
                      Projects
                    </h3>
                  </div>

                  {/* Featured Case Study Table */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono font-extrabold text-blue-700 uppercase block">
                      FEATURED PROJECT: HIGH-VOLUME AIRLINE USAGE BILLING
                    </span>
                    <div className="border border-slate-200 divide-y divide-slate-200 text-xs">
                      <div className="bg-slate-50 p-3 font-mono font-bold text-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <span>CHALLENGE</span>
                        <span>WHAT WE DID</span>
                      </div>
                      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 leading-relaxed">
                        <span className="font-semibold text-slate-900">Very high volume of usage transactions that needed raw-data preprocessing</span>
                        <span className="text-slate-600">Mediation pipelines enriched the records before they reached SAP Convergent Charging.</span>
                      </div>
                      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 leading-relaxed">
                        <span className="font-semibold text-slate-900">Varied revenue-share rules</span>
                        <span className="text-slate-600">Configurable revenue-share logic in SAP Convergent Charging.</span>
                      </div>
                      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 leading-relaxed">
                        <span className="font-semibold text-slate-900">Dynamic, tier-based pricing</span>
                        <span className="text-slate-600">Cumulative tier calculation in SAP Convergent Charging, with mapping tables for common pricing parameters.</span>
                      </div>
                      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 leading-relaxed">
                        <span className="font-semibold text-slate-900">Multiple agreements and duplicated charge plans</span>
                        <span className="text-slate-600">A master agreement approach and contract-based tier and revenue logic, which reduced charge plan duplication.</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">
                      Tools used: consumption mediation, SAP Convergent Charging, SAP Subscription Management, SAP Convergent Invoicing, SoapUI with Groovy scripting, custom APIs and an automated regression test suite. The project team built every solution internally.
                    </p>
                  </div>

                  {/* Four More Sector Cards */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-mono font-extrabold text-slate-500 uppercase block">
                      FOUR MORE PROJECT SNAPSHOTS (INDUSTRY ONLY)
                    </span>
                    <div className="divide-y divide-slate-200 border-y border-slate-200 text-xs">
                      <div className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <span className="font-extrabold text-slate-900 sm:w-1/4 text-sm">Insurance</span>
                        <span className="text-slate-600 sm:w-3/4">Automated premiums from live data, flexible risk-based pricing and integrated billing across Fiori, SOM, CI and CC.</span>
                      </div>
                      <div className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <span className="font-extrabold text-slate-900 sm:w-1/4 text-sm">Telecom</span>
                        <span className="text-slate-600 sm:w-3/4">Subscription billing with SAP BRIM and automated contract management for telecom enterprise billing.</span>
                      </div>
                      <div className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <span className="font-extrabold text-slate-900 sm:w-1/4 text-sm">High-tech</span>
                        <span className="text-slate-600 sm:w-3/4">Transformed and enhanced the subscription billing model, modernized BRM processes and automated order-to-cash operations.</span>
                      </div>
                      <div className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <span className="font-extrabold text-slate-900 sm:w-1/4 text-sm">Utilities</span>
                        <span className="text-slate-600 sm:w-3/4">Work order management and revenue processes for integrated utilities solutions.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* How We Work */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider">
                      How We Work
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-200 border-y border-slate-200 text-sm">
                    <div className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 sm:w-1/3">Dedicated pod</h4>
                      <p className="text-slate-600 font-medium sm:w-2/3">3 to 10 BRIM specialists allocated full time as an extension of your delivery team.</p>
                    </div>
                    <div className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 sm:w-1/3">Offshore managed service</h4>
                      <p className="text-slate-600 font-medium sm:w-2/3">Accountability for defined BRIM operations: L2/L3 support, billing execution and enhancements, with SLA-driven quality metrics.</p>
                    </div>
                    <div className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 sm:w-1/3">Hybrid India and onsite</h4>
                      <p className="text-slate-600 font-medium sm:w-2/3">Development, configuration, testing and operational support split between offshore and onsite teams.</p>
                    </div>
                    <div className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 sm:w-1/3">Individual niche consultants</h4>
                      <p className="text-slate-600 font-medium sm:w-2/3">On-demand experts in CC, CI and RAR, on contract or contract-to-hire terms.</p>
                    </div>
                  </div>
                </div>

                {/* BRIM Centre of Excellence */}
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider border-b border-slate-200 pb-2">
                    BRIM Centre of Excellence
                  </h3>
                  <ul className="text-sm text-slate-700 font-medium space-y-2.5 list-disc list-inside">
                    <li><strong className="text-slate-900">Live BRIM sandbox</strong> with SOM, CC, CI and FI-CA, multiple industry scenarios and realistic master data</li>
                    <li><strong className="text-slate-900">Invoice simulation framework</strong>: proration, usage-based charges, subscriptions, one-time fees, discounts and tax</li>
                    <li><strong className="text-slate-900">CC rating scenario library</strong> for telecom, utilities, SaaS and digital platforms</li>
                    <li><strong className="text-slate-900">FI-CA reconciliation labs</strong>: payment processing, clearing, dunning, disputes and period-end closing</li>
                    <li><strong className="text-slate-900">Performance tuning toolkit</strong> with benchmarking, database tuning scripts and monitoring dashboards</li>
                  </ul>
                </div>

                {/* FAQs */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider">
                      Frequently Asked Questions (FAQs)
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-200 border-y border-slate-200">
                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">What is SAP BRIM?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        SAP BRIM is SAP&apos;s suite for subscription billing, usage-based charging, invoicing and revenue management. It brings order capture, charging, invoicing, receivables and revenue accounting together.
                      </p>
                    </div>
                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">Which BRIM modules does Clyptus cover?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        Subscription Order Management, Convergent Charging, Convergent Invoicing, Convergent Mediation, FI-CA, Revenue Accounting and Reporting, and the technical ABAP and integration work around them.
                      </p>
                    </div>
                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">Can BRIM connect to our S/4HANA system?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        Yes. Our work includes S/4HANA integration for contract accounts receivable and revenue recognition, and integration support through PI/PO and CPI.
                      </p>
                    </div>
                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">Do you support BRIM after go-live?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        Yes. We offer application management, including L2 and L3 support, billing execution and enhancements, with SLA-driven quality metrics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 06. SAP AI (JOULE) ================= */}
            {capabilityNum === '06' && (
              <div className="space-y-10">
                {/* Meta Header */}
                <div className="border-b-2 border-slate-900 pb-6">
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                    SAP AI and Joule on SAP S/4HANA
                  </h1>
                  <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed max-w-3xl">
                    Joule is SAP&apos;s AI copilot, built into SAP applications. Clyptus helps you adopt it, along with the machine learning and analytics already built into S/4HANA, and put them to work on your finance, supply chain and operations processes.
                  </p>
                </div>

                {/* What We Do */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider">
                      What We Do
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-200 border-y border-slate-200">
                    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base sm:w-1/3">Joule and AI inside S/4HANA</h4>
                      <p className="text-sm text-slate-600 font-medium sm:w-2/3 leading-relaxed">
                        Helping you adopt Joule and put the machine-learning and advanced analytics already built into S/4HANA to work on your processes.
                      </p>
                    </div>
                    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base sm:w-1/3">Dashboards and predictive models</h4>
                      <p className="text-sm text-slate-600 font-medium sm:w-2/3 leading-relaxed">
                        Built on ERP and operational data, so leadership can see the business without waiting for a report.
                      </p>
                    </div>
                    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base sm:w-1/3">Automation around SAP</h4>
                      <p className="text-sm text-slate-600 font-medium sm:w-2/3 leading-relaxed">
                        Automating the repetitive steps around ERP: document handling, master-data checks, approvals and reconciliations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* What a First Project Looks Like */}
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider border-b border-slate-200 pb-2">
                    What a first project looks like
                  </h3>
                  <div className="border-l-4 border-emerald-600 pl-4 py-2 text-sm text-slate-700">
                    <p className="font-medium leading-relaxed">
                      A short discovery on a single use-case, with a defined output at the end, so you can judge the value before committing to a larger programme.
                    </p>
                  </div>
                </div>

                {/* Proof */}
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider border-b border-slate-200 pb-2">
                    Proof
                  </h3>
                  <div className="space-y-3 text-sm text-slate-700 font-medium">
                    <div className="flex items-start gap-3 border-l-4 border-blue-600 pl-4 py-1">
                      <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-extrabold block">Silver SAP Partner</strong>
                        <p className="text-slate-600">Same partner status and delivery standards as our core SAP pages.</p>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-200 border-y border-slate-200 py-3">
                      <div className="space-y-1">
                        <span className="text-xs font-mono font-extrabold text-emerald-700 uppercase block">ANALYTICS DASHBOARDS ON ERP DATA</span>
                        <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                          Analytics dashboards on high-volume ERP data for an energy-services company, delivered with live filtering.
                        </p>
                        <p className="text-xs text-slate-500 font-mono italic pt-1">
                          Client&apos;s words: the CEO testimonial already on clyptus.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider">
                      Frequently Asked Questions (FAQs)
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-200 border-y border-slate-200">
                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">What is SAP Joule?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        Joule is SAP&apos;s AI copilot. It is built into SAP applications so people can ask questions and get help in plain language. Clyptus helps you adopt it and decide where it fits in your processes.
                      </p>
                    </div>

                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">Can you work with our SAP or ERP data?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        Yes, and that is usually the starting point. Our consultants know the underlying ERP data model, so the analysis reflects how the business actually runs.
                      </p>
                    </div>

                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">What does a first engagement look like?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        A short discovery on a single use case with a defined output at the end, so you can judge the value before committing to a larger programme.
                      </p>
                    </div>

                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">Do you build from scratch or use existing platforms?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        Both. Where a proven analytics or automation platform solves the problem we configure it, because it is faster and cheaper. Where nothing fits, we build.
                      </p>
                    </div>

                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">How do you handle our data and confidentiality?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        Work is done under NDA, with access limited to the named project team and data handled according to the terms agreed in the contract.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 07. SAP AMS AND SUPPORT ================= */}
            {capabilityNum === '07' && (
              <div className="space-y-10">
                {/* Meta Header */}
                <div className="border-b-2 border-slate-900 pb-6">
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                    SAP application management and support
                  </h1>
                  <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed max-w-3xl">
                    Go-live is the start, not the end. Clyptus provides application management and support for your SAP system after it goes live, under a response model agreed with you up front.
                  </p>
                </div>

                {/* What Support Covers */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider">
                      What support covers
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-200 border-y border-slate-200">
                    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base sm:w-1/3">Incidents</h4>
                      <p className="text-sm text-slate-600 font-medium sm:w-2/3 leading-relaxed">
                        Fixing issues that users raise, so the business keeps running.
                      </p>
                    </div>
                    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base sm:w-1/3">Enhancements</h4>
                      <p className="text-sm text-slate-600 font-medium sm:w-2/3 leading-relaxed">
                        Changes and improvements to the system after go-live.
                      </p>
                    </div>
                    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base sm:w-1/3">Release updates</h4>
                      <p className="text-sm text-slate-600 font-medium sm:w-2/3 leading-relaxed">
                        Applying SAP release updates in your system.
                      </p>
                    </div>
                  </div>
                </div>

                {/* For SAP BRIM */}
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider border-b border-slate-200 pb-2">
                    For SAP BRIM
                  </h3>
                  <div className="border-l-4 border-blue-600 pl-4 py-2 text-sm text-slate-700 font-medium">
                    <p className="leading-relaxed">
                      For BRIM, support includes L2 and L3 support, billing execution and enhancements, with SLA-driven quality metrics.
                    </p>
                  </div>
                </div>

                {/* How We Work Together */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider">
                      How we work together
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-200 border-y border-slate-200">
                    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base sm:w-1/3">Managed service team</h4>
                      <p className="text-sm text-slate-600 font-medium sm:w-2/3 leading-relaxed">
                        A team that takes accountability for defined support operations.
                      </p>
                    </div>
                    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base sm:w-1/3">Offshore managed service</h4>
                      <p className="text-sm text-slate-600 font-medium sm:w-2/3 leading-relaxed">
                        Support run from India, with SLA-driven quality metrics.
                      </p>
                    </div>
                    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base sm:w-1/3">Hybrid onsite and offshore</h4>
                      <p className="text-sm text-slate-600 font-medium sm:w-2/3 leading-relaxed">
                        Operational support split between offshore and onsite teams, scaled to the project.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase font-mono tracking-wider">
                      Frequently Asked Questions (FAQs)
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-200 border-y border-slate-200">
                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">Do you support the system after go-live?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        Yes. We provide application management and support covering incidents, enhancements and release updates, under a response model agreed with you up front.
                      </p>
                    </div>

                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">What does support cover?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        Incidents, enhancements and release updates. For SAP BRIM it also includes L2 and L3 support and billing execution.
                      </p>
                    </div>

                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">How can we work with Clyptus on support?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        Through a managed service team, an offshore managed service or a hybrid onsite and offshore model.
                      </p>
                    </div>

                    <div className="py-4 space-y-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">Can you take over a system someone else built?</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        Please talk to us about your landscape. We agree the scope and the response model with you before support starts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 08 & 09. ORACLE CLOUD ERP & DYNAMICS 365 ================= */}
            {(capabilityNum === '08' || capabilityNum === '09') && (
              <div className="space-y-8">
                <div className="border-b-2 border-slate-900 pb-6">
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                    {capabilityNum === '08' ? 'Oracle Cloud ERP Services' : 'Microsoft Dynamics 365 Services'}
                  </h1>
                  <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed max-w-3xl">
                    {capabilityNum === '08'
                      ? 'Oracle Cloud ERP implementation, data migration, and application management services for enterprise landscapes.'
                      : 'Microsoft Dynamics 365 ERP & CRM implementation, custom extensions, and SLA-driven support services.'}
                  </p>
                </div>
              </div>
            )}

            {/* Shared Global Call to Action (CTA Block) */}
            {renderSharedCTA()}
          </div>
        </main>
      </div>
    </motion.div>
    )}
  </AnimatePresence>,
  document.body
);
};
